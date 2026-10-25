import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight, Play, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects.js";
import {
  AspectPill,
  AudioEqualizer,
  RecIndicator,
  TimecodeBadge,
  ViewfinderCorners,
} from "./StudioGraphics.jsx";

export default function HeroReel() {
  const reduceMotion = useReducedMotion();
  const heroProjects = projects.filter((project) => project.image).slice(0, 3);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [elapsedFrames, setElapsedFrames] = useState(14);

  const activeProject = heroProjects[activeProjectIndex] || heroProjects[0];

  // Subtle ticking frame counter for authentic editing feel
  useEffect(() => {
    if (reduceMotion) return undefined;
    const interval = setInterval(() => {
      setElapsedFrames((prev) => (prev >= 24 ? 1 : prev + 1));
    }, 120);
    return () => clearInterval(interval);
  }, [reduceMotion]);

  const entrance = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section aria-labelledby="home-title" className="vip-hero relative">
      <div className="vip-hero-copy">
        <motion.div
          animate="visible"
          className="flex flex-wrap items-center gap-2 mb-4"
          initial="hidden"
          transition={{ duration: reduceMotion ? 0 : 0.3 }}
          variants={entrance}
        >
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#19162B] text-[#FFFDF8] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FF6542] animate-pulse" />
            VIP STUDIOS // 2026 EDITORIAL SUITE
          </span>
          <span className="font-mono text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#F4F1FF] text-[#7765F8] border border-[#7765F8]/20">
            AVAILABLE FOR COMMISSIONS
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
          A dedicated creative video editing and digital production studio.
          We craft high-retention social reels, commercial cuts, podcast systems,
          and cinematic narratives that command attention.
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
            <ArrowUpRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={17} />
          </Link>
          <Link className="button button-outline" to="/contact">
            Start a Project
            <span className="font-mono text-[11px] text-[#FF6542] ml-1">[BRIEF]</span>
          </Link>
        </motion.div>

        {/* Technical Rig Badges */}
        <motion.div
          animate="visible"
          className="mt-8 pt-6 border-t border-[#EAE6E0] flex flex-wrap items-center gap-3 text-xs font-mono text-[#6E6A7C]"
          initial="hidden"
          transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0.32 }}
          variants={entrance}
        >
          <span className="flex items-center gap-1.5 bg-[#FFFDF8] px-2.5 py-1 rounded border border-[#EAE6E0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B9F4D0]" />
            4K // 60FPS
          </span>
          <span className="bg-[#FFFDF8] px-2.5 py-1 rounded border border-[#EAE6E0]">
            DA VINCI COLOR
          </span>
          <span className="bg-[#FFFDF8] px-2.5 py-1 rounded border border-[#EAE6E0]">
            DOLBY AUDIO MIX
          </span>
          <span className="bg-[#FFFDF8] px-2.5 py-1 rounded border border-[#EAE6E0]">
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
        <div className="studio-monitor-frame bg-[#19162B] text-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-[#27213D] relative overflow-hidden">
          {/* Monitor Top Bar */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10 text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <RecIndicator />
              <span className="text-white/60">PRVW // CAM-A</span>
            </div>
            <div className="flex items-center gap-2">
              <AspectPill aspect="16:9" resolution="4K DCI" />
              <TimecodeBadge
                label="TIMECODE"
                timecode={`00:01:24:${String(elapsedFrames).padStart(2, "0")}`}
              />
            </div>
          </div>

          {/* Main Visual Screen Viewport */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-lg overflow-hidden bg-black/40 group">
            <img
              alt={activeProject.imageAlt}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              height="900"
              loading="eager"
              src={activeProject.image}
              style={{ objectPosition: activeProject.imagePosition }}
              width="1400"
            />

            {/* Viewfinder Overlay HUD */}
            <ViewfinderCorners color="#FFFDF8" />

            {/* Center Reticle */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40"
            >
              <div className="w-8 h-8 border border-white/40 rounded-full flex items-center justify-center">
                <span className="w-2 h-[1px] bg-white/60" />
                <span className="h-2 w-[1px] bg-white/60 absolute" />
              </div>
            </div>

            {/* Bottom Screen Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
              <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded border border-white/15">
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#FF6542] m-0">
                  {activeProject.category}
                </p>
                <h2 className="text-sm font-bold text-white m-0 tracking-tight">
                  {activeProject.title}
                </h2>
              </div>
              <Link
                aria-label={`Open details for ${activeProject.title}`}
                className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF6542] hover:bg-[#E85331] text-white text-xs font-bold font-mono shadow-lg transition-transform hover:scale-105"
                to={`/work/${activeProject.slug}`}
              >
                <span>OPEN CUT</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>

          {/* Switcher Timeline Deck */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {heroProjects.map((project, idx) => (
                <button
                  aria-pressed={activeProjectIndex === idx}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                    activeProjectIndex === idx
                      ? "bg-[#FF6542] text-white shadow"
                      : "bg-white/5 hover:bg-white/10 text-white/70"
                  }`}
                  key={project.slug}
                  onClick={() => setActiveProjectIndex(idx)}
                  type="button"
                >
                  CUT 0{idx + 1}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-white/60 text-xs font-mono">
              <Volume2 size={13} className="text-[#B9F4D0]" />
              <AudioEqualizer isPlaying />
              <span className="hidden sm:inline text-[10px] text-white/40">STEREO // -6dB</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Down Scroll Anchor */}
      <a className="vip-scroll-cue" href="#featured-cuts">
        <span>EXPLORE THE TIMELINE</span>
        <ArrowDown aria-hidden="true" size={14} />
      </a>
    </section>
  );
}
