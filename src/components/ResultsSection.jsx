import { TrendingUp, ArrowUpRight, BarChart3, Target, Sparkles } from "lucide-react";

export default function ResultsSection() {
  const caseStudies = [
    {
      client: "FounderMedia & SaaS Studio",
      category: "B2B Founder & Executive Brand",
      timeline: "90-Day Sprint",
      headline: "From Zero Organic Presence to 2.4M Views and +420% Inbound Inquiries",
      story:
        "Founder had deep expertise but no time to edit or script. We built a bi-weekly remote batch-record workflow, extracting 30 high-retention short clips and 2 long-form YouTube case studies per month.",
      metrics: [
        { label: "Organic Views", before: "12,400", after: "2,480,000", change: "+19,900%" },
        { label: "Avg Retention", before: "24%", after: "76%", change: "+216%" },
        { label: "Pipeline Generated", before: "$0", after: "$168,000", change: "Qualified Inbound" },
      ],
      badge: "B2B Inbound Engine",
    },
    {
      client: "Pulse Performance Apparel",
      category: "E-Commerce / D2C Brand",
      timeline: "60-Day Scaling Sprint",
      headline: "4.8x Meta & TikTok Ad ROAS via Kinetic Hooks and Fast-Paced Edits",
      story:
        "Ad creative fatigue was driving CPAs higher every week. VIP StudioS engineered 18 dynamic hook iterations and UGC cutdowns with sound-synced micro-cuts, drastically reducing customer acquisition costs.",
      metrics: [
        { label: "Paid Ad ROAS", before: "1.4x", after: "4.8x", change: "+242% Return" },
        { label: "Cost Per Acquisition", before: "$42.50", after: "$14.80", change: "-65% Cost" },
        { label: "3-Sec Hook Rate", before: "31%", after: "82%", change: "+164%" },
      ],
      badge: "E-Commerce Scaling",
    },
    {
      client: "The Dialogue Room Podcast",
      category: "Long-Form & Visual Podcast",
      timeline: "120-Day Launch Sprint",
      headline: "Launched New Show to 125K Subscribers & Top 1% Spotify Business Rank",
      story:
        "Full studio multi-cam production with dynamic switching, custom lower-thirds, mastered broadcast dialogue, and 45 weekly short-form cutdowns distributed across Reels, YouTube Shorts, and LinkedIn.",
      metrics: [
        { label: "Subscriber Base", before: "0", after: "125,000+", change: "Zero to Top 1%" },
        { label: "Shorts Impressions", before: "0", after: "18.2M", change: "Viral Distribution" },
        { label: "Sponsorship Rate", before: "$0", after: "$4,500/ep", change: "Monetized" },
      ],
      badge: "Media Brand Launch",
    },
  ];

  return (
    <section
      id="results"
      aria-labelledby="results-title"
      className="py-24 bg-[#0E0E0E] border-t border-[#1E1E1E] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
                DATA-DRIVEN CASE STUDIES
              </span>
            </div>
            <h2
              id="results-title"
              className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display m-0"
            >
              Real outcomes. <br />
              <span className="text-[#FFD21C]">Measurable growth.</span>
            </h2>
          </div>
          <p className="text-base text-[#A1A1AA] max-w-md m-0 font-sans leading-relaxed">
            We don&apos;t measure vanity metrics alone. Every editing technique, pacing rhythm, and hook is engineered to move the business needle.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, idx) => (
            <article
              key={idx}
              className="p-7 rounded-2xl bg-[#141414]/90 backdrop-blur-md border border-[#222222] hover:border-[#FFD21C]/50 transition-all duration-300 flex flex-col justify-between shadow-2xl relative group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded bg-[#FFD21C]/10 border border-[#FFD21C]/25 text-[#FFD21C] text-[10px] font-mono font-bold uppercase tracking-wider">
                    {study.badge}
                  </span>
                  <span className="font-mono text-xs text-[#71717A]">{study.timeline}</span>
                </div>

                <span className="block text-xs font-mono text-[#A1A1AA] mb-1">
                  {study.client}
                </span>
                <h3 className="text-xl font-black text-white tracking-tight mb-3 font-display group-hover:text-[#FFD21C] transition-colors leading-snug">
                  {study.headline}
                </h3>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6 font-sans">
                  {study.story}
                </p>
              </div>

              {/* Before vs After Metric Cards */}
              <div className="pt-5 border-t border-[#222222] space-y-3">
                <div className="font-mono text-[10px] text-[#71717A] uppercase tracking-wider flex justify-between">
                  <span>METRIC / BENCHMARK</span>
                  <span>VERIFIED OUTCOME</span>
                </div>

                {study.metrics.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-3 rounded-xl bg-[#181818] border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <span className="block text-xs font-bold text-white font-display">
                        {m.label}
                      </span>
                      <span className="text-[11px] font-mono text-[#71717A]">
                        {m.before} → <span className="text-white font-bold">{m.after}</span>
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#FFD21C]/15 border border-[#FFD21C]/30 text-[#FFD21C] text-xs font-mono font-black">
                      {m.change}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
