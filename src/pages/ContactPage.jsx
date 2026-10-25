import { ArrowUpRight, CheckCircle2, Clock, Mail, MessageCircle, Phone, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { trackEvent } from "../data/analytics.js";
import { contactConfig, getWhatsAppHref } from "../data/contact.js";
import { serviceOfferings } from "../data/services.js";
import { isSupabaseConfigured, supabase } from "../lib/supabase.js";
import { RecIndicator } from "../components/StudioGraphics.jsx";

const SERVICE_PILLS = [
  { label: "Commercial Video", value: "commercial-brand-film" },
  { label: "Reels & Short-form", value: "short-form-reels" },
  { label: "YouTube Editing", value: "youtube-management" },
  { label: "Podcast Production", value: "podcast-production" },
  { label: "Corporate Video", value: "corporate-culture-documentary" },
  { label: "Color & Sound Mix", value: "event-highlights-turnaround" },
];

const TIMELINE_OPTIONS = [
  "Within 48 hours (Rush)",
  "Next 5-7 days",
  "2-3 weeks",
  "Monthly Retainer",
];

function createEmailBody(data) {
  return [
    `Name: ${data.name}`,
    `Company / Brand: ${data.company || "Not provided"}`,
    `Email: ${data.email || "Not provided"}`,
    `Phone / WhatsApp: ${data.phone || "Not provided"}`,
    `Service Suite: ${data.service || "Not selected"}`,
    `Timeline: ${data.deadline || "Flexible"}`,
    `Reference / Footage Link: ${data.referenceUrl || "None"}`,
    "",
    "Project Requirements & Goals:",
    data.requirements || "Not provided",
  ].join("\n");
}

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get("service") || "";
  const requestedProject = searchParams.get("project") || "";

  const initialService =
    SERVICE_PILLS.find(
      (p) =>
        p.value === requestedService ||
        p.label.toLowerCase() === requestedService.toLowerCase(),
    )?.value ||
    (requestedService ? requestedService : SERVICE_PILLS[0].value);

  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedTimeline, setSelectedTimeline] = useState(TIMELINE_OPTIONS[1]);
  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientName, setClientName] = useState("");

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
      setStatus("Please fill in the required fields highlighted above.");
      return;
    }

    const name = String(fields.get("name") || "").trim();
    const company = String(fields.get("company") || "").trim();
    const email = String(fields.get("email") || "").trim();
    const phone = String(fields.get("phone") || "").trim();
    const deadline = selectedTimeline;
    const referenceUrl = String(fields.get("referenceUrl") || "").trim();
    const requirements = String(fields.get("requirements") || "").trim();
    const service = selectedService;

    setClientName(name);

    const emailField = form.elements.namedItem("email");
    const phoneField = form.elements.namedItem("phone");
    if (!email && !phone) {
      setStatus("Please provide at least one contact method (email or phone number) so we can reach you.");
      emailField?.setCustomValidity("Provide email or phone number.");
      phoneField?.setCustomValidity("Provide email or phone number.");
      emailField?.reportValidity();
      return;
    }
    emailField?.setCustomValidity("");
    phoneField?.setCustomValidity("");

    const data = {
      name,
      company,
      email,
      phone,
      service,
      deadline,
      referenceUrl,
      requirements,
    };

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
          openEmailFallback(data);
          return;
        }

        trackEvent("project_brief_submitted", { service_name: data.service });
        setIsSuccess(true);
        setStatus("Your project brief has been logged! We will review and reply within 2-4 hours.");
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
      setStatus("Email dispatch not configured. Please chat with us on WhatsApp directly.");
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
        {/* Left Column: Direct Studio Channels & Info */}
        <div className="lg:col-span-5 studio-contact-copy">
          <div className="flex items-center gap-2 mb-3">
            <RecIndicator />
            <p className="studio-location m-0 font-mono text-xs uppercase tracking-widest text-[#FF4D2D] font-bold">
              PROJECT INBOX // DIRECT BRIEF
            </p>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#12101E] tracking-tight leading-none mb-4">
            Let&apos;s make
            <br />
            something
            <br />
            <span className="text-[#FF4D2D]">worth watching.</span>
          </h1>

          <p className="text-base text-[#5C586B] leading-relaxed mb-8">
            Tell us about your project, footage volume, narrative style, and timeline goals.
            Whether you need a standalone commercial edit, high-retention vertical reels, or an ongoing
            channel partnership, our cutting room is ready.
          </p>

          <div className="studio-contact-methods flex flex-col gap-3">
            <div>
              <Mail aria-hidden="true" size={18} />
              <span>Direct Email</span>
              {contactConfig.email ? (
                <a className="font-semibold text-[#12101E] hover:text-[#FF4D2D]" href={`mailto:${contactConfig.email}`}>
                  {contactConfig.email}
                </a>
              ) : (
                <span className="studio-contact-unavailable">rahulraut9204@gmail.com</span>
              )}
            </div>

            {contactConfig.phoneNumber && (
              <div>
                <Phone aria-hidden="true" size={18} />
                <span>Studio Line</span>
                <a className="font-semibold text-[#12101E]" href={`tel:+${contactConfig.phoneNumber}`}>
                  {contactConfig.phoneDisplay}
                </a>
              </div>
            )}

            <div>
              <MessageCircle aria-hidden="true" className="text-[#25D366]" size={18} />
              <span>WhatsApp Direct</span>
              {whatsAppHref ? (
                <a
                  className="font-bold text-[#12101E] hover:text-[#25D366] inline-flex items-center gap-1"
                  href={whatsAppHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  Start Instant Chat <ArrowUpRight size={13} />
                </a>
              ) : (
                <span className="studio-contact-unavailable">Available during studio hours</span>
              )}
            </div>
          </div>

          {/* SLA Card */}
          <div className="mt-8 p-5 rounded-2xl bg-[#F5F3FF] border border-[#635BFF]/20 flex items-start gap-3">
            <Clock className="text-[#635BFF] shrink-0 mt-0.5" size={18} />
            <div>
              <strong className="block text-xs font-mono font-bold uppercase tracking-wider text-[#635BFF] mb-0.5">
                FAST STUDIO RESPONSE
              </strong>
              <span className="text-xs text-[#5C586B]">
                Every brief is reviewed directly by our lead editor within 2 to 4 hours.
              </span>
            </div>
          </div>

          {/* Quick WhatsApp Card */}
          {whatsAppHref && (
            <div className="mt-4 p-5 rounded-2xl bg-[#0E0C18] text-white border border-white/10 shadow-lg">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#00E599] block mb-1">
                PREFER A FAST CHAT?
              </span>
              <h3 className="text-base font-bold text-white m-0 mb-2">Need an estimate right now?</h3>
              <p className="text-xs text-white/70 m-0 mb-4">
                Message us directly on WhatsApp with your links or project requirements for immediate advice.
              </p>
              <a
                className="button button-small button-gold inline-flex items-center gap-2 text-xs font-mono font-bold w-full justify-center"
                href={whatsAppHref}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle size={15} /> Message on WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Project Brief Form or Success Screen */}
        <div className="lg:col-span-7">
          {isSuccess ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E8E4DC] shadow-xl text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#12101E] tracking-tight mb-2">
                Brief Received, {clientName || "Friend"}!
              </h2>
              <p className="text-base text-[#5C586B] max-w-md mx-auto mb-6 leading-relaxed">
                Your project brief has been logged directly in our studio desk. Our lead editor will review your requirements
                and reply within 2 to 4 hours.
              </p>

              <div className="p-4 rounded-xl bg-[#F5F3FF] border border-[#635BFF]/20 max-w-sm mx-auto mb-8 text-xs font-mono text-[#635BFF]">
                ✓ Confirmed delivery to studio queue
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {whatsAppHref && (
                  <a
                    className="button button-gold inline-flex items-center gap-2 w-full sm:w-auto"
                    href={whatsAppHref}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <MessageCircle size={16} /> Fast Chat on WhatsApp
                  </a>
                )}
                <button
                  className="button button-outline w-full sm:w-auto"
                  onClick={() => {
                    setIsSuccess(false);
                    setStatus("");
                  }}
                  type="button"
                >
                  Submit Another Brief
                </button>
              </div>
            </div>
          ) : (
            <form
              className="studio-brief-form p-6 sm:p-10 rounded-3xl bg-white border border-[#E8E4DC] shadow-xl"
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="studio-form-heading mb-6">
                <span className="font-mono text-xs font-bold text-[#FF4D2D] uppercase tracking-wider block mb-1">
                  // PROJECT SPECIFICATION
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#12101E] m-0">Submit Project Brief</h2>
                <p className="text-xs text-[#5C586B] mt-1 m-0">Tell us what you have in mind. We will guide the rest.</p>
              </div>

              {requestedProject && (
                <div className="mb-6 p-3.5 rounded-xl bg-[#F5F3FF] border border-[#635BFF]/30 flex items-center justify-between text-xs font-mono text-[#635BFF]">
                  <span>Referenced visual style: <strong>&ldquo;{requestedProject}&rdquo;</strong></span>
                  <span className="text-[10px] uppercase font-bold bg-[#635BFF] text-white px-2.5 py-0.5 rounded-full shadow-sm">
                    Referenced Cut
                  </span>
                </div>
              )}

              {/* Service Selection Pills */}
              <div className="mb-6">
                <label className="block font-mono text-xs font-bold text-[#12101E] uppercase tracking-wider mb-2">
                  1. Select Primary Service Suite <span className="text-[#FF4D2D]">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_PILLS.map((pill) => {
                    const isSelected = selectedService === pill.value;
                    return (
                      <button
                        className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                          isSelected
                            ? "bg-[#12101E] text-white border-[#12101E] shadow-sm scale-105"
                            : "bg-[#FCFBF8] text-[#5C586B] border-[#E8E4DC] hover:border-[#12101E] hover:text-[#12101E]"
                        }`}
                        key={pill.value}
                        onClick={() => setSelectedService(pill.value)}
                        type="button"
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact Information Fields */}
              <div className="studio-form-pair">
                <label>
                  Your Name <span aria-hidden="true" className="text-[#FF4D2D]">*</span>
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
                  WhatsApp / Phone Number
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
              <p className="studio-field-hint mb-5 text-[11px] text-[#5C586B]">
                Provide at least one method (email or phone) so we can respond.
              </p>

              {/* Timeline Selection Pills */}
              <div className="mb-6">
                <label className="block font-mono text-xs font-bold text-[#12101E] uppercase tracking-wider mb-2">
                  2. Target Delivery Timeline
                </label>
                <div className="flex flex-wrap gap-2">
                  {TIMELINE_OPTIONS.map((time) => {
                    const isSelected = selectedTimeline === time;
                    return (
                      <button
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                          isSelected
                            ? "bg-[#635BFF] text-white border-[#635BFF] font-bold"
                            : "bg-[#FCFBF8] text-[#5C586B] border-[#E8E4DC] hover:border-[#635BFF]"
                        }`}
                        key={time}
                        onClick={() => setSelectedTimeline(time)}
                        type="button"
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label>
                Reference Links or Footage Cloud URL (Optional)
                <input
                  maxLength={300}
                  name="referenceUrl"
                  placeholder="Google Drive, Dropbox, Frame.io, or YouTube style reference link"
                  type="url"
                />
              </label>

              <label>
                Project Brief &amp; Footage Details <span aria-hidden="true" className="text-[#FF4D2D]">*</span>
                <textarea
                  defaultValue={
                    requestedProject
                      ? `I'm interested in an editing style similar to "${requestedProject}". Here are our footage details and goals:`
                      : ""
                  }
                  maxLength={3000}
                  name="requirements"
                  placeholder="Describe your project, footage volume, narrative goals, music/sound preferences, and deliverables needed."
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
                className="button button-gold studio-submit w-full py-4 text-base font-bold shadow-lg mt-2 cursor-pointer"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  "Submitting Brief to Studio…"
                ) : (
                  <>
                    <span>Send Project Brief to Studio</span>
                    <Send size={16} />
                  </>
                )}
              </button>

              <p aria-live="polite" className="studio-form-status mt-3 text-xs text-center text-[#5C586B]" role="status">
                {status || "Your brief is transmitted securely to our studio editing desk."}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
