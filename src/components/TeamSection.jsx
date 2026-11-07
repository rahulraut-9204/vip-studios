import { Users } from "lucide-react";

export default function TeamSection() {
  const team = [
    {
      role: "Creative Director",
      focus: "Brand Narrative & Visual Vision",
      desc: "Oversees creative direction, storytelling structure, and cross-channel visual coherence for retained brands.",
      badge: "Direction",
    },
    {
      role: "Social Media Strategist",
      focus: "Content Planning & Channel Growth",
      desc: "Engineers monthly content pillars, trend hooks, audience targeting, and multi-platform publishing schedules.",
      badge: "Strategy",
    },
    {
      role: "Lead Video Editor",
      focus: "DaVinci Resolve & Rhythm Cutting",
      desc: "Specialized in micro-pacing, retention sound design, kinetic typography, and calibrated color finishing.",
      badge: "Post-Production",
    },
    {
      role: "Graphic & Carousel Designer",
      focus: "Infographics & Feed Identity",
      desc: "Designs high-save educational carousels, custom YouTube thumbnails, and branded feed layouts.",
      badge: "Visual Design",
    },
    {
      role: "Content Creator",
      focus: "Reels Concepts & Trend Execution",
      desc: "Researches trending audio formats, crafts viral retention hooks, and drafts audience-first scripts.",
      badge: "Creative",
    },
    {
      role: "Production & Camera Lead",
      focus: "On-Set Shoots & Lighting",
      desc: "Handles cinema camera setups, multi-cam podcast switching, directional audio, and pristine footage capture.",
      badge: "Production",
    },
  ];

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="py-24 bg-[#0A0A0A] border-t border-[#1E1E1E] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
                THE STUDIO TALENT
              </span>
            </div>
            <h2
              id="team-heading"
              className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display m-0"
            >
              Creative Minds Behind <br />
              <span className="text-[#FFD21C]">VIP StudioS.</span>
            </h2>
          </div>
          <p className="text-base text-[#A1A1AA] max-w-md m-0 font-sans leading-relaxed">
            A tight-knit, multidisciplinary team of editors, cinematographers, and social strategists based in Pune, dedicated to elevating your digital presence.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl bg-[#141414]/90 backdrop-blur-md border border-[#222222] hover:border-[#FFD21C]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded bg-[#FFD21C]/10 border border-[#FFD21C]/25 text-[#FFD21C] text-[10px] font-mono font-bold uppercase tracking-wider">
                    {member.badge}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#FFD21C]/40 group-hover:bg-[#FFD21C] transition-colors" />
                </div>

                <h3 className="text-xl font-bold text-white mb-1 font-display group-hover:text-[#FFD21C] transition-colors">
                  {member.role}
                </h3>
                <p className="text-xs font-mono text-white/70 mb-3">
                  {member.focus}
                </p>
                <p className="text-xs text-[#A1A1AA] leading-relaxed m-0 font-sans">
                  {member.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between text-xs font-mono text-[#71717A]">
                <span>VIP STUDIO CREW</span>
                <Users size={14} className="text-[#FFD21C]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
