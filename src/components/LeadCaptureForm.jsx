import { useState } from "react";
import { Send, MessageCircle, CheckCircle2, Shield, Clock, Phone, Mail } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabase.js";
import { trackEvent } from "../data/analytics.js";

const INDUSTRIES_LIST = [
  "Healthcare & Clinics",
  "Finance & Financial Education",
  "Education & Coaching",
  "Personal Brand / Creator / Coach",
  "Food, Dining & Lifestyle",
  "Real Estate & Construction",
  "Retail & E-commerce",
  "Corporate & Enterprise",
  "Astrology & Professional Services",
  "Other Industry",
];

const SERVICE_OPTIONS = [
  "Complete Social Media Management",
  "Instagram Management",
  "Facebook Management",
  "Reels & Video Editing",
  "Content Creation",
  "Video Shooting",
  "Podcast Production",
  "YouTube Management",
  "Creative Design",
  "Monthly Content Package",
  "Other",
];

const BUDGET_OPTIONS = [
  "₹25,000 – ₹45,000 / month",
  "₹45,000 – ₹80,000 / month (Standard SMM Retainer)",
  "₹80,000 – ₹1,50,000 / month (Complete Production + SMM)",
  "₹1,50,000+ / month (Enterprise & Multi-Platform)",
  "Single Video Project / Commercial Shoot",
  "Custom / Discussion Needed",
];

export default function LeadCaptureForm() {
  const [fullName, setFullName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [industry, setIndustry] = useState(INDUSTRIES_LIST[0]);
  const [selectedServices, setSelectedServices] = useState([SERVICE_OPTIONS[0]]);
  const [monthlyRequirements, setMonthlyRequirements] = useState("");
  const [budget, setBudget] = useState(BUDGET_OPTIONS[1]);
  const [details, setDetails] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [feedback, setFeedback] = useState("");

  function toggleService(service) {
    if (selectedServices.includes(service)) {
      if (selectedServices.length === 1) return; // Keep at least one
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    if (!phone && !email) {
      setFeedback("Please provide at least a phone/WhatsApp number or email so we can reach you.");
      return;
    }

    setSubmitting(true);
    setFeedback("");

    const fullBrief = [
      `[Brand: ${brandName || "Not specified"}]`,
      `[Industry: ${industry}]`,
      `[Instagram/Web: ${socialUrl || "None provided"}]`,
      `[Services: ${selectedServices.join(", ")}]`,
      `[Budget: ${budget}]`,
      `[Monthly Volume: ${monthlyRequirements || "Flexible"}]`,
      "",
      "Project Details & Goals:",
      details || "None provided",
    ].join("\n");

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("enquiries").insert({
          name: fullName || "Prospective Client",
          company: brandName,
          phone,
          email: email || null,
          service: selectedServices.join(", "),
          deadline: budget,
          requirements: fullBrief,
          status: "new",
          source: "homepage_enquiry",
        });

        if (error) throw error;
      }

      trackEvent("project_enquiry_submitted", {
        industry,
        services_count: selectedServices.length,
      });
      setSuccess(true);
    } catch {
      // Fallback: Dispatch to WhatsApp directly
      const msg = encodeURIComponent(
        `Hi VIP StudioS,\n\nName: ${fullName}\nBrand: ${brandName}\nPhone: ${phone}\nEmail: ${email}\nIndustry: ${industry}\nServices: ${selectedServices.join(", ")}\nBudget: ${budget}\nSocial Link: ${socialUrl}\n\nGoals: ${details}`
      );
      window.open(`https://wa.me/918530541815?text=${msg}`, "_blank");
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  }

  const whatsAppDirectLink = `https://wa.me/918530541815?text=${encodeURIComponent(
    "Hi VIP StudioS, I want to discuss social media management and content creation for my business."
  )}`;

  return (
    <section
      id="enquiry"
      aria-labelledby="enquiry-heading"
      className="py-24 bg-[#0A0A0A] border-t border-[#1E1E1E] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context, Trust & Direct Contacts */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
                START A CONVERSATION
              </span>
            </div>

            <h2
              id="enquiry-heading"
              className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display mb-4 leading-tight"
            >
              Let&apos;s Build Your Brand&apos;s <br />
              <span className="text-[#FFD21C]">Digital Presence.</span>
            </h2>

            <p className="text-base text-[#A1A1AA] font-sans leading-relaxed mb-8">
              Tell us about your business and what you want to achieve. Our team will help you identify the right content and social media approach.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-[#CCCCCC]">
                <Clock className="text-[#FFD21C] shrink-0" size={18} />
                <span>Reviewed directly by our strategy desk within 24 business hours.</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#CCCCCC]">
                <Shield className="text-[#FFD21C] shrink-0" size={18} />
                <span>NDA &amp; confidentiality protected. We never spam.</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222222] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-white">
                <span className="flex items-center gap-2">
                  <Phone size={15} className="text-[#FFD21C]" /> Studio WhatsApp / Line:
                </span>
                <span className="font-bold">+91 85305 41815</span>
              </div>
              <div className="flex items-center justify-between text-white">
                <span className="flex items-center gap-2">
                  <Mail size={15} className="text-[#FFD21C]" /> Direct Email:
                </span>
                <span className="font-bold text-[#A1A1AA]">mr.rohit8530@gmail.com</span>
              </div>
              <div className="pt-3 border-t border-[#222222]">
                <a
                  href={whatsAppDirectLink}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-outline w-full py-2.5 text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 text-[#25D366] hover:border-[#25D366]"
                >
                  <MessageCircle size={15} /> Chat on WhatsApp Directly
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Complete Project Enquiry Form */}
          <div className="lg:col-span-7">
            {success ? (
              <div className="p-8 sm:p-12 rounded-3xl bg-[#141414] border-2 border-[#FFD21C]/50 shadow-2xl text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-[#FFD21C]/20 text-[#FFD21C] flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-display mb-2">
                  Enquiry Received, {fullName || "Partner"}!
                </h3>
                <p className="text-sm text-[#A1A1AA] max-w-md mx-auto mb-6 leading-relaxed font-sans">
                  Thank you for sharing your project parameters. Our team is reviewing your requirements and will reach out promptly via WhatsApp or email.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={whatsAppDirectLink}
                    target="_blank"
                    rel="noreferrer"
                    className="button button-gold inline-flex items-center gap-2 font-mono text-xs uppercase font-bold"
                  >
                    <MessageCircle size={15} /> Open Instant WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="button button-outline font-mono text-xs uppercase font-bold"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 sm:p-10 rounded-3xl bg-[#141414]/95 backdrop-blur-md border border-[#2A2A2A] shadow-2xl space-y-6"
              >
                {/* Name & Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Full Name <span className="text-[#FFD21C]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#FFD21C] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Business / Brand Name <span className="text-[#FFD21C]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Health Clinic"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#FFD21C] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-sans"
                    />
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Phone Number (WhatsApp) <span className="text-[#FFD21C]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 85305 41815"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#FFD21C] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="rahul@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#FFD21C] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                {/* Social URL & Industry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Instagram / Website URL
                    </label>
                    <input
                      type="text"
                      placeholder="instagram.com/yourhandle or website"
                      value={socialUrl}
                      onChange={(e) => setSocialUrl(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#FFD21C] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Business Industry
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#FFD21C] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors font-sans"
                    >
                      {INDUSTRIES_LIST.map((ind) => (
                        <option key={ind} value={ind} className="bg-[#181818] text-white">
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Services Required Checkboxes */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-2">
                    Services Required (Select all that apply) <span className="text-[#FFD21C]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SERVICE_OPTIONS.map((srv) => {
                      const isChecked = selectedServices.includes(srv);
                      return (
                        <button
                          key={srv}
                          type="button"
                          onClick={() => toggleService(srv)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                            isChecked
                              ? "bg-[#FFD21C]/15 border-[#FFD21C] text-[#FFD21C] font-bold"
                              : "bg-[#181818] border-[#2A2A2A] text-[#A1A1AA] hover:text-white hover:border-[#444]"
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                              isChecked
                                ? "bg-[#FFD21C] border-[#FFD21C] text-[#0A0A0A]"
                                : "border-white/20"
                            }`}
                          >
                            {isChecked && "✓"}
                          </span>
                          <span className="truncate">{srv}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Monthly Volume & Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Monthly Content Requirements
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 15 Reels + 4 Carousels / mo"
                      value={monthlyRequirements}
                      onChange={(e) => setMonthlyRequirements(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#FFD21C] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Estimated Monthly Budget
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#FFD21C] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors font-sans"
                    >
                      {BUDGET_OPTIONS.map((bg) => (
                        <option key={bg} value={bg} className="bg-[#181818] text-white">
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                    Project Details &amp; Business Goals
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your current social media status, specific goals, target audience, or raw footage availability..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
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
                      <span>Discuss My Project</span>
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
