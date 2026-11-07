import { Instagram, ArrowUpRight, CheckCircle2, TrendingUp } from "lucide-react";

export default function ClientSocialShowcase() {
  const accounts = [
    {
      brand: "CineWave Studios",
      handle: "@cinewavestudios",
      industry: "Film & Creative Media",
      followers: "42.5K Followers",
      services: "Complete Instagram Management · Daily Reels · Carousel Strategy",
      highlights: "Built brand authority from scratch with high-contrast cinema breakdowns.",
      avatar: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=300&q=80",
      postPreview: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80",
      stats: "24 Monthly Posts · 85% Engagement Lift",
    },
    {
      brand: "Pulse Performance Apparel",
      handle: "@pulse.apparel",
      industry: "Retail & Activewear",
      followers: "68.2K Followers",
      services: "Instagram & Facebook Management · Reels Creation · Ad Creatives",
      highlights: "Engineered kinetic 9:16 short-form reels driving continuous customer acquisition.",
      avatar: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=300&q=80",
      postPreview: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=600&q=80",
      stats: "30 Monthly Reels · 3.2x Community Reach",
    },
    {
      brand: "Apex Media Group",
      handle: "@apexmedia.in",
      industry: "Corporate & Education",
      followers: "28.4K Followers",
      services: "LinkedIn & YouTube Channel Management · Carousel Design · Publishing",
      highlights: "Positioned corporate leadership as recognized industry experts through weekly series.",
      avatar: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80",
      postPreview: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      stats: "16 Monthly Carousels · High-Value Inbound",
    },
    {
      brand: "Founder Perspectives",
      handle: "@founderperspectives",
      industry: "Podcasts & Founders",
      followers: "54.1K Followers",
      services: "Multi-Cam Podcast Video · Short-Form Cutdowns · Community Publishing",
      highlights: "Full audio/video packaging resulting in top-tier business chart rankings.",
      avatar: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=300&q=80",
      postPreview: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
      stats: "4 Full Episodes + 40 Cutdowns / Mo",
    },
  ];

  return (
    <section
      id="accounts-showcase"
      aria-labelledby="client-showcase-title"
      className="py-24 bg-[#0A0A0A] border-t border-[#1E1E1E] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
                PROVEN SOCIAL MEDIA MANAGEMENT
              </span>
            </div>
            <h2
              id="client-showcase-title"
              className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display m-0"
            >
              Brands We&apos;ve Helped <br />
              <span className="text-[#FFD21C]">Build Their Digital Presence.</span>
            </h2>
          </div>
          <p className="text-base text-[#A1A1AA] max-w-md m-0 font-sans leading-relaxed">
            We don&apos;t just deliver isolated video cuts. We manage complete social media accounts, driving consistent calendar execution, community engagement, and digital authority.
          </p>
        </div>

        {/* Account Mockup Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {accounts.map((acc, idx) => (
            <article
              key={idx}
              className="rounded-3xl bg-[#141414]/90 backdrop-blur-md border border-[#222222] hover:border-[#FFD21C]/50 transition-all duration-300 overflow-hidden shadow-2xl flex flex-col group"
            >
              {/* Account Header Strip */}
              <div className="p-6 sm:p-7 border-b border-[#222222] flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={acc.avatar}
                    alt={acc.brand}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#FFD21C] p-0.5"
                    loading="lazy"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white font-display flex items-center gap-1.5 m-0">
                      <span>{acc.brand}</span>
                      <CheckCircle2 size={16} className="text-[#FFD21C]" />
                    </h3>
                    <p className="text-xs font-mono text-[#A1A1AA] m-0">
                      {acc.handle} · <span className="text-white/80">{acc.industry}</span>
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-[#FFD21C]/10 border border-[#FFD21C]/25 text-[#FFD21C] text-xs font-mono font-bold shrink-0">
                  {acc.followers}
                </span>
              </div>

              {/* Account Content & Mockup Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-black border border-white/10 group-hover:border-[#FFD21C]/40 transition-colors">
                    <img
                      src={acc.postPreview}
                      alt={`${acc.brand} social media content preview`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white">
                      <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-sm border border-white/10 flex items-center gap-1.5">
                        <Instagram size={13} className="text-[#FFD21C]" /> Managed Feed &amp; Reels
                      </span>
                      <span className="text-[11px] text-[#FFD21C] font-bold">
                        {acc.stats}
                      </span>
                    </div>
                  </div>

                  <strong className="block text-xs font-mono text-[#FFD21C] uppercase tracking-wider mb-1">
                    Services Managed:
                  </strong>
                  <p className="text-xs sm:text-sm text-white/90 font-sans mb-3">
                    {acc.services}
                  </p>
                  <p className="text-xs text-[#A1A1AA] font-sans leading-relaxed m-0 mb-6">
                    {acc.highlights}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#222222] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#71717A] flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-[#FFD21C]" /> Consistent Monthly Execution
                  </span>
                  <a
                    href="#enquiry"
                    className="text-xs font-mono font-bold text-[#FFD21C] hover:underline inline-flex items-center gap-1"
                  >
                    Manage My Brand →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
