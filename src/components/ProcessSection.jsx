import { Compass, Lightbulb, Clapperboard, Rocket, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProcessSection() {
  const steps = [
    {
      step: "01",
      title: "Discover",
      phase: "AUDIT & ALIGNMENT",
      icon: Compass,
      timeframe: "Days 1–3",
      description:
        "We dissect your existing content, customer journey, top competitors, and revenue goals to uncover untapped growth angles.",
      deliverables: [
        "In-depth channel & retention audit",
        "Target buyer avatar definition",
        "Competitor whitespace analysis",
      ],
    },
    {
      step: "02",
      title: "Strategy",
      phase: "CONTENT BLUEPRINT",
      icon: Lightbulb,
      timeframe: "Days 4–7",
      description:
        "We build your multi-platform content roadmap, viral hook frameworks, weekly posting schedule, and conversion funnels.",
      deliverables: [
        "Monthly editorial calendar",
        "High-retention scripting templates",
        "Format & aspect ratio master plan",
      ],
    },
    {
      step: "03",
      title: "Create",
      phase: "SHOOT & NLE FINISHING",
      icon: Clapperboard,
      timeframe: "Ongoing Sprints",
      description:
        "From cinema-grade shooting direction to DaVinci Resolve color grading, kinetic typography, and bespoke sound foley.",
      deliverables: [
        "4K commercial & 9:16 vertical cuts",
        "Bespoke sound design & audio ducking",
        "High-CTR thumbnail packaging",
      ],
    },
    {
      step: "04",
      title: "Grow",
      phase: "ANALYTICS & COMPOUNDING",
      icon: Rocket,
      timeframe: "Continuous Scaling",
      description:
        "We track watch time, retention curves, and inbound lead conversion, optimizing every upcoming cut to compound reach and sales.",
      deliverables: [
        "Weekly performance dashboard",
        "A/B testing on hooks & thumbnails",
        "Full-funnel pipeline attribution",
      ],
    },
  ];

  return (
    <section
      id="process"
      aria-labelledby="process-section-title"
      className="py-24 bg-[#0A0A0A] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
                PROVEN 4-STEP TIMELINE
              </span>
            </div>
            <h2
              id="process-section-title"
              className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display m-0"
            >
              How we turn your content <br />
              into <span className="text-[#FFD21C]">compounding revenue.</span>
            </h2>
          </div>
          <p className="text-base text-[#A1A1AA] max-w-md m-0 font-sans leading-relaxed">
            A frictionless, predictable production engine designed to save you 20+ hours a week while 10x-ing your digital presence.
          </p>
        </div>

        {/* 4-Step Cards Grid with Connecting Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="p-6 sm:p-7 rounded-2xl bg-[#141414]/90 backdrop-blur-md border border-[#222222] hover:border-[#FFD21C]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-black text-[#FFD21C] bg-[#FFD21C]/10 border border-[#FFD21C]/20 px-2.5 py-1 rounded-md">
                      STEP {st.step}
                    </span>
                    <span className="font-mono text-[11px] text-[#71717A] uppercase">
                      {st.timeframe}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] border border-white/5 text-[#FFD21C] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#FFD21C] group-hover:text-[#0A0A0A] transition-all">
                    <Icon size={24} />
                  </div>

                  <span className="font-mono text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider block mb-1">
                    {st.phase}
                  </span>
                  <h3 className="text-2xl font-black text-white mb-3 font-display">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6 font-sans">
                    {st.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#222222]">
                  <strong className="block text-[11px] font-mono text-white/90 uppercase tracking-wider mb-2">
                    Key Deliverables:
                  </strong>
                  <ul className="space-y-1.5 m-0 p-0 list-none">
                    {st.deliverables.map((item, dIdx) => (
                      <li
                        key={dIdx}
                        className="text-xs text-[#A1A1AA] flex items-center gap-2 font-sans"
                      >
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

        {/* Mid-page Conversion Trigger */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#141414] via-[#1A1A1A] to-[#141414] border border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <h4 className="text-xl sm:text-2xl font-black text-white m-0 mb-1 font-display">
              Ready to automate your content engine?
            </h4>
            <p className="text-xs sm:text-sm text-[#A1A1AA] m-0 font-sans">
              Book a 15-minute strategy call. We will review your current content and build your custom growth plan.
            </p>
          </div>
          <a
            href="#contact"
            className="button button-gold py-3.5 px-6 font-mono text-xs uppercase font-bold tracking-wider shrink-0 shadow-[0_0_20px_rgba(255,210,28,0.3)] hover:scale-105 transition-transform"
          >
            Claim Your Free Audit →
          </a>
        </div>
      </div>
    </section>
  );
}
