import { CheckCircle2, Search, Compass, Clapperboard, CheckCheck, UploadCloud, BarChart2 } from "lucide-react";

export default function ProcessSection() {
  const steps = [
    {
      step: "01",
      title: "Understand",
      subtitle: "AUDIT & ALIGNMENT",
      icon: Search,
      desc: "We analyze your business model, target audience, competitive landscape, and current digital presence to establish baseline goals.",
    },
    {
      step: "02",
      title: "Strategize",
      subtitle: "CONTENT BLUEPRINT",
      icon: Compass,
      desc: "Develop strategic content pillars, monthly calendars, creative scripting angles, and multi-format distribution plans.",
    },
    {
      step: "03",
      title: "Create",
      subtitle: "PRODUCTION & EDITING",
      icon: Clapperboard,
      desc: "Shoot on-location or edit raw client footage, crafting Reels, YouTube videos, carousels, and high-impact graphic creatives.",
    },
    {
      step: "04",
      title: "Review",
      subtitle: "CLIENT APPROVAL",
      icon: CheckCheck,
      desc: "Share all formatted creatives and captions via dedicated review channels for your feedback, adjustments, and sign-off.",
    },
    {
      step: "05",
      title: "Publish",
      subtitle: "SCHEDULED ROLLOUT",
      icon: UploadCloud,
      desc: "Schedule and publish approved content across Instagram, Facebook, YouTube, and LinkedIn at peak audience activity hours.",
    },
    {
      step: "06",
      title: "Analyse",
      subtitle: "PERFORMANCE OPTIMIZATION",
      icon: BarChart2,
      desc: "Review reach, watch time, and follower inquiries monthly to continually optimize creative hooks and conversion outcomes.",
    },
  ];

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="py-24 bg-[#0A0A0A] border-t border-[#1E1E1E] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
                OUR CONTENT PROCESS
              </span>
            </div>
            <h2
              id="process-heading"
              className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display m-0"
            >
              From Strategy <br />
              <span className="text-[#FFD21C]">to Publishing.</span>
            </h2>
          </div>
          <p className="text-base text-[#A1A1AA] max-w-md m-0 font-sans leading-relaxed">
            A reliable 6-step content pipeline that keeps your business visible, active, and professional across social channels every single week.
          </p>
        </div>

        {/* 6-Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="p-7 rounded-2xl bg-[#141414]/90 backdrop-blur-md border border-[#222222] hover:border-[#FFD21C]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl"
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

                  <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] border border-white/5 text-[#FFD21C] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#FFD21C] group-hover:text-[#0A0A0A] transition-all">
                    <Icon size={22} />
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2 font-display">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed m-0 font-sans">
                    {st.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between text-xs font-mono text-[#71717A]">
                  <span>SYSTEM PHASE</span>
                  <CheckCircle2 size={15} className="text-[#FFD21C]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
