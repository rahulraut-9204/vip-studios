import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight, MessageCircle, Play, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import { projects as fallbackProjects } from "../data/projects.js";
import { getFallbackImage } from "../data/fallbackImages.js";
import { getWhatsAppHref } from "../data/contact.js";
import {
  AspectPill,
  AudioEqualizer,
  RecIndicator,
  TimecodeBadge,
  ViewfinderCorners,
} from "./StudioGraphics.jsx";
import CinemaModal from "./CinemaModal.jsx";

const JOURNEY_STEPS = [
  "Strategy",
  "Content",
  "Shoot",
  "Edit",
  "Publish",
  "Manage",
  "Analyse",
  "Grow",
];

export default function HeroReel({ projects: customProjects }) {
  const reduceMotion = useReducedMotion();
  const availableProjects = customProjects && customProjects.length > 0 ? customProjects : fallbackProjects;
  const heroProjects = availableProjects.filter((p) => p.image).slice(0, 4);

  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [elapsedFrames, setElapsedFrames] = useState(14);
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [cinemaModalProject, setCinemaModalProject] = useState(null);
  const whatsAppHref = getWhatsAppHref(
    "Hi VIP StudioS, I'm looking for a complete content and digital growth partner."
  );

  const activeProject = heroProjects[activeProjectIndex] || heroProjects[0] || fallbackProjects[0];
  const activeFallback = getFallbackImage(activeProject?.slug);

  // Frame counter for cinematic editing room authentic feel
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
      <section aria-labelledby="home-title" className="vip-hero relative bg-[#0A0A0A] text-white">
        <div className="vip-hero-copy">
          <motion.div
            animate="visible"
            className="flex flex-wrap items-center gap-2 mb-5"
            initial="hidden"
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            variants={entrance}
          >
            <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded bg-[#161616] text-[#FFD21C] border border-[#FFD21C]/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FFD21C] animate-pulse shadow-[0_0_8px_#FFD21C]" />
              VIP STUDIOS // COMPLETE GROWTH PARTNER
            </span>
            <span className="font-mono text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded bg-white/5 text-white/80 border border-white/10">
              NOT JUST A POSTING AGENCY
            </span>
          </motion.div>

          <motion.h1
            animate="visible"
            className="vip-hero-headline font-display font-black tracking-tight text-white mb-6 leading-none"
            id="home-title"
            initial="hidden"
            transition={{ duration: reduceMotion ? 0 : 0.45, delay: 0.08 }}
            variants={entrance}
          >
            WE BUILD BRANDS.
            <br />
            <span className="text-[#FFD21C]">GROW BUSINESSES...</span>
          </motion.h1>

          <motion.p
            animate="visible"
            className="vip-hero-intro text-base sm:text-lg text-[#A1A1AA] max-w-xl leading-relaxed mb-8 font-sans"
            initial="hidden"
            transition={{ duration: reduceMotion ? 0 : 0.45, delay: 0.16 }}
            variants={entrance}
          >
            A complete content, social media, and digital growth partner—not just a social media posting agency.
            We guide ambitious businesses through the full content journey:
          </motion.p>

          {/* Full Journey Ribbon */}
          <motion.div
            animate="visible"
            className="mb-8 p-3 rounded-lg bg-[#141414] border border-[#222222] max-w-xl"
            initial="hidden"
            transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0.2 }}
            variants={entrance}
          >
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs font-semibold">
              {JOURNEY_STEPS.map((step, idx) => (
                <span className="inline-flex items-center gap-1.5" key={step}>
                  <span className={idx === 0 || idx === JOURNEY_STEPS.length - 1 ? "text-[#FFD21C] font-bold" : "text-white/80"}>
                    {step}
                  </span>
                  {idx < JOURNEY_STEPS.length - 1 && (
                    <span className="text-[#FFD21C]/60 text-[10px]">→</span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            animate="visible"
            className="vip-hero-actions flex flex-wrap items-center gap-3.5"
            initial="hidden"
            transition={{ duration: reduceMotion ? 0 : 0.45, delay: 0.28 }}
            variants={entrance}
          >
            <Link className="button button-gold group" to="/contact">
              Start a Project
              <ArrowUpRight
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                size={16}
              />
            </Link>
            <Link className="button button-outline" to="/work">
              Explore Our Work
            </Link>
            {whatsAppHref && (
              <a
                className="button button-outline inline-flex items-center gap-1.5 text-xs font-mono"
                href={whatsAppHref}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle size={15} /> Fast WhatsApp
              </a>
            )}
          </motion.div>

          {/* Technical Specs Strip */}
          <motion.div
            animate="visible"
            className="mt-8 pt-6 border-t border-[#1E1E1E] flex flex-wrap items-center gap-2 text-xs font-mono text-[#71717A]"
            initial="hidden"
            transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0.36 }}
            variants={entrance}
          >
            <span className="flex items-center gap-1.5 bg-[#121212] px-2.5 py-1 rounded border border-[#222222]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD21C]" />
              4K CINEMA DCI
            </span>
            <span className="bg-[#121212] px-2.5 py-1 rounded border border-[#222222]">
              9:16 VERTICAL REELS
            </span>
            <span className="bg-[#121212] px-2.5 py-1 rounded border border-[#222222]">
              DAVINCI COLOR RESOLVE
            </span>
            <span className="bg-[#121212] px-2.5 py-1 rounded border border-[#222222]">
              FULL-FUNNEL GROWTH
            </span>
          </motion.div>
        </div>

        {/* Right Column: Studio Monitor Showreel */}
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="vip-hero-stage"
          initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.2 }}
        >
          <div className="studio-monitor-frame bg-[#141414] text-white rounded-2xl p-3.5 sm:p-5 shadow-2xl border border-[#222222] relative overflow-hidden">
            {/* Monitor Top Bar */}
            <div className="flex items-center justify-between pb-3 mb-2.5 border-b border-white/10 text-[11px] font-mono">
              <div className="flex items-center gap-2">
                <RecIndicator />
                <span className="text-white/60 hidden sm:inline">VIP STUDIOS // SUITE-01</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <AspectPill
                  aspect={activeProject?.category === "Reels" ? "9:16" : "16:9"}
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
              className="relative aspect-[16/10] sm:aspect-[16/9] rounded-lg overflow-hidden bg-black group cursor-pointer border border-white/5"
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
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                height="900"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src = activeFallback;
                }}
                src={activeProject?.image || activeFallback}
                style={{ objectPosition: activeProject?.imagePosition || "center" }}
                width="1400"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 z-10 pointer-events-none" />

              <ViewfinderCorners color="rgba(255, 255, 255, 0.75)" />

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] z-20">
                <div className="w-14 h-14 rounded-full bg-[#FFD21C] text-[#0A0A0A] flex items-center justify-center shadow-[0_0_25px_rgba(255,210,28,0.6)] transform scale-90 group-hover:scale-100 transition-transform">
                  <Play className="ml-1 fill-current" size={20} />
                </div>
              </div>

              {/* Bottom Screen Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
                <div className="bg-black/80 px-3 py-1.5 rounded border border-white/10 shadow-sm">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-[#FFD21C] font-bold m-0">
                    {activeProject?.category}
                  </p>
                  <h2 className="text-sm font-bold text-white m-0 tracking-tight">
                    {activeProject?.title}
                  </h2>
                </div>
                <button
                  aria-label={`Open cut for ${activeProject?.title}`}
                  className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FFD21C] hover:bg-[#E5BC10] text-[#0A0A0A] text-xs font-bold font-mono shadow-md transition-transform hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeProject?.externalUrl) {
                      window.open(activeProject.externalUrl, "_blank", "noopener,noreferrer");
                    } else {
                      setCinemaModalProject(activeProject);
                    }
                  }}
                  type="button"
                >
                  <Play className="fill-current" size={11} />
                  <span>WATCH CUT</span>
                </button>
              </div>
            </div>

            {/* Switcher Timeline Deck */}
            <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {heroProjects.map((project, idx) => (
                  <button
                    aria-pressed={activeProjectIndex === idx}
                    className={`px-3 py-1 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      activeProjectIndex === idx
                        ? "bg-[#FFD21C] text-[#0A0A0A] shadow-sm font-black"
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
                <Volume2 className={isPlayingAudio ? "text-[#FFD21C]" : "text-white/40"} size={13} />
                <AudioEqualizer isPlaying={isPlayingAudio} />
                <span className="hidden sm:inline text-[10px] text-white/50">48kHz DCI</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Down Scroll Anchor */}
        <a className="vip-scroll-cue font-mono text-[#A1A1AA] hover:text-[#FFD21C] transition-colors" href="#stats">
          <span>EXPLORE ECOSYSTEM</span>
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
