import { Lightbulb, CalendarCheck, Target, Film, Handshake } from "lucide-react";

export default function WhyVipSection() {
  const points = [
    {
      num: "01",
      title: "Creative Thinking",
      desc: "We focus on meaningful, high-retention content that communicates your brand value—not just filling an empty calendar with generic posts.",
      icon: Lightbulb,
    },
    {
      num: "02",
      title: "Consistent Execution",
      desc: "Consistency builds trust. We establish a reliable weekly rhythm for your social pages so your audience always stays engaged.",
      icon: CalendarCheck,
    },
    {
      num: "03",
      title: "Platform Understanding",
      desc: "Every platform speaks a different dialect. We adapt safe zones, captions, audio trends, and aspect ratios natively for Instagram, YouTube, and LinkedIn.",
      icon: Target,
    },
    {
      num: "04",
      title: "Creative Production",
      desc: "Strategy, camera shooting, DaVinci editing, graphic design, and copywriting work together seamlessly under one unified studio roof.",
      icon: Film,
    },
    {
      num: "05",
      title: "Long-Term Partnership",
      desc: "We act as an invested digital growth partner. We focus on building sustainable relationships, learning your business, and growing with you.",
      icon: Handshake,
    },
  ];

  return (
    <section
      id="why-vip"
      aria-labelledby="why-vip-heading"
      className="py-24 bg-[#0A0A0A] border-t border-[#1E1E1E] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
                THE VIP ADVANTAGE
              </span>
            </div>
            <h2
              id="why-vip-heading"
              className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display m-0"
            >
              Why Brands Choose <br />
              <span className="text-[#FFD21C]">VIP StudioS.</span>
            </h2>
          </div>
          <p className="text-base text-[#A1A1AA] max-w-md m-0 font-sans leading-relaxed">
            Content creation works best when unified. Here is how our collaborative approach elevates your brand above generic posting services.
          </p>
        </div>

        {/* 5 Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((pt) => {
            const Icon = pt.icon;
            return (
              <div
                key={pt.num}
                className="p-8 rounded-2xl bg-[#141414]/90 backdrop-blur-md border border-[#222222] hover:border-[#FFD21C]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-2xl font-black text-[#FFD21C]">
                      {pt.num}
                    </span>
                    <span className="w-10 h-10 rounded-xl bg-[#1C1C1C] text-[#FFD21C] flex items-center justify-center border border-white/5 group-hover:scale-110 group-hover:bg-[#FFD21C] group-hover:text-[#0A0A0A] transition-all">
                      <Icon size={18} />
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 font-display group-hover:text-[#FFD21C] transition-colors">
                    {pt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed m-0 font-sans">
                    {pt.desc}
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
