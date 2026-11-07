import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Play, Sparkles, Video, Youtube, Instagram, ShieldCheck } from "lucide-react";
import { projects as fallbackProjects } from "../data/projects.js";
import { getFallbackImage } from "../data/fallbackImages.js";
import CinemaModal from "./CinemaModal.jsx";

const CLIENT_LOGOS = [
  "CINEWAVE STUDIOS",
  "PULSE APPAREL",
  "APEX MEDIA",
  "FOUNDER PERSPECTIVES",
  "VELOCITY GLOBAL",
  "LUMINARY MEDIA",
  "THE BLUEPRINT",
  "KALA COLLECTIVE",
];

const SERVICE_KEYWORDS = [
  "HIGH-RETENTION REELS",
  "COMMERCIAL 4K SHOOTS",
  "DAVINCI COLOR RESOLVE",
  "VIRAL SHORT-FORM",
  "YOUTUBE MANAGEMENT",
  "VISUAL PODCASTS",
  "RETENTION HOOKS",
  "OMNICHANNEL SCALING",
];

export default function HeroReel({ projects: customProjects, onOpenCalendly }) {
  const reduceMotion = useReducedMotion();
  const availableProjects = customProjects && customProjects.length > 0 ? customProjects : fallbackProjects;
  const heroProjects = availableProjects.filter((p) => p.image).slice(0, 4);

  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [cinemaModalProject, setCinemaModalProject] = useState(null);

  const activeProject = heroProjects[activeProjectIndex] || heroProjects[0] || fallbackProjects[0];
  const activeFallback = getFallbackImage(activeProject?.slug);

  return (
    <>
      <section aria-labelledby="hero-headline" className="relative bg-[#0A0A0A] text-white overflow-hidden pt-28 pb-16">
        {/* Subtle Aurora Glow Mesh in background */}
        <div
          aria-hidden="true"
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-br from-[#FFD21C]/15 via-[#FFD21C]/5 to-transparent blur-3xl pointer-events-none rounded-full"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Outcome Headline & Conversion CTAs */}
            <div className="lg:col-span-7">
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616] border border-[#2A2A2A] text-xs font-mono text-[#CCCCCC] mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C] animate-pulse" />
                <span className="text-[#FFD21C] font-bold">50+ BRANDS SCALED</span>
                <span className="text-white/20">|</span>
                <span>120M+ ORGANIC VIEWS GENERATED</span>
              </div>

              {/* Main Outcome-Driven Headline */}
              <h1
                id="hero-headline"
                className="font-display font-black tracking-tight text-white mb-6 leading-none text-4xl sm:text-6xl lg:text-7xl"
              >
                WE TURN YOUR CONTENT INTO{" "}
                <span className="text-[#FFD21C] drop-shadow-[0_0_35px_rgba(255,210,28,0.35)]">
                  CUSTOMERS.
                </span>
              </h1>

              {/* One-Line Subheading */}
              <p className="text-base sm:text-xl text-[#A1A1AA] max-w-2xl leading-relaxed mb-8 font-sans">
                Full-funnel video production, viral short-form editing, and digital growth strategy engineered to turn viewers into loyal paying customers.
              </p>

              {/* Two Direct CTAs + WhatsApp */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <a
                  href="#contact"
                  className="button button-gold py-4 px-8 text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-[0_0_25px_rgba(255,210,28,0.4)] hover:scale-105 transition-all"
                >
                  <Sparkles size={15} />
                  <span>Book a Free Strategy Call</span>
                  <ArrowUpRight size={16} />
                </a>

                <a
                  href="#portfolio"
                  className="button button-outline py-4 px-7 text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:border-[#FFD21C] hover:text-white"
                >
                  <Play size={13} className="fill-current text-[#FFD21C]" />
                  <span>Watch Our Work</span>
                </a>
              </div>

              {/* Quick Floating Feature Badges */}
              <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] text-[#A1A1AA]">
                <span className="px-2.5 py-1 rounded bg-[#141414] border border-white/5 flex items-center gap-1.5">
                  <Video size={12} className="text-[#FFD21C]" /> 4K Cinema DCI
                </span>
                <span className="px-2.5 py-1 rounded bg-[#141414] border border-white/5 flex items-center gap-1.5">
                  <Instagram size={12} className="text-[#FFD21C]" /> 9:16 Viral Reels
                </span>
                <span className="px-2.5 py-1 rounded bg-[#141414] border border-white/5 flex items-center gap-1.5">
                  <Youtube size={12} className="text-[#FFD21C]" /> DaVinci Color Grade
                </span>
                <span className="px-2.5 py-1 rounded bg-[#141414] border border-white/5 flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-[#FFD21C]" /> Unlimited Revisions
                </span>
              </div>
            </div>

            {/* Right Column: Clean & Modern Video Showcase Container */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-[#141414] text-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-[#222222] relative overflow-hidden group">
                {/* 16:9 Showcase Window */}
                <div
                  className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black cursor-pointer border border-white/10"
                  onClick={() => {
                    if (activeProject?.externalUrl) {
                      window.open(activeProject.externalUrl, "_blank", "noopener,noreferrer");
                    } else {
                      setCinemaModalProject(activeProject);
                    }
                  }}
                  title={activeProject?.externalUrl ? "Click to watch on YouTube (new tab)" : "Click to preview cut"}
                >
                  <img
                    alt={activeProject?.imageAlt || activeProject?.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    height="900"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.src = activeFallback;
                    }}
                    src={activeProject?.image || activeFallback}
                    style={{ objectPosition: activeProject?.imagePosition || "center" }}
                    width="1400"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 z-10 pointer-events-none" />

                  {/* Center Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-90 group-hover:opacity-100 transition-opacity z-20">
                    <div className="w-14 h-14 rounded-full bg-[#FFD21C] text-[#0A0A0A] flex items-center justify-center shadow-[0_0_25px_rgba(255,210,28,0.6)] transform transition-transform group-hover:scale-110">
                      <Play className="ml-1 fill-current" size={22} />
                    </div>
                  </div>

                  {/* Bottom Card Bar */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
                    <div className="bg-black/85 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                      <p className="font-mono text-[9px] uppercase tracking-wider text-[#FFD21C] font-bold m-0">
                        {activeProject?.category}
                      </p>
                      <h2 className="text-sm font-bold text-white m-0 tracking-tight">
                        {activeProject?.title}
                      </h2>
                    </div>
                    <span className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFD21C] text-[#0A0A0A] text-xs font-bold font-mono shadow-md">
                      <Play className="fill-current" size={11} />
                      <span>WATCH CUT</span>
                    </span>
                  </div>
                </div>

                {/* Cut Switcher Tabs */}
                <div className="mt-3 pt-3 border-t border-[#222222] flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-[#A1A1AA] uppercase">
                    Featured Master:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                    {heroProjects.map((project, idx) => (
                      <button
                        key={project.slug || idx}
                        type="button"
                        aria-pressed={activeProjectIndex === idx}
                        onClick={() => setActiveProjectIndex(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          activeProjectIndex === idx
                            ? "bg-[#FFD21C] text-[#0A0A0A] shadow-sm font-black"
                            : "bg-[#1C1C1C] text-[#A1A1AA] hover:text-white hover:bg-[#252525]"
                        }`}
                      >
                        Cut 0{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Strip Marquee Beneath Hero */}
        <div className="mt-16 pt-8 border-t border-[#1E1E1E] overflow-hidden">
          <p className="text-center font-mono text-[11px] uppercase tracking-widest text-[#71717A] mb-5">
            TRUSTED BY LEADERS &amp; HIGH-GROWTH BRANDS WORLDWIDE
          </p>

          <div className="relative w-full overflow-hidden flex whitespace-nowrap">
            <div className="animate-marquee flex items-center gap-10 font-mono text-xs font-bold text-[#A1A1AA]">
              {CLIENT_LOGOS.concat(CLIENT_LOGOS).map((logo, idx) => (
                <div key={idx} className="flex items-center gap-10">
                  <span className="hover:text-white transition-colors">{logo}</span>
                  <span className="text-[#FFD21C]">✦</span>
                </div>
              ))}
            </div>
          </div>

          {/* Looping Marquee of Service Keywords */}
          <div className="relative w-full overflow-hidden flex whitespace-nowrap mt-4 opacity-70">
            <div className="animate-marquee flex items-center gap-10 font-mono text-[10px] font-semibold text-[#71717A]">
              {SERVICE_KEYWORDS.concat(SERVICE_KEYWORDS).map((kw, idx) => (
                <div key={idx} className="flex items-center gap-10">
                  <span>{kw}</span>
                  <span className="text-white/20">/</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Cinema Modal */}
      <CinemaModal
        isOpen={Boolean(cinemaModalProject)}
        onClose={() => setCinemaModalProject(null)}
        project={cinemaModalProject}
      />
    </>
  );
}
