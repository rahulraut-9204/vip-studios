import { useState } from "react";
import { Send, MessageCircle, CheckCircle2, Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabase.js";
import { trackEvent } from "../data/analytics.js";
import { contactConfig, getWhatsAppHref } from "../data/contact.js";

const SERVICE_OPTIONS = [
  "Complete Social Media Management",
  "Instagram Reels & Short-Form Video Editing",
  "Professional Video Shooting & Production",
  "YouTube Channel Management",
  "Podcast Production & Editing",
  "Brand Strategy & Creative Design",
  "Monthly Content Retainer",
  "Other / Custom Scope",
];

export default function LeadCaptureForm() {
  const [fullName, setFullName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(SERVICE_OPTIONS[0]);
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [feedback, setFeedback] = useState("");

  const whatsAppDirectLink = getWhatsAppHref(
    "Hi VIP StudioS, I want to discuss social media management and content creation for my brand."
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    if (!phone && !email) {
      setFeedback("Please provide at least a WhatsApp number or email address.");
      return;
    }

    setSubmitting(true);
    setFeedback("");

    const fullBrief = [
      `Brand / Business: ${brandName || "Not specified"}`,
      `Service Needed: ${service}`,
      "",
      "Project Details & Goals:",
      message || "None provided",
    ].join("\n");

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("enquiries").insert({
          name: fullName || "Prospective Client",
          company: brandName || null,
          phone: phone || null,
          email: email || null,
          service,
          requirements: fullBrief,
          status: "new",
          source: "homepage_enquiry",
        });

        if (error) throw error;
      }

      trackEvent("project_enquiry_submitted", {
        service,
        source: "homepage_enquiry",
      });
      setSuccess(true);
    } catch {
      // Fallback: Open WhatsApp directly
      const msg = encodeURIComponent(
        `Hi VIP StudioS,\n\nName: ${fullName}\nBrand: ${brandName}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\n\nGoals: ${message}`
      );
      window.open(`https://wa.me/918530541815?text=${msg}`, "_blank");
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="enquiry"
      aria-labelledby="enquiry-heading"
      className="py-24 bg-[#0A0A0A] border-t border-[#1E1E1E] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Studio Information */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#262626] text-xs font-mono mb-4">
              <span className="w-2 h-2 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
              <span className="text-[#FFD21C] font-bold tracking-widest uppercase">
                START A PROJECT
              </span>
            </div>

            <h2
              id="enquiry-heading"
              className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display mb-4 leading-tight"
            >
              Let&apos;s Build Your Brand&apos;s <br />
              <span className="text-[#FFD21C]">Digital Presence.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#A1A1AA] font-sans leading-relaxed mb-8 max-w-md">
              Have an upcoming project or looking for a long-term content partner? Reach out directly via WhatsApp, email, or send your project brief below.
            </p>

            {/* Direct Studio Contacts */}
            <div className="space-y-3 font-mono text-xs">
              {whatsAppDirectLink && (
                <a
                  href={whatsAppDirectLink}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-xl bg-[#121212] border border-[#222222] hover:border-[#FFD21C] transition-colors flex items-center justify-between text-white group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#FFD21C]/10 text-[#FFD21C] flex items-center justify-center">
                      <MessageCircle size={18} />
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#71717A] uppercase font-bold">
                        WhatsApp Direct
                      </span>
                      <span className="font-bold text-white group-hover:text-[#FFD21C] transition-colors">
                        +91 85305 41815
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#FFD21C]/10 text-[#FFD21C] border border-[#FFD21C]/20 text-[10px] font-bold">
                    FAST CHAT
                  </span>
                </a>
              )}

              <a
                href={`mailto:${contactConfig.email || "mr.rohit8530@gmail.com"}`}
                className="p-4 rounded-xl bg-[#121212] border border-[#222222] hover:border-[#FFD21C] transition-colors flex items-center justify-between text-white group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FFD21C]/10 text-[#FFD21C] flex items-center justify-center">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#71717A] uppercase font-bold">
                      Studio Email
                    </span>
                    <span className="font-bold text-white group-hover:text-[#FFD21C] transition-colors">
                      {contactConfig.email || "mr.rohit8530@gmail.com"}
                    </span>
                  </div>
                </div>
                <ArrowUpRight size={15} className="text-[#71717A] group-hover:text-white" />
              </a>

              <a
                href="tel:+918530541815"
                className="p-4 rounded-xl bg-[#121212] border border-[#222222] hover:border-[#FFD21C] transition-colors flex items-center justify-between text-white group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/5 text-white flex items-center justify-center">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#71717A] uppercase font-bold">
                      Studio Desk
                    </span>
                    <span className="font-bold text-white group-hover:text-[#FFD21C] transition-colors">
                      +91 85305 41815
                    </span>
                  </div>
                </div>
                <ArrowUpRight size={15} className="text-[#71717A] group-hover:text-white" />
              </a>

              <div className="p-4 rounded-xl bg-[#121212] border border-[#222222] flex items-center gap-3 text-white">
                <div className="w-9 h-9 rounded-lg bg-white/5 text-[#FFD21C] flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="block text-[10px] text-[#71717A] uppercase font-bold">
                    Studio Location
                  </span>
                  <span className="font-bold text-[#A1A1AA]">Pune, Maharashtra, India</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#71717A] mt-6 font-mono">
              ⚡ Every project brief is reviewed directly by our lead strategy desk within 24 hours.
            </p>
          </div>

          {/* Right Column: Clean, Streamlined Lead Form */}
          <div className="lg:col-span-7">
            {success ? (
              <div className="p-8 sm:p-12 rounded-2xl bg-[#121212] border border-[#FFD21C]/40 shadow-2xl text-center">
                <div className="w-16 h-16 rounded-full bg-[#FFD21C]/15 border border-[#FFD21C]/30 text-[#FFD21C] flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(255,210,28,0.2)]">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2 font-display">
                  Project Brief Received!
                </h3>
                <p className="text-sm text-[#A1A1AA] max-w-md mx-auto mb-8 leading-relaxed font-sans">
                  Thank you, <strong className="text-white">{fullName || "Partner"}</strong>. Our strategy desk is reviewing your requirements and will reach out promptly via WhatsApp or email.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {whatsAppDirectLink && (
                    <a
                      href={whatsAppDirectLink}
                      target="_blank"
                      rel="noreferrer"
                      className="button button-gold inline-flex items-center gap-2 font-mono text-xs uppercase font-bold"
                    >
                      <MessageCircle size={15} /> Instant WhatsApp Follow-up
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setFullName("");
                      setBrandName("");
                      setPhone("");
                      setEmail("");
                      setMessage("");
                      setFeedback("");
                    }}
                    className="button button-outline font-mono text-xs uppercase font-bold"
                  >
                    Submit Another Brief
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-7 sm:p-10 rounded-2xl bg-[#121212] border border-[#222222] shadow-[0_12px_40px_rgba(0,0,0,0.6)] space-y-5"
              >
                <div className="mb-4 pb-4 border-b border-[#1E1E1E]">
                  <h3 className="text-2xl font-black text-white tracking-tight font-display m-0">
                    Project Brief
                  </h3>
                  <p className="text-xs text-[#A1A1AA] mt-1 m-0 font-sans">
                    Share your requirements and we will prepare a tailored content proposal.
                  </p>
                </div>

                {/* Name & Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#D4D4D8] mb-1.5">
                      Your Name <span className="text-[#FFD21C]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#181818] border border-[#282828] focus:border-[#FFD21C] focus:ring-1 focus:ring-[#FFD21C]/25 rounded-lg px-4 py-3 text-sm text-white placeholder-[#71717A] focus:outline-none transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#D4D4D8] mb-1.5">
                      Brand / Company
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Media or Creator Handle"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full bg-[#181818] border border-[#282828] focus:border-[#FFD21C] focus:ring-1 focus:ring-[#FFD21C]/25 rounded-lg px-4 py-3 text-sm text-white placeholder-[#71717A] focus:outline-none transition-all font-sans"
                    />
                  </div>
                </div>

                {/* WhatsApp & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#D4D4D8] mb-1.5">
                      WhatsApp / Phone <span className="text-[#FFD21C]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 85305 41815"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#181818] border border-[#282828] focus:border-[#FFD21C] focus:ring-1 focus:ring-[#FFD21C]/25 rounded-lg px-4 py-3 text-sm text-white placeholder-[#71717A] focus:outline-none transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#D4D4D8] mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="rahul@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#181818] border border-[#282828] focus:border-[#FFD21C] focus:ring-1 focus:ring-[#FFD21C]/25 rounded-lg px-4 py-3 text-sm text-white placeholder-[#71717A] focus:outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Service Dropdown */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#D4D4D8] mb-1.5">
                    Service Required
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] focus:border-[#FFD21C] focus:ring-1 focus:ring-[#FFD21C]/25 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all font-sans cursor-pointer"
                  >
                    {SERVICE_OPTIONS.map((srv) => (
                      <option key={srv} value={srv} className="bg-[#181818] text-white">
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Brief */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#D4D4D8] mb-1.5">
                    Project Brief &amp; Goals
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your brand goals, target timeline, or content requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] focus:border-[#FFD21C] focus:ring-1 focus:ring-[#FFD21C]/25 rounded-lg px-4 py-3 text-sm text-white placeholder-[#71717A] focus:outline-none transition-all font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="button button-gold w-full py-4 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-[0_4px_20px_rgba(255,210,28,0.25)] hover:shadow-[0_6px_28px_rgba(255,210,28,0.4)] disabled:opacity-50 transition-all"
                >
                  {submitting ? (
                    "Sending Project Brief..."
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Send Project Brief</span>
                      <Send size={15} />
                    </span>
                  )}
                </button>

                {feedback && (
                  <p className="text-xs text-center text-[#FFD21C] m-0 font-mono mt-2" role="status">
                    {feedback}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}