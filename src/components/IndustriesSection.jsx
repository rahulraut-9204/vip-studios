import {
  Stethoscope,
  Landmark,
  GraduationCap,
  UserCheck,
  Mic,
  Sparkles,
  UtensilsCrossed,
  Building2,
  ShoppingBag,
  Briefcase,
} from "lucide-react";

export default function IndustriesSection() {
  const industries = [
    {
      name: "Healthcare & Clinics",
      desc: "Patient education reels, procedure awareness, doctor positioning, and clinic trust building.",
      icon: Stethoscope,
    },
    {
      name: "Finance & Financial Education",
      desc: "Simplified financial breakdown reels, wealth carousels, market insights, and compliant advisory content.",
      icon: Landmark,
    },
    {
      name: "Education & Coaching",
      desc: "Course launch campaigns, student testimonials, high-value framework breakdowns, and workshop promotions.",
      icon: GraduationCap,
    },
    {
      name: "Personal Brands & Founders",
      desc: "Executive thought leadership, behind-the-scenes founder stories, LinkedIn carousels, and YouTube authority.",
      icon: UserCheck,
    },
    {
      name: "Podcasts & Creators",
      desc: "Multi-cam studio shoots, dynamic audio mastering, viral short cutdowns, and episodic rollout management.",
      icon: Mic,
    },
    {
      name: "Astrology & Professional Services",
      desc: "Consultancy awareness, forecast reels, client review spotlights, and booking funnel generation.",
      icon: Sparkles,
    },
    {
      name: "Food, Dining & Lifestyle",
      desc: "Cinematic culinary video shoots, atmosphere reels, chef profiles, and localized foodie promotions.",
      icon: UtensilsCrossed,
    },
    {
      name: "Real Estate & Developers",
      desc: "Property walkthroughs, aerial drone cuts, developer credibility videos, and high-ticket investor reels.",
      icon: Building2,
    },
    {
      name: "Retail & E-Commerce",
      desc: "Product-in-use short clips, unboxing showcases, seasonal sale campaigns, and high-converting paid ad cuts.",
      icon: ShoppingBag,
    },
    {
      name: "Corporate & Enterprise",
      desc: "Company culture showcases, annual milestones, B2B product explainers, and recruitment video production.",
      icon: Briefcase,
    },
  ];

  return (
    <section
      id="industries"
      aria-labelledby="industries-title"
      className="py-24 bg-[#0E0E0E] border-t border-[#1E1E1E] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
                VERTICAL SPECIALIZATION
              </span>
            </div>
            <h2
              id="industries-title"
              className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display m-0"
            >
              Content Solutions For <br />
              <span className="text-[#FFD21C]">Every Kind of Business.</span>
            </h2>
          </div>
          <p className="text-base text-[#A1A1AA] max-w-md m-0 font-sans leading-relaxed">
            Every sector requires a unique tone of voice, visual aesthetic, and compliance sensitivity. Here are the verticals our team actively produces for.
          </p>
        </div>

        {/* 10 Industries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#141414]/90 border border-[#222222] hover:border-[#FFD21C]/50 transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#1C1C1C] text-[#FFD21C] flex items-center justify-center mb-4 border border-white/5 group-hover:scale-110 group-hover:bg-[#FFD21C] group-hover:text-[#0A0A0A] transition-all">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 font-display group-hover:text-[#FFD21C] transition-colors leading-snug">
                    {ind.name}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed m-0 font-sans">
                    {ind.desc}
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
