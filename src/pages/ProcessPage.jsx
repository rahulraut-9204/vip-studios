import { ArrowUpRight, Search, Compass, Clapperboard, CheckCheck, UploadCloud, BarChart2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import ContentEcosystemSection from "../components/ContentEcosystemSection.jsx";

export default function ProcessPage() {
  const steps = [
    {
      step: "01",
      title: "Understand",
      subtitle: "AUDIT & ALIGNMENT",
      icon: Search,
      desc: "We analyze your business model, target audience, competitive landscape, and current digital presence to establish baseline goals and clear content objectives.",
      deliverables: ["Channel audit report", "Audience avatar definition", "Competitor gap analysis"],
    },
    {
      step: "02",
      title: "Strategize",
      subtitle: "CONTENT BLUEPRINT",
      icon: Compass,
      desc: "Develop strategic content pillars, monthly editorial calendars, creative scripting angles, and multi-platform distribution plans.",
      deliverables: ["Monthly content calendar", "Scripting & hook templates", "Hashtag & platform strategy"],
    },
    {
      step: "03",
      title: "Create",
      subtitle: "PRODUCTION & EDITING",
      icon: Clapperboard,
      desc: "Shoot on-location in Pune or edit raw client footage, crafting Reels, YouTube videos, carousels, and high-impact graphic creatives.",
      deliverables: ["4K video shooting & DaVinci grading", "Kinetic typography & sound design", "High-save carousel graphics"],
    },
    {
      step: "04",
      title: "Review",
      subtitle: "CLIENT APPROVAL",
      icon: CheckCheck,
      desc: "Share all formatted creatives and captions via dedicated review channels for your feedback, adjustments, and sign-off.",
      deliverables: ["Collaborative review links", "Caption & tag verification", "Unlimited revision rounds"],
    },
    {
      step: "05",
      title: "Publish",
      subtitle: "SCHEDULED ROLLOUT",
      icon: UploadCloud,
      desc: "Schedule and publish approved content across Instagram, Facebook, YouTube, and LinkedIn at peak audience activity hours.",
      deliverables: ["Optimal timing scheduling", "Community engagement monitoring", "Consistent weekly cadence"],
    },
    {
      step: "06",
      title: "Analyse",
      subtitle: "PERFORMANCE OPTIMIZATION",
      icon: BarChart2,
      desc: "Review reach, watch time, and follower inquiries monthly to continually optimize creative hooks and conversion outcomes.",
      deliverables: ["Monthly performance dashboard", "Creative hook A/B testing", "Next sprint recommendations"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <section className="studio-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <header className="studio-page-intro mb-16">
          <p className="studio-location font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
            OUR CONTENT PROCESS
          </p>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none mb-4 font-display">
            From Strategy <br />
            <span className="text-[#FFD21C]">to Publishing.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1AA] max-w-2xl leading-relaxed font-sans">
            A reliable 6-step content pipeline that keeps your business visible, active, and professional across social channels every single week.
          </p>
        </header>

        {/* 6-Step Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="p-8 rounded-2xl bg-[#141414] border border-[#222222] hover:border-[#FFD21C]/50 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-xs font-black text-[#FFD21C] bg-[#FFD21C]/10 border border-[#FFD21C]/25 px-2.5 py-1 rounded-md">
                      STEP {st.step}
                    </span>
                    <span className="font-mono text-[10px] text-[#71717A] tracking-wider uppercase font-bold">
                      {st.subtitle}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] border border-white/5 text-[#FFD21C] flex items-center justify-center mb-4">
                    <Icon size={22} />
                  </div>

                  <h2 className="text-2xl font-black text-white mb-2 font-display">
                    {st.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6 font-sans">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#222222]">
                  <strong className="block text-[11px] font-mono text-[#CCCCCC] uppercase tracking-wider mb-2">
                    Phase Deliverables:
                  </strong>
                  <ul className="space-y-1.5 m-0 p-0 list-none">
                    {st.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className="text-xs text-[#A1A1AA] flex items-center gap-2 font-sans">
                        <CheckCircle2 size={13} className="text-[#FFD21C] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Integrated Ecosystem Section */}
        <ContentEcosystemSection />

        {/* CTA Container */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#141414] border border-[#222222] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl mt-16">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 font-display">
              Ready to implement this content system for your brand?
            </h2>
            <p className="text-sm text-[#A1A1AA] max-w-xl m-0 font-sans">
              Tell us about your business goals and current social channels. We will design a custom monthly management and production roadmap.
            </p>
          </div>
          <Link
            to="/contact"
            className="button button-gold shrink-0 py-3.5 px-8 font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
          >
            Start Your Project <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
