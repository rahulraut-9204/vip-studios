import { ArrowUpRight, CheckCircle2, Mail, MessageCircle, Phone, Send, Clock, Shield } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { trackEvent } from "../data/analytics.js";
import { contactConfig, getWhatsAppHref } from "../data/contact.js";
import { isSupabaseConfigured, supabase } from "../lib/supabase.js";

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

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get("service") || "";

  const [fullName, setFullName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [industry, setIndustry] = useState(INDUSTRIES_LIST[0]);
  const [selectedServices, setSelectedServices] = useState([
    requestedService || SERVICE_OPTIONS[0],
  ]);
  const [monthlyRequirements, setMonthlyRequirements] = useState("");
  const [budget, setBudget] = useState(BUDGET_OPTIONS[1]);
  const [details, setDetails] = useState("");

  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const whatsAppHref = getWhatsAppHref(
    "Hi VIP StudioS, I'm interested in social media management and content creation for my business."
  );

  function toggleService(service) {
    if (selectedServices.includes(service)) {
      if (selectedServices.length === 1) return;
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;
    setStatus("");

    if (!phone && !email) {
      setStatus("Please provide at least a phone/WhatsApp number or email.");
      return;
    }

    setIsSubmitting(true);

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
          source: "contact_page",
        });

        if (error) throw error;
      }

      trackEvent("project_enquiry_submitted", { industry, source: "contact_page" });
      setIsSuccess(true);
      setStatus("Your project enquiry has been submitted!");
    } catch {
      // Fallback to WhatsApp direct link
      const msg = encodeURIComponent(
        `Hi VIP StudioS,\n\nName: ${fullName}\nBrand: ${brandName}\nPhone: ${phone}\nEmail: ${email}\nIndustry: ${industry}\nServices: ${selectedServices.join(", ")}\nBudget: ${budget}\nSocial Link: ${socialUrl}\n\nGoals: ${details}`
      );
      window.open(`https://wa.me/918530541815?text=${msg}`, "_blank");
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <section className="studio-page studio-contact-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Studio Channels & Info */}
          <div className="lg:col-span-5 studio-contact-copy">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
                LET&apos;S WORK TOGETHER
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none mb-4 font-display">
              Let&apos;s Build Your Brand&apos;s <br />
              <span className="text-[#FFD21C]">Digital Presence.</span>
            </h1>

            <p className="text-base text-[#A1A1AA] leading-relaxed mb-8 font-sans">
              Tell us about your business, current social channels, and target goals. Our team in Pune will help you identify the right content and social media approach.
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

              <a
                className="p-4 rounded-xl bg-[#141414] border border-[#222222] hover:border-[#FFD21C] transition-colors flex items-center justify-between text-white"
                href="tel:+918530541815"
              >
                <div className="flex items-center gap-3">
                  <Phone className="text-[#FFD21C]" size={18} />
                  <div>
                    <span className="block text-[10px] text-[#71717A] uppercase">Phone Line</span>
                    <span className="font-bold text-white">+91 85305 41815</span>
                  </div>
                </div>
                <ArrowUpRight size={15} />
              </a>

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
                      <span className="font-bold text-white">+91 85305 41815</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#25D366]/20 text-[#25D366] text-[10px] font-bold">
                    CHAT DIRECT
                  </span>
                </a>
              )}

              <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] text-xs font-mono text-[#71717A]">
                Studio Location: Pune, Maharashtra, India.
              </div>
            </div>
          </div>

          {/* Right Column: Project Enquiry Form */}
          <div className="lg:col-span-7">
            {isSuccess ? (
              <div className="p-8 sm:p-12 rounded-3xl bg-[#141414] border border-[#FFD21C]/50 shadow-2xl text-center">
                <div className="w-16 h-16 rounded-full bg-[#FFD21C]/20 text-[#FFD21C] flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <CheckCircle2 size={36} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2 font-display">
                  Enquiry Logged, {fullName || "Partner"}!
                </h2>
                <p className="text-base text-[#A1A1AA] max-w-md mx-auto mb-6 leading-relaxed font-sans">
                  We have received your project details. Our strategy team will review them and reach out to you within 24 hours.
                </p>

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
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form
                className="p-8 sm:p-10 rounded-3xl bg-[#141414] border border-[#2A2A2A] shadow-2xl space-y-6"
                onSubmit={handleSubmit}
              >
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white m-0 font-display">Project Enquiry</h2>
                  <p className="text-xs text-[#A1A1AA] mt-1 m-0 font-sans">
                    Share your requirements below and our team will prepare a tailored proposal.
                  </p>
                </div>

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

                {/* Details */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                    Project Details &amp; Business Goals
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your current social presence, target goals, and timeline..."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#FFD21C] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-sans"
                  />
                </div>

                <button
                  className="button button-gold w-full py-4 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-lg disabled:opacity-50"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? (
                    "Connecting to Studio..."
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Discuss My Project</span>
                      <Send size={15} />
                    </span>
                  )}
                </button>

                {status && (
                  <p aria-live="polite" className="text-xs text-center text-[#71717A] m-0 font-mono" role="status">
                    {status}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
