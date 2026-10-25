import { ArrowUpRight, CheckCircle2, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { trackEvent } from "../data/analytics.js";
import { contactConfig, getWhatsAppHref } from "../data/contact.js";
import { serviceOfferings } from "../data/services.js";
import { isSupabaseConfigured, supabase } from "../lib/supabase.js";
import { RecIndicator } from "../components/StudioGraphics.jsx";

function createEmailBody(data) {
  return [
    `Name: ${data.name}`,
    `Company / Brand: ${data.company || "Not provided"}`,
    `Email: ${data.email || "Not provided"}`,
    `Phone / WhatsApp: ${data.phone || "Not provided"}`,
    `Service Suite: ${data.service || "Not selected"}`,
    `Reference Link: ${data.referenceUrl || "None"}`,
    `Timeline / Deadline: ${data.deadline || "Not specified"}`,
    "",
    "Project Brief & Footage Details:",
    data.requirements || "Not provided",
  ].join("\n");
}

export default function ContactPage() {
  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get("service") || "";
  const requestedProject = searchParams.get("project") || "";
  const validService = serviceOfferings.some(
    (service) => service.enquiryValue === requestedService || service.title.toLowerCase() === requestedService.toLowerCase(),
  )
    ? serviceOfferings.find(
        (service) => service.enquiryValue === requestedService || service.title.toLowerCase() === requestedService.toLowerCase(),
      )?.enquiryValue || ""
    : "";
  const whatsAppHref = getWhatsAppHref(
    "Hi VIP StudioS, I'd like to discuss a video editing or creative project.",
  );

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;
    setStatus("");

    const form = event.currentTarget;
    const fields = new FormData(form);
    if (String(fields.get("websiteTrap") || "").trim()) return;

    if (!form.reportValidity()) {
      setStatus("Please correct highlighted fields before submitting.");
      return;
    }

    const data = Object.fromEntries(
      [
        "name",
        "company",
        "email",
        "phone",
        "service",
        "deadline",
        "referenceUrl",
        "requirements",
      ].map((key) => [key, String(fields.get(key) || "").trim()]),
    );

    const emailField = form.elements.namedItem("email");
    const phoneField = form.elements.namedItem("phone");
    if (!data.email && !data.phone) {
      setStatus("Please supply an email address or phone number so we can respond.");
      emailField.setCustomValidity("Enter an email or phone number.");
      phoneField.setCustomValidity("Enter an email or phone number.");
      emailField.reportValidity();
      return;
    }
    emailField.setCustomValidity("");
    phoneField.setCustomValidity("");

    if (isSupabaseConfigured && supabase) {
      setIsSubmitting(true);
      setStatus("Connecting to studio ingest database…");
      try {
        const { error } = await supabase.from("enquiries").insert({
          name: data.name,
          company: data.company,
          email: data.email,
          phone: data.phone,
          service: data.service,
          deadline: data.deadline,
          requirements: data.referenceUrl
            ? `${data.requirements}\n\n[References: ${data.referenceUrl}]`
            : data.requirements,
          source: "website",
        });

        if (error) {
          setStatus("Direct submission temporarily unavailable. Opening email client fallback…");
          // Fallback to mailto
          openEmailFallback(data);
          return;
        }

        trackEvent("project_brief_submitted", { service_name: data.service });
        setIsSuccess(true);
        form.reset();
        setStatus("Your project brief has been logged in our cutting desk. We will review and reply within 24 hours.");
      } catch (err) {
        openEmailFallback(data);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    openEmailFallback(data);
  }

  function openEmailFallback(data) {
    if (!contactConfig.email) {
      setStatus("Email dispatch not configured. Please message us on WhatsApp directly.");
      return;
    }
    const subject = `[Project Brief] ${data.name} — ${data.service || "Video Editing"}`;
    const params = new URLSearchParams({
      subject,
      body: createEmailBody(data),
    });
    setStatus("Opening your email client with your pre-formatted project brief…");
    trackEvent("project_brief_draft_opened", { service_name: data.service });
    window.location.href = `mailto:${contactConfig.email}?${params.toString()}`;
  }

  function clearContactValidation(event) {
    const form = event.currentTarget.form;
    form.elements.namedItem("email")?.setCustomValidity("");
    form.elements.namedItem("phone")?.setCustomValidity("");
  }

  return (
    <section className="studio-page studio-contact-page">
      <div className="studio-contact-layout grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Studio Pitch & Direct Channels */}
        <div className="lg:col-span-5 studio-contact-copy">
          <div className="flex items-center gap-2 mb-3">
            <RecIndicator />
            <p className="studio-location m-0 font-mono text-xs uppercase tracking-widest text-[#FF6542]">
              COMMISSION INGEST // 2026
            </p>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#19162B] tracking-tight leading-none mb-4">
            Let&apos;s make
            <br />
            something
            <br />
            <span className="text-[#FF6542]">worth watching.</span>
          </h1>

          <p className="text-base text-[#6E6A7C] leading-relaxed mb-8">
            Tell us about your footage, deadlines, and narrative goals. Whether you need
            a single high-converting edit or a continuous content pipeline, our cutting room
            is ready.
          </p>

          <div className="studio-contact-methods flex flex-col gap-3">
            <div>
              <Mail aria-hidden="true" size={18} />
              <span>Direct Email</span>
              {contactConfig.email ? (
                <a href={`mailto:${contactConfig.email}`}>{contactConfig.email}</a>
              ) : (
                <span className="studio-contact-unavailable">studio@vipstudios.pages.dev</span>
              )}
            </div>

            {contactConfig.phoneNumber && (
              <div>
                <Phone aria-hidden="true" size={18} />
                <span>Studio Line</span>
                <a href={`tel:+${contactConfig.phoneNumber}`}>{contactConfig.phoneDisplay}</a>
              </div>
            )}

            <div>
              <MessageCircle aria-hidden="true" size={18} className="text-[#25D366]" />
              <span>WhatsApp</span>
              {whatsAppHref ? (
                <a
                  className="font-bold text-[#19162B] hover:text-[#25D366]"
                  href={whatsAppHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  Start Fast Chat <ArrowUpRight size={13} />
                </a>
              ) : (
                <span className="studio-contact-unavailable">Configured in production</span>
              )}
            </div>
          </div>

          <div className="mt-8 p-5 rounded-xl bg-[#F4F1FF] border border-[#7765F8]/20 font-mono text-xs text-[#7765F8]">
            <strong className="block font-bold mb-1">// RESPONSE SLA</strong>
            <span>All briefs reviewed by a lead editor within 24 hours.</span>
          </div>
        </div>

        {/* Right Column: Brief Form */}
        <div className="lg:col-span-7">
          <form className="studio-brief-form p-6 sm:p-10 rounded-2xl bg-white border border-[#EAE6E0] shadow-xl" noValidate onSubmit={handleSubmit}>
            <div className="studio-form-heading mb-6">
              <span className="font-mono text-xs font-bold text-[#FF6542] uppercase tracking-wider block mb-1">
                // PROJECT SPECIFICATION
              </span>
              <h2 className="text-2xl font-black text-[#19162B] m-0">Submit Project Brief</h2>
              <p className="text-xs text-[#6E6A7C] mt-1 m-0">Share what you know so far. We will guide the rest.</p>
            </div>

            {requestedProject && (
              <div className="mb-6 p-3.5 rounded-xl bg-[#F5F3FF] border border-[#635BFF]/30 flex items-center justify-between text-xs font-mono text-[#635BFF]">
                <span>Inquiring about cut style: <strong>&ldquo;{requestedProject}&rdquo;</strong></span>
                <span className="text-[10px] uppercase font-bold bg-[#635BFF] text-white px-2.5 py-0.5 rounded-full shadow-sm">Referenced Cut</span>
              </div>
            )}

            {isSuccess && (
              <div className="p-4 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
                <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
                <div>
                  <strong>Brief Logged Successfully!</strong>
                  <p className="m-0 text-xs mt-0.5">We have received your requirements and will reach out promptly.</p>
                </div>
              </div>
            )}

            <div className="studio-form-pair">
              <label>
                Your Name <span aria-hidden="true">*</span>
                <input autoComplete="name" maxLength={100} name="name" placeholder="Alex Rivers" required />
              </label>
              <label>
                Brand or Company
                <input autoComplete="organization" maxLength={120} name="company" placeholder="e.g. Apex Media or Creator Handle" />
              </label>
            </div>

            <div className="studio-form-pair">
              <label>
                Email Address
                <input
                  autoComplete="email"
                  maxLength={254}
                  name="email"
                  onChange={clearContactValidation}
                  placeholder="alex@example.com"
                  type="email"
                />
              </label>
              <label>
                Phone / WhatsApp Number
                <input
                  autoComplete="tel"
                  maxLength={30}
                  name="phone"
                  onChange={clearContactValidation}
                  placeholder="+91 98765 43210"
                  type="tel"
                />
              </label>
            </div>
            <p className="studio-field-hint">Provide at least one method (email or phone) for our response.</p>

            <div className="studio-form-pair">
              <label>
                Service Suite Required <span aria-hidden="true">*</span>
                <select defaultValue={validService} name="service" required>
                  <option value="">Select an editing suite</option>
                  {serviceOfferings.map((service) => (
                    <option key={service.slug} value={service.enquiryValue}>
                      {service.title}
                    </option>
                  ))}
                  <option value="A mix of services">Multi-Suite Package</option>
                  <option value="Not sure yet">Custom Consultation</option>
                </select>
              </label>

              <label>
                Target Delivery Window
                <input maxLength={100} name="deadline" placeholder="e.g. Next 7 Days / Monthly Retainer" />
              </label>
            </div>

            <label>
              Reference Links or Footage Cloud URL (Optional)
              <input
                maxLength={300}
                name="referenceUrl"
                placeholder="Google Drive, Frame.io, Dropbox, or YouTube style reference link"
                type="url"
              />
            </label>

            <label>
              Brief &amp; Project Requirements <span aria-hidden="true">*</span>
              <textarea
                defaultValue={
                  requestedProject
                    ? `I'm interested in a video cut style similar to your work on "${requestedProject}". Here are our footage details and goals:`
                    : ""
                }
                maxLength={3000}
                name="requirements"
                placeholder="Describe your project, footage volume, narrative style, audio preferences, and deliverables needed."
                required
                rows={4}
              />
            </label>

            {/* Anti-spam Honeypot */}
            <label aria-hidden="true" className="studio-trap-field" tabIndex="-1">
              Website
              <input autoComplete="off" name="websiteTrap" tabIndex="-1" />
            </label>

            <button
              className="button button-gold studio-submit w-full py-4 text-base font-bold shadow-lg mt-2"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                "Logging Project Brief…"
              ) : (
                <>
                  <span>Send Project Brief to Studio</span>
                  <Send size={16} />
                </>
              )}
            </button>

            <p aria-live="polite" className="studio-form-status mt-3 text-xs text-center text-[#6E6A7C]" role="status">
              {status || "Your brief is encrypted and transmitted directly to the studio editing desk."}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
