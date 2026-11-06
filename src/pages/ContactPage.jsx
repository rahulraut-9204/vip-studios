import { ArrowUpRight, CheckCircle2, Clock, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { trackEvent } from "../data/analytics.js";
import { contactConfig, getWhatsAppHref } from "../data/contact.js";
import { isSupabaseConfigured, supabase } from "../lib/supabase.js";
import { RecIndicator } from "../components/StudioGraphics.jsx";

const SERVICE_PILLS = [
  { label: "Social Media Management & Strategy", value: "social-media-management" },
  { label: "Video Production & Editing", value: "video-shoots" },
  { label: "Reels & Short-Form Content", value: "professional-video-editing" },
  { label: "Podcast Production", value: "podcast-production" },
  { label: "YouTube Channel Management", value: "youtube-channel-management" },
  { label: "Content Creation", value: "content-creation" },
  { label: "Creative Branding", value: "brand-content" },
  { label: "Digital Growth", value: "digital-growth" },
];

const TIMELINE_OPTIONS = [
  "Within 48 hours (Rush)",
  "Next 5-7 days",
  "2-3 weeks",
  "Ongoing Monthly Retainer",
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
    )?.value || SERVICE_PILLS[0].value;

  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedTimeline, setSelectedTimeline] = useState(TIMELINE_OPTIONS[1]);
  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientName, setClientName] = useState("");

  const whatsAppHref = getWhatsAppHref(
    "Hi VIP StudioS, I'd like to discuss a video production, editing, or digital growth project."
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
      setStatus("Please provide at least one contact method (email or WhatsApp number) so we can reach you.");
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
      } catch {
        openEmailFallback(data);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    openEmailFallback(data);
  }

  function openEmailFallback(data) {
    const targetEmail = contactConfig.email || "mr.rohit8530@gmail.com";
    const subject = `[Project Brief] ${data.name} — ${data.service || "Video Editing"}`;
    const params = new URLSearchParams({
      subject,
      body: createEmailBody(data),
    });
    setStatus("Opening your email client with your pre-formatted project brief…");
    trackEvent("project_brief_draft_opened", { service_name: data.service });
    window.location.href = `mailto:${targetEmail}?${params.toString()}`;
  }

  function clearContactValidation(event) {
    const form = event.currentTarget.form;
    form.elements.namedItem("email")?.setCustomValidity("");
    form.elements.namedItem("phone")?.setCustomValidity("");
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <section className="studio-page studio-contact-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Studio Channels & Info */}
          <div className="lg:col-span-5 studio-contact-copy">
            <div className="flex items-center gap-2 mb-3">
              <RecIndicator />
              <p className="m-0 font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
                PROJECT INBOX // DIRECT BRIEF
              </p>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none mb-4 font-display">
              Let&apos;s build
              <br />
              something
              <br />
              <span className="text-[#FFD21C]">exceptional.</span>
            </h1>

            <p className="text-base text-[#A1A1AA] leading-relaxed mb-8 font-sans">
              Tell us about your project, raw footage scope, narrative style, or growth goals.
              Whether you need a standalone 4K commercial cut, high-retention vertical reels, or an ongoing
              growth partner, our studio desk is ready.
            </p>

            <div className="flex flex-col gap-3 font-mono text-xs">
              <a
                className="p-4 rounded-xl bg-[#141414] border border-[#222222] hover:border-[#FFD21C] transition-colors flex items-center justify-between text-white"
                href={`mailto:${contactConfig.email || "mr.rohit8530@gmail.com"}`}
              >
                <div className="flex items-center gap-3">
                  <Mail className="text-[#FFD21C]" size={18} />
                  <div>
                    <span className="block text-[10px] text-[#71717A] uppercase">Direct Email</span>
                    <span className="font-bold text-white">{contactConfig.email || "mr.rohit8530@gmail.com"}</span>
                  </div>
                </div>
                <ArrowUpRight size={15} />
              </a>

              {contactConfig.phoneNumber && (
                <a
                  className="p-4 rounded-xl bg-[#141414] border border-[#222222] hover:border-[#FFD21C] transition-colors flex items-center justify-between text-white"
                  href={`tel:+${contactConfig.phoneNumber}`}
                >
                  <div className="flex items-center gap-3">
                    <Phone className="text-[#FFD21C]" size={18} />
                    <div>
                      <span className="block text-[10px] text-[#71717A] uppercase">Studio Line</span>
                      <span className="font-bold text-white">{contactConfig.phoneDisplay}</span>
                    </div>
                  </div>
                  <ArrowUpRight size={15} />
                </a>
              )}

              {whatsAppHref && (
                <a
                  className="p-4 rounded-xl bg-[#141414] border border-[#222222] hover:border-[#25D366] transition-colors flex items-center justify-between text-white"
                  href={whatsAppHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="text-[#25D366]" size={18} />
                    <div>
                      <span className="block text-[10px] text-[#71717A] uppercase">WhatsApp Direct</span>
                      <span className="font-bold text-white">+91 8530541815</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#25D366]/20 text-[#25D366] text-[10px] font-bold">
                    FAST CHAT
                  </span>
                </a>
              )}
            </div>

            {/* SLA Card */}
            <div className="mt-6 p-4 rounded-xl bg-[#141414] border border-[#222222] flex items-start gap-3">
              <Clock className="text-[#FFD21C] shrink-0 mt-0.5" size={18} />
              <div>
                <strong className="block text-xs font-mono font-bold uppercase tracking-wider text-white mb-0.5">
                  RAPID STUDIO RESPONSE
                </strong>
                <span className="text-xs text-[#A1A1AA] font-sans">
                  Every brief is reviewed directly by our lead team within 2 to 4 business hours.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Project Brief Form or Success Screen */}
          <div className="lg:col-span-7">
            {isSuccess ? (
              <div className="p-8 sm:p-12 rounded-2xl bg-[#141414] border border-[#222222] shadow-2xl text-center">
                <div className="w-16 h-16 rounded-full bg-[#FFD21C]/20 text-[#FFD21C] flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <CheckCircle2 size={36} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2 font-display">
                  Brief Logged, {clientName || "Partner"}!
                </h2>
                <p className="text-base text-[#A1A1AA] max-w-md mx-auto mb-6 leading-relaxed font-sans">
                  Your project brief has been logged directly in our studio desk. Our lead director will review your requirements and reach out promptly.
                </p>

                <div className="p-4 rounded-xl bg-[#1C1C1C] border border-[#FFD21C]/30 max-w-sm mx-auto mb-8 text-xs font-mono text-[#FFD21C]">
                  ✓ Confirmed delivery to studio queue
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {whatsAppHref && (
                    <a
                      className="button button-gold inline-flex items-center gap-2 w-full sm:w-auto font-mono text-xs uppercase font-bold"
                      href={whatsAppHref}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <MessageCircle size={16} /> Instant WhatsApp Follow-up
                    </a>
                  )}
                  <button
                    className="button button-outline w-full sm:w-auto font-mono text-xs uppercase font-bold"
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
                className="p-6 sm:p-10 rounded-2xl bg-[#141414] border border-[#222222] shadow-2xl flex flex-col gap-6"
                noValidate
                onSubmit={handleSubmit}
              >
                <div>
                  <span className="font-mono text-xs font-bold text-[#FFD21C] uppercase tracking-wider block mb-1">
                    // PROJECT SPECIFICATION
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white m-0 font-display">Submit Project Brief</h2>
                  <p className="text-xs text-[#A1A1AA] mt-1 m-0 font-sans">Share your parameters. Our team will engineer the timeline and deliverables.</p>
                </div>

                {requestedProject && (
                  <div className="p-3.5 rounded-xl bg-[#1C1C1C] border border-[#FFD21C]/40 flex items-center justify-between text-xs font-mono text-[#FFD21C]">
                    <span>Referenced visual cut: <strong>&ldquo;{requestedProject}&rdquo;</strong></span>
                    <span className="text-[10px] uppercase font-bold bg-[#FFD21C] text-[#0A0A0A] px-2.5 py-0.5 rounded shadow-sm">
                      Linked Project
                    </span>
                  </div>
                )}

                {/* Service Selection Pills */}
                <div>
                  <label className="block font-mono text-xs font-bold text-white uppercase tracking-wider mb-2.5">
                    1. Select Service Suite <span className="text-[#FFD21C]">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_PILLS.map((pill) => {
                      const isSelected = selectedService === pill.value;
                      return (
                        <button
                          className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
                            isSelected
                              ? "bg-[#FFD21C] text-[#0A0A0A] border-[#FFD21C] shadow-sm scale-105"
                              : "bg-[#181818] text-[#A1A1AA] border-[#2A2A2A] hover:border-[#444] hover:text-white"
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

                {/* Name & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Your Name <span className="text-[#FFD21C]">*</span>
                    </label>
                    <input
                      autoComplete="name"
                      className="w-full bg-[#181818] border border-[#2A2A2A] focus:border-[#FFD21C] rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-sans"
                      maxLength={100}
                      name="name"
                      placeholder="e.g. Alex Vance"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Brand or Company
                    </label>
                    <input
                      autoComplete="organization"
                      className="w-full bg-[#181818] border border-[#2A2A2A] focus:border-[#FFD21C] rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-sans"
                      maxLength={120}
                      name="company"
                      placeholder="e.g. Apex Media or Creator Handle"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Email Address
                    </label>
                    <input
                      autoComplete="email"
                      className="w-full bg-[#181818] border border-[#2A2A2A] focus:border-[#FFD21C] rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-mono"
                      maxLength={254}
                      name="email"
                      onChange={clearContactValidation}
                      placeholder="alex@company.com"
                      type="email"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      WhatsApp / Phone
                    </label>
                    <input
                      autoComplete="tel"
                      className="w-full bg-[#181818] border border-[#2A2A2A] focus:border-[#FFD21C] rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-mono"
                      maxLength={30}
                      name="phone"
                      onChange={clearContactValidation}
                      placeholder="+91 85305 41815"
                      type="tel"
                    />
                  </div>
                </div>

                {/* Timeline Selection Pills */}
                <div>
                  <label className="block font-mono text-xs font-bold text-white uppercase tracking-wider mb-2.5">
                    2. Target Delivery Timeline
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TIMELINE_OPTIONS.map((time) => {
                      const isSelected = selectedTimeline === time;
                      return (
                        <button
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                            isSelected
                              ? "bg-[#FFD21C] text-[#0A0A0A] border-[#FFD21C] font-bold"
                              : "bg-[#181818] text-[#A1A1AA] border-[#2A2A2A] hover:border-[#444] hover:text-white"
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

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                    Footage Link or Style Reference (Optional)
                  </label>
                  <input
                    className="w-full bg-[#181818] border border-[#2A2A2A] focus:border-[#FFD21C] rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-mono text-xs"
                    maxLength={300}
                    name="referenceUrl"
                    placeholder="Google Drive, Dropbox, YouTube reference, or Instagram link"
                    type="url"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                    Project Brief &amp; Target Deliverables <span className="text-[#FFD21C]">*</span>
                  </label>
                  <textarea
                    className="w-full bg-[#181818] border border-[#2A2A2A] focus:border-[#FFD21C] rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-sans"
                    defaultValue={
                      requestedProject
                        ? `I'm interested in an editing style similar to "${requestedProject}". Here are our footage details and goals:`
                        : ""
                    }
                    maxLength={3000}
                    name="requirements"
                    placeholder="Describe your brand goals, footage volume, music style, and key deliverables..."
                    required
                    rows={4}
                  />
                </div>

                {/* Anti-spam Honeypot */}
                <label aria-hidden="true" className="hidden" tabIndex="-1">
                  Website
                  <input autoComplete="off" name="websiteTrap" tabIndex="-1" />
                </label>

                <button
                  className="button button-gold w-full py-4 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-lg disabled:opacity-50"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? (
                    "Connecting to Studio Queue…"
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Send Project Brief to Studio</span>
                      <Send size={15} />
                    </span>
                  )}
                </button>

                <p aria-live="polite" className="text-xs text-center text-[#71717A] m-0 font-mono" role="status">
                  {status || "Transmitted securely to the VIP StudioS editing desk."}
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
