import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight, Play, Volume2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { projects as fallbackProjects } from "../data/projects.js";
import {
  AspectPill,
  AudioEqualizer,
  RecIndicator,
  ResolutionBadge,
  TimecodeBadge,
  ViewfinderCorners,
} from "./StudioGraphics.jsx";
import CinemaModal from "./CinemaModal.jsx";

export default function HeroReel({ projects: customProjects }) {
  const reduceMotion = useReducedMotion();
  const availableProjects = customProjects && customProjects.length > 0 ? customProjects : fallbackProjects;
  const heroProjects = availableProjects.filter((p) => p.image).slice(0, 4);

  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [elapsedFrames, setElapsedFrames] = useState(14);
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [cinemaModalProject, setCinemaModalProject] = useState(null);

  const activeProject = heroProjects[activeProjectIndex] || heroProjects[0] || fallbackProjects[0];

  // Subtle ticking frame counter for authentic editing room feel
  useEffect(() => {
    if (reduceMotion) return undefined;
    const interval = setInterval(() => {
      setElapsedFrames((prev) => (prev >= 24 ? 1 : prev + 1));
    }, 110);
    return () => clearInterval(interval);
  }, [reduceMotion]);

  const entrance = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <section aria-labelledby="home-title" className="vip-hero relative">
        <div className="vip-hero-copy">
          <motion.div
            animate="visible"
            className="flex flex-wrap items-center gap-2 mb-4"
            initial="hidden"
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            variants={entrance}
          >
            <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[#12101E] text-[#FFFDF8] shadow-md border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#FF4D2D] animate-pulse shadow-[0_0_8px_#FF4D2D]" />
              VIP STUDIOS // 2026 EDITORIAL SUITE
            </span>
            <span className="font-mono text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-[#F5F3FF] text-[#635BFF] border border-[#635BFF]/25 shadow-sm">
              COMMISSIONS OPEN
            </span>
          </motion.div>

          <motion.h1
            animate="visible"
            className="vip-hero-headline"
            id="home-title"
            initial="hidden"
            transition={{ duration: reduceMotion ? 0 : 0.45, delay: 0.08 }}
            variants={entrance}
          >
            WE MAKE
            <br />
            EVERY FRAME
            <br />
            <span>COUNT.</span>
          </motion.h1>

          <motion.p
            animate="visible"
            className="vip-hero-intro"
            initial="hidden"
            transition={{ duration: reduceMotion ? 0 : 0.45, delay: 0.16 }}
            variants={entrance}
          >
            A dedicated creative video editing and digital content studio.
            We craft high-retention vertical reels, cinematic commercials, YouTube series,
            and visual narratives engineered to hold attention.
          </motion.p>

          <motion.div
            animate="visible"
            className="vip-hero-actions"
            initial="hidden"
            transition={{ duration: reduceMotion ? 0 : 0.45, delay: 0.24 }}
            variants={entrance}
          >
            <Link className="button button-gold group" to="/work">
              Explore Selected Cuts
              <ArrowUpRight
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                size={17}
              />
            </Link>
            <Link className="button button-outline" to="/contact">
              Start a Project
              <span className="font-mono text-[11px] text-[#FF4D2D] ml-1 font-bold">[BRIEF]</span>
            </Link>
          </motion.div>

          {/* Technical Rig Badges */}
          <motion.div
            animate="visible"
            className="mt-8 pt-6 border-t border-[#E8E4DC] flex flex-wrap items-center gap-2.5 text-xs font-mono text-[#5C586B]"
            initial="hidden"
            transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0.32 }}
            variants={entrance}
          >
            <span className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-lg border border-[#E8E4DC] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] shadow-[0_0_6px_#00E599]" />
              4K // 60FPS DCI
            </span>
            <span className="bg-white/90 px-3 py-1 rounded-lg border border-[#E8E4DC] shadow-sm">
              DAVINCI RESOLVE
            </span>
            <span className="bg-white/90 px-3 py-1 rounded-lg border border-[#E8E4DC] shadow-sm">
              MULTI-TRACK FOLEY
            </span>
            <span className="bg-white/90 px-3 py-1 rounded-lg border border-[#E8E4DC] shadow-sm">
              9:16 + 16:9 MASTERS
            </span>
          </motion.div>
        </div>

        {/* Right Column: Studio Monitor Rig */}
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="vip-hero-stage"
          initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.2 }}
        >
          <div className="studio-monitor-frame bg-[#0E0C18] text-[#FFFDF8] rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[0_20px_60px_rgba(18,16,30,0.25)] border border-[#231F3A] relative overflow-hidden">
            {/* Monitor Top Bar */}
            <div className="flex items-center justify-between pb-3 mb-2.5 border-b border-white/10 text-[11px] font-mono">
              <div className="flex items-center gap-2">
                <RecIndicator />
                <span className="text-white/60 hidden sm:inline">LIVE NLE // SUITE-01</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <AspectPill
                  aspect={activeProject?.category === "Reels & Short-form" ? "9:16" : "16:9"}
                  resolution="4K HDR"
                />
                <TimecodeBadge
                  label="TIMECODE"
                  timecode={`00:01:24:${String(elapsedFrames).padStart(2, "0")}`}
                />
              </div>
            </div>

            {/* Main Visual Screen Viewport */}
            <div
              className="relative aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-black/60 group cursor-pointer shadow-inner"
              onClick={() => setCinemaModalProject(activeProject)}
              title="Click to preview in cinema mode"
            >
              <img
                alt={activeProject?.imageAlt || activeProject?.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                height="900"
                loading="eager"
                src={activeProject?.image}
                style={{ objectPosition: activeProject?.imagePosition || "center" }}
                width="1400"
              />

              {/* Viewfinder Overlay HUD */}
              <ViewfinderCorners color="rgba(255, 255, 255, 0.85)" />

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                <div className="w-14 h-14 rounded-full bg-[#FF4D2D] text-white flex items-center justify-center shadow-[0_0_30px_rgba(255,77,45,0.6)] transform scale-90 group-hover:scale-100 transition-transform">
                  <Play className="ml-1" fill="currentColor" size={20} />
                </div>
              </div>

              {/* Bottom Screen Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
                <div className="bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/15 shadow-sm">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-[#FF4D2D] font-bold m-0">
                    {activeProject?.category}
                  </p>
                  <h2 className="text-sm font-bold text-white m-0 tracking-tight">
                    {activeProject?.title}
                  </h2>
                </div>
                <button
                  aria-label={`Open details for ${activeProject?.title}`}
                  className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF4D2D] hover:bg-[#E63B19] text-white text-xs font-bold font-mono shadow-[0_4px_16px_rgba(255,77,45,0.4)] transition-transform hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCinemaModalProject(activeProject);
                  }}
                  type="button"
                >
                  <Play size={11} fill="currentColor" />
                  <span>PREVIEW CUT</span>
                </button>
              </div>
            </div>

            {/* Switcher Timeline Deck */}
            <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {heroProjects.map((project, idx) => (
                  <button
                    aria-pressed={activeProjectIndex === idx}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all ${
                      activeProjectIndex === idx
                        ? "bg-[#FF4D2D] text-white shadow-[0_2px_10px_rgba(255,77,45,0.4)] scale-105"
                        : "bg-white/5 hover:bg-white/10 text-white/70"
                    }`}
                    key={project.slug || idx}
                    onClick={() => setActiveProjectIndex(idx)}
                    type="button"
                  >
                    CUT 0{idx + 1}
                  </button>
                ))}
              </div>

              <div
                className="flex items-center gap-2 text-white/70 text-xs font-mono cursor-pointer select-none hover:text-white transition-colors"
                onClick={() => setIsPlayingAudio((prev) => !prev)}
                title="Toggle visualizer"
              >
                <Volume2 size={13} className={isPlayingAudio ? "text-[#00E599]" : "text-white/40"} />
                <AudioEqualizer isPlaying={isPlayingAudio} />
                <span className="hidden sm:inline text-[10px] text-white/50">48kHz MASTER</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Down Scroll Anchor */}
        <a className="vip-scroll-cue font-mono" href="#featured-cuts">
          <span>EXPLORE THE ARCHIVE</span>
          <ArrowDown aria-hidden="true" size={14} />
        </a>
      </section>

      {/* Cinema Modal Lightbox */}
      <CinemaModal
        isOpen={Boolean(cinemaModalProject)}
        onClose={() => setCinemaModalProject(null)}
        project={cinemaModalProject}
      />
    </>
  );
}
