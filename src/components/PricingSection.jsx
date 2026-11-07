import { Check, ArrowRight, Zap, ShieldCheck } from "lucide-react";

export default function PricingSection() {
  const tiers = [
    {
      name: "Starter Sprint",
      tagline: "For Founders & Creators Testing Short-Form",
      price: "$1,450",
      period: "/ month",
      popular: false,
      features: [
        "12 High-Retention Vertical Reels / Shorts",
        "Kinetic typography, sound foley & b-roll",
        "48-hour standard turnaround",
        "Unlimited revisions per cut",
        "Script review & retention hook feedback",
        "Dedicated Slack / WhatsApp chat channel",
      ],
      cta: "Choose Starter Sprint",
      highlight: "No long-term contracts. Cancel anytime.",
    },
    {
      name: "Growth Engine",
      tagline: "Our Most Popular Full-Funnel Content Retainer",
      price: "$2,850",
      period: "/ month",
      popular: true,
      features: [
        "24 High-Retention Vertical Reels / Shorts (Daily Posting)",
        "2 Long-Form YouTube / Commercial Masters (Up to 15 mins)",
        "Cinema-grade DaVinci Resolve color grading",
        "Custom high-CTR clickable thumbnails",
        "24 to 36-hour fast-track turnaround",
        "Dedicated Lead Video Editor + Creative Director",
        "Weekly analytics review & hook A/B testing",
        "Full publishing & scheduling support",
      ],
      cta: "Choose Growth Engine",
      highlight: "⚡ Top Choice: Scales reach by an avg 285%",
    },
    {
      name: "Omnichannel Dominance",
      tagline: "For Established Brands & Rapid Growth Startups",
      price: "$4,950",
      period: "/ month",
      popular: false,
      features: [
        "40+ Multi-Platform Video Cuts & Micro-Assets",
        "4 Long-Form Commercial or Podcast Masters",
        "Full Podcast Multi-Cam Switching & Mastering",
        "Paid Ads Creative Iterations (TikTok & Meta)",
        "Same-Day Rush Turnaround on Priority Cuts",
        "Dedicated Senior Editor, Motion Designer & Strategist",
        "Direct footage ingest & cloud storage pipeline",
        "Monthly strategy audit & revenue attribution",
      ],
      cta: "Choose Omnichannel",
      highlight: "Turnkey creative agency replacement.",
    },
  ];

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="py-24 bg-[#0E0E0E] border-t border-[#1E1E1E] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD21C]/10 border border-[#FFD21C]/25 text-[#FFD21C] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Zap size={14} /> TRANSPARENT PACKAGES &amp; RETENTION
          </div>
          <h2
            id="pricing-title"
            className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display m-0 mb-4"
          >
            Predictable investment. <br />
            <span className="text-[#FFD21C]">Exponential ROI.</span>
          </h2>
          <p className="text-base text-[#A1A1AA] m-0 font-sans leading-relaxed">
            No surprise fees, no hidden revision costs, and zero contractual lock-in. Pick the sprint package that matches your growth goals.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-14">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 relative ${
                tier.popular
                  ? "bg-[#161616] border-2 border-[#FFD21C] shadow-[0_0_40px_rgba(255,210,28,0.2)] lg:-translate-y-3"
                  : "bg-[#141414]/90 border border-[#222222] hover:border-[#FFD21C]/50 shadow-xl"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FFD21C] text-[#0A0A0A] font-mono text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <Zap size={13} className="fill-current" /> MOST POPULAR PARTNER
                </div>
              )}

              <div>
                <h3 className="text-2xl font-black text-white mb-1 font-display">
                  {tier.name}
                </h3>
                <p className="text-xs text-[#A1A1AA] mb-6 font-sans">
                  {tier.tagline}
                </p>

                <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-[#222222]">
                  <span className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {tier.price}
                  </span>
                  <span className="font-mono text-xs text-[#A1A1AA] uppercase">
                    {tier.period}
                  </span>
                </div>

                <div className="space-y-3.5 mb-8">
                  <span className="text-[11px] font-mono uppercase text-[#71717A] tracking-wider block">
                    What&apos;s Included:
                  </span>
                  {tier.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#CCCCCC] font-sans">
                      <span className="w-5 h-5 rounded-full bg-[#FFD21C]/15 text-[#FFD21C] flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} />
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <a
                  href={`#contact?package=${encodeURIComponent(tier.name)}`}
                  className={`w-full py-4 text-xs font-mono font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    tier.popular
                      ? "button button-gold shadow-[0_0_20px_rgba(255,210,28,0.4)]"
                      : "button button-outline hover:border-[#FFD21C] hover:text-white"
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight size={14} />
                </a>
                <p className="text-[11px] font-mono text-center text-[#71717A] mt-3 m-0">
                  {tier.highlight}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Package Callout */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#141414] border border-[#222222] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-xl bg-[#FFD21C]/10 border border-[#FFD21C]/20 text-[#FFD21C] flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </span>
            <div>
              <h4 className="text-xl font-bold text-white mb-1 font-display">
                Need a Custom Production Package or On-Location Shoot?
              </h4>
              <p className="text-xs sm:text-sm text-[#A1A1AA] m-0 font-sans">
                We design bespoke contracts for international brands, television pilots, and enterprise media teams.
              </p>
            </div>
          </div>
          <a
            href="#contact?package=Custom"
            className="button button-outline font-mono text-xs uppercase font-bold tracking-wider shrink-0"
          >
            Design Custom Scope →
          </a>
        </div>
      </div>
    </section>
  );
}
