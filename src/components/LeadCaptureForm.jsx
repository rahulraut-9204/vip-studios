import { useState } from "react";
import { Send, MessageCircle, Calendar, CheckCircle2, Shield, Clock, Award } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabase.js";
import { trackEvent } from "../data/analytics.js";

const BUSINESS_TYPES = [
  "E-Commerce / D2C Brand",
  "B2B SaaS / Tech Startup",
  "Creator / Personal Brand / Coach",
  "Agency / Professional Services",
  "Corporate / Enterprise",
  "Other",
];

const BUDGET_RANGES = [
  "$1,000 – $2,500 / month",
  "$2,500 – $5,000 / month (Most Common)",
  "$5,000 – $10,000 / month",
  "$10,000+ / month (Enterprise / Omnichannel)",
  "Single Project / Commercial Shoot",
];

const SERVICES_NEEDED = [
  "High-Retention Reels & Shorts",
  "Long-Form YouTube Video Editing",
  "Full Video Production & Shoots",
  "Visual Podcast Production",
  "Paid Ads Creatives (TikTok & Meta)",
  "Complete Digital Growth Suite",
];

export default function LeadCaptureForm({ onOpenCalendly }) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [budgetRange, setBudgetRange] = useState(BUDGET_RANGES[1]);
  const [selectedService, setSelectedService] = useState(SERVICES_NEEDED[0]);
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    if (!whatsapp && !email) {
      setFeedback("Please provide at least a WhatsApp number or email so we can reach you.");
      return;
    }

    setSubmitting(true);
    setFeedback("");

    const fullBrief = `[Business: ${businessType}] [Budget: ${budgetRange}] [Service: ${selectedService}]\n\n${message || "No custom message provided."}`;

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("enquiries").insert({
          name: name || "Prospective Client",
          phone: whatsapp,
          email: email || null,
          service: selectedService,
          company: businessType,
          deadline: budgetRange,
          requirements: fullBrief,
          status: "new",
          source: "agency_lead_form",
        });

        if (error) throw error;
      }

      trackEvent("lead_form_submitted", { service: selectedService, budget: budgetRange });
      setSuccess(true);
    } catch {
      // Fallback: Open WhatsApp directly with prefilled brief
      const encodedMsg = encodeURIComponent(
        `Hi VIP StudioS,\n\nName: ${name}\nWhatsApp: ${whatsapp}\nEmail: ${email}\nBusiness: ${businessType}\nBudget: ${budgetRange}\nService: ${selectedService}\n\nGoals: ${message}`
      );
      window.open(`https://wa.me/918530541815?text=${encodedMsg}`, "_blank");
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  }

  const directWhatsAppLink = `https://wa.me/918530541815?text=${encodeURIComponent(
    "Hi VIP StudioS, I'm looking for video production & digital growth support for my brand."
  )}`;

  return (
    <section
      id="contact"
      aria-labelledby="lead-form-title"
      className="py-24 bg-[#0A0A0A] border-t border-[#1E1E1E] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Outcome Copy, Trust Signals & Direct Booking */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
                START YOUR GROWTH SPRINT
              </span>
            </div>

            <h2
              id="lead-form-title"
              className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display mb-4 leading-tight"
            >
              Ready to turn content <br />
              into <span className="text-[#FFD21C]">paying customers?</span>
            </h2>

            <p className="text-base text-[#A1A1AA] font-sans leading-relaxed mb-8">
              Fill out this quick 60-second brief. We will analyze your channel, calculate your target retention lift, and send a custom sprint proposal within 24 hours.
            </p>

            {/* Trust Signals Strip */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-[#CCCCCC]">
                <Clock className="text-[#FFD21C] shrink-0" size={18} />
                <span><strong>24-Hour Guarantee:</strong> Fast review directly by our lead creative director.</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#CCCCCC]">
                <Shield className="text-[#FFD21C] shrink-0" size={18} />
                <span><strong>100% Confidential:</strong> NDA protected · No spam or unsolicited pitches.</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#CCCCCC]">
                <Award className="text-[#FFD21C] shrink-0" size={18} />
                <span><strong>50+ Brands Scaled:</strong> Proven retention and view-to-lead frameworks.</span>
              </div>
            </div>

            {/* Direct Calendly & WhatsApp Action Pills */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#222222]">
              {onOpenCalendly && (
                <button
                  type="button"
                  onClick={onOpenCalendly}
                  className="button button-outline font-mono text-xs uppercase font-bold inline-flex items-center justify-center gap-2"
                >
                  <Calendar size={15} /> Book on Calendly
                </button>
              )}
              <a
                href={directWhatsAppLink}
                target="_blank"
                rel="noreferrer"
                className="p-3 px-4 rounded-xl bg-[#141414] border border-[#2A2A2A] hover:border-[#25D366] text-white hover:text-[#25D366] text-xs font-mono font-bold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle size={16} className="text-[#25D366]" /> Fast WhatsApp Chat
              </a>
            </div>
          </div>

          {/* Right Column: Lead Capture Form Container */}
          <div className="lg:col-span-7">
            {success ? (
              <div className="p-8 sm:p-12 rounded-3xl bg-[#141414] border-2 border-[#FFD21C]/50 shadow-2xl text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-[#FFD21C]/20 text-[#FFD21C] flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-display mb-2">
                  Project Brief Received, {name || "Partner"}!
                </h3>
                <p className="text-sm text-[#A1A1AA] max-w-md mx-auto mb-6 leading-relaxed font-sans">
                  Our lead director has logged your details. We will review your channel requirements and reply within 24 hours.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={directWhatsAppLink}
                    target="_blank"
                    rel="noreferrer"
                    className="button button-gold inline-flex items-center gap-2 font-mono text-xs uppercase font-bold"
                  >
                    <MessageCircle size={15} /> Instant WhatsApp Follow-up
                  </a>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="button button-outline font-mono text-xs uppercase font-bold"
                  >
                    Submit Another Brief
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 sm:p-10 rounded-3xl bg-[#141414]/95 backdrop-blur-md border border-[#2A2A2A] shadow-2xl space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Your Full Name <span className="text-[#FFD21C]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#FFD21C] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      WhatsApp Number <span className="text-[#FFD21C]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 85305 41815"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#FFD21C] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#FFD21C] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Business / Brand Type
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#FFD21C] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors font-sans"
                    >
                      {BUSINESS_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-[#181818] text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Target Monthly Budget
                    </label>
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#FFD21C] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors font-sans"
                    >
                      {BUDGET_RANGES.map((range) => (
                        <option key={range} value={range} className="bg-[#181818] text-white">
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Primary Service Needed
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#FFD21C] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors font-sans"
                    >
                      {SERVICES_NEEDED.map((srv) => (
                        <option key={srv} value={srv} className="bg-[#181818] text-white">
                          {srv}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                    Your Current Channels &amp; Goals
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your brand goals, YouTube / Instagram link, footage status, or target timeline..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#FFD21C] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-sans"
                  />
                </div>

                {feedback && (
                  <p className="text-xs font-mono text-[#FFD21C] m-0">{feedback}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="button button-gold w-full py-4 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-[0_0_25px_rgba(255,210,28,0.35)] disabled:opacity-50"
                >
                  {submitting ? (
                    "Connecting to Studio..."
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Get My Free Strategy &amp; Custom Proposal</span>
                      <Send size={15} />
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
