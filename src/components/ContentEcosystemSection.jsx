import { Video, Instagram, Youtube, Layers, Smartphone, ArrowDown, ArrowRight, Sparkles } from "lucide-react";

export default function ContentEcosystemSection() {
  const outputs = [
    {
      format: "Instagram Reels",
      aspect: "9:16 Vertical",
      desc: "Fast-hook vertical video with kinetic captions and sound sync to maximize explore feed visibility.",
      icon: Instagram,
    },
    {
      format: "YouTube Shorts",
      aspect: "9:16 Vertical",
      desc: "Repurposed vertical cuts optimized for YouTube search and algorithm-driven subscriber growth.",
      icon: Youtube,
    },
    {
      format: "Facebook Reels",
      aspect: "9:16 Vertical",
      desc: "Extended reach tapping into Facebook's massive community and localized audience demographic.",
      icon: Smartphone,
    },
    {
      format: "Carousel Posts",
      aspect: "4:5 / 1:1 Feed",
      desc: "Multi-slide infographics and quote slides extracting high-save insights from the shoot.",
      icon: Layers,
    },
    {
      format: "Interactive Stories",
      aspect: "9:16 Daily",
      desc: "Polls, question boxes, and behind-the-scenes clips that maintain direct daily audience engagement.",
      icon: Sparkles,
    },
    {
      format: "Full YouTube Videos",
      aspect: "16:9 Long-Form",
      desc: "Deep-dive episodic cuts building long-term search authority and thought-leadership credibility.",
      icon: Video,
    },
  ];

  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-heading"
      className="py-24 bg-[#0E0E0E] border-t border-[#1E1E1E] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFD21C]/10 border border-[#FFD21C]/25 text-[#FFD21C] text-xs font-mono font-bold uppercase tracking-wider mb-4">
            INTEGRATED CONTENT SYSTEM
          </div>
          <h2
            id="ecosystem-heading"
            className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display m-0 mb-4"
          >
            One Idea. <span className="text-[#FFD21C]">Multiple Content Opportunities.</span>
          </h2>
          <p className="text-base text-[#A1A1AA] m-0 font-sans leading-relaxed">
            We extract maximum value from every production session. A single strategic shoot is engineered into an omnichannel content library adapted for every platform and attention span.
          </p>
        </div>

        {/* Central Shoot Origin Banner */}
        <div className="max-w-xl mx-auto p-6 rounded-2xl bg-[#161616] border-2 border-[#FFD21C] shadow-[0_0_35px_rgba(255,210,28,0.2)] text-center mb-10">
          <span className="font-mono text-xs font-black text-[#FFD21C] uppercase tracking-widest block mb-1">
            CORE PRODUCTION SPRINT
          </span>
          <h3 className="text-2xl font-black text-white font-display m-0">
            ONE CONTENT SHOOT
          </h3>
          <p className="text-xs text-[#A1A1AA] m-0 mt-1 font-sans">
            A single planned recording session with structured scripting and high-fidelity 4K capture.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="w-10 h-10 rounded-full bg-[#1C1C1C] border border-[#2E2E2E] text-[#FFD21C] flex items-center justify-center shadow-md animate-bounce">
            <ArrowDown size={18} />
          </div>
        </div>

        {/* Multi-Format Output Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outputs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-[#141414]/90 backdrop-blur-md border border-[#222222] hover:border-[#FFD21C]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-[#1C1C1C] text-[#FFD21C] flex items-center justify-center border border-white/5 group-hover:scale-110 group-hover:bg-[#FFD21C] group-hover:text-[#0A0A0A] transition-all">
                      <Icon size={20} />
                    </span>
                    <span className="font-mono text-[10px] text-[#A1A1AA] bg-[#1C1C1C] px-2.5 py-1 rounded border border-white/5 font-bold">
                      {item.aspect}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white mb-2 font-display group-hover:text-[#FFD21C] transition-colors">
                    {item.format}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed m-0 font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
