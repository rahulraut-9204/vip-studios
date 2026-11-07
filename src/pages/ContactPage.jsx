import { ArrowUpRight, CheckCircle2, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { trackEvent } from "../data/analytics.js";
import { contactConfig, getWhatsAppHref } from "../data/contact.js";
import { isSupabaseConfigured, supabase } from "../lib/supabase.js";

function createEmailBody(data) {
  return [
    `Name: ${data.name}`,
    `Brand / Company: ${data.company || "Not provided"}`,
    `Email: ${data.email || "Not provided"}`,
    `WhatsApp / Phone: ${data.phone || "Not provided"}`,
    "",
    "Project Brief & Requirements:",
    data.requirements || "Not provided",
  ].join("\n");
}

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const requestedProject = searchParams.get("project") || "";
  const requestedService = searchParams.get("service") || "";

  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientName, setClientName] = useState("");

  const whatsAppHref = getWhatsAppHref(
    "Hi VIP StudioS, I want to discuss a new video production or digital growth project."
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
    const requirements = String(fields.get("requirements") || "").trim();

    setClientName(name);

    const emailField = form.elements.namedItem("email");
    const phoneField = form.elements.namedItem("phone");
    if (!email && !phone) {
      setStatus("Please provide at least one contact method (email or WhatsApp number).");
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
      requirements,
    };

    if (isSupabaseConfigured && supabase) {
      setIsSubmitting(true);
      setStatus("Sending to studio desk…");
      try {
        const { error } = await supabase.from("enquiries").insert({
          name: data.name,
          company: data.company,
          email: data.email,
          phone: data.phone,
          requirements: data.requirements,
          source: "website",
        });

        if (error) {
          openEmailFallback(data);
          return;
        }

        trackEvent("project_brief_submitted", { client: data.name });
        setIsSuccess(true);
        setStatus("Your message has been sent successfully!");
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
    const subject = `[Project Inquiry] ${data.name}${data.company ? ` (${data.company})` : ""}`;
    const params = new URLSearchParams({
      subject,
      body: createEmailBody(data),
    });
    setStatus("Opening your email client with your message…");
    trackEvent("project_brief_draft_opened", { client: data.name });
    window.location.href = `mailto:${targetEmail}?${params.toString()}`;
  }

  function clearContactValidation(event) {
    const form = event.currentTarget.form;
    form.elements.namedItem("email")?.setCustomValidity("");
    form.elements.namedItem("phone")?.setCustomValidity("");
  }

  const initialBrief = requestedProject
    ? `Interested in style similar to: ${requestedProject}.`
    : requestedService
    ? `Interested in service: ${requestedService}.`
    : "";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <section className="studio-page studio-contact-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Studio Channels & Info */}
          <div className="lg:col-span-5 studio-contact-copy">
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none mb-4 font-display">
              Let&apos;s build
              <br />
              something
              <br />
              <span className="text-[#FFD21C]">exceptional.</span>
            </h1>

            <p className="text-base text-[#A1A1AA] leading-relaxed mb-8 font-sans">
              Have a new project, upcoming video shoot, or monthly content requirements?
              Send us your details and brief, or reach out directly via WhatsApp or email.
            </p>

            <div className="flex flex-col gap-3 font-mono text-xs">
              <a
                className="p-4 rounded-xl bg-[#141414] border border-[#222222] hover:border-[#FFD21C] transition-colors flex items-center justify-between text-white"
                href={`mailto:${contactConfig.email || "mr.rohit8530@gmail.com"}`}
              >
                <div className="flex items-center gap-3">
                  <Mail className="text-[#FFD21C]" size={18} />
                  <div>
                    <span className="block text-[10px] text-[#71717A] uppercase">Email</span>
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
                      <span className="block text-[10px] text-[#71717A] uppercase">Phone</span>
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
                      <span className="block text-[10px] text-[#71717A] uppercase">WhatsApp</span>
                      <span className="font-bold text-white">+91 8530541815</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#25D366]/20 text-[#25D366] text-[10px] font-bold">
                    CHAT DIRECT
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Clean Project Form or Success Screen */}
          <div className="lg:col-span-7">
            {isSuccess ? (
              <div className="p-8 sm:p-12 rounded-2xl bg-[#141414] border border-[#222222] shadow-2xl text-center">
                <div className="w-16 h-16 rounded-full bg-[#FFD21C]/20 text-[#FFD21C] flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <CheckCircle2 size={36} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2 font-display">
                  Message Sent, {clientName || "Partner"}!
                </h2>
                <p className="text-base text-[#A1A1AA] max-w-md mx-auto mb-6 leading-relaxed font-sans">
                  We have received your project details. Our team will review them and reach out to you shortly.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {whatsAppHref && (
                    <a
                      className="button button-gold inline-flex items-center gap-2 w-full sm:w-auto font-mono text-xs uppercase font-bold"
                      href={whatsAppHref}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <MessageCircle size={16} /> Instant WhatsApp
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
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form
                className="p-6 sm:p-10 rounded-2xl bg-[#141414] border border-[#222222] shadow-2xl flex flex-col gap-5"
                noValidate
                onSubmit={handleSubmit}
              >
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white m-0 font-display">Start a Project</h2>
                  <p className="text-xs text-[#A1A1AA] mt-1 m-0 font-sans">
                    Fill in your details below and we will get back to you promptly.
                  </p>
                </div>

                {/* Name & Brand Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Name <span className="text-[#FFD21C]">*</span>
                    </label>
                    <input
                      autoComplete="name"
                      className="w-full bg-[#181818] border border-[#2A2A2A] focus:border-[#FFD21C] rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-sans"
                      maxLength={100}
                      name="name"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Brand Name
                    </label>
                    <input
                      autoComplete="organization"
                      className="w-full bg-[#181818] border border-[#2A2A2A] focus:border-[#FFD21C] rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-sans"
                      maxLength={120}
                      name="company"
                      placeholder="Company or creator handle"
                    />
                  </div>
                </div>

                {/* Email & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Email
                    </label>
                    <input
                      autoComplete="email"
                      className="w-full bg-[#181818] border border-[#2A2A2A] focus:border-[#FFD21C] rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-mono"
                      maxLength={254}
                      name="email"
                      onChange={clearContactValidation}
                      placeholder="you@email.com"
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

                {/* Project Brief */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                    Project Brief &amp; Details <span className="text-[#FFD21C]">*</span>
                  </label>
                  <textarea
                    className="w-full bg-[#181818] border border-[#2A2A2A] focus:border-[#FFD21C] rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-sans"
                    defaultValue={initialBrief}
                    maxLength={3000}
                    name="requirements"
                    placeholder="Tell us about your project, goals, footage details, or turnaround requirements..."
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
                    "Sending Message…"
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Send Message</span>
                      <Send size={15} />
                    </span>
                  )}
                </button>

                <p aria-live="polite" className="text-xs text-center text-[#71717A] m-0 font-mono" role="status">
                  {status || "Direct communication with the VIP StudioS team."}
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
