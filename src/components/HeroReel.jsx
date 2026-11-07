import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, MessageCircle, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { projects as fallbackProjects } from "../data/projects.js";
import { getFallbackImage } from "../data/fallbackImages.js";
import { getWhatsAppHref } from "../data/contact.js";
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
  const [cinemaModalProject, setCinemaModalProject] = useState(null);
  const whatsAppHref = getWhatsAppHref(
    "Hi VIP StudioS, I'm looking for a complete content and digital growth partner."
  );

  const activeProject = heroProjects[activeProjectIndex] || heroProjects[0] || fallbackProjects[0];
  const activeFallback = getFallbackImage(activeProject?.slug);

  const entrance = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <section aria-labelledby="home-title" className="vip-hero relative bg-[#0A0A0A] text-white">
        <div className="vip-hero-copy">
          <motion.h1
            animate="visible"
            className="vip-hero-headline font-display font-black tracking-tight text-white mb-6 leading-none text-4xl sm:text-6xl lg:text-7xl"
            id="home-title"
            initial="hidden"
            transition={{ duration: reduceMotion ? 0 : 0.45, delay: 0.05 }}
            variants={entrance}
          >
            WE BUILD BRANDS.
            <br />
            <span className="text-[#FFD21C]">GROW BUSINESSES...</span>
          </motion.h1>

          <motion.p
            animate="visible"
            className="vip-hero-intro text-base sm:text-lg text-[#A1A1AA] max-w-xl leading-relaxed mb-6 font-sans"
            initial="hidden"
            transition={{ duration: reduceMotion ? 0 : 0.45, delay: 0.12 }}
            variants={entrance}
          >
            A complete content, social media, and digital growth partner. We guide ambitious businesses through the full content journey:
          </motion.p>

          {/* Full Journey Ribbon Container */}
          <motion.div
            animate="visible"
            className="mb-8 p-3.5 rounded-xl bg-[#141414] border border-[#222222] max-w-xl shadow-sm"
            initial="hidden"
            transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0.18 }}
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
            transition={{ duration: reduceMotion ? 0 : 0.45, delay: 0.24 }}
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
        </div>

        {/* Right Column: Clean & Modern Video Showcase Container */}
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="vip-hero-stage w-full"
          initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.15 }}
        >
          <div className="bg-[#141414] text-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-[#222222] relative overflow-hidden">
            {/* Viewport Video Window */}
            <div
              className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black group cursor-pointer border border-white/10"
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

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 z-10 pointer-events-none" />

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-90 group-hover:opacity-100 transition-opacity z-20">
                <div className="w-14 h-14 rounded-full bg-[#FFD21C] text-[#0A0A0A] flex items-center justify-center shadow-[0_0_24px_rgba(255,210,28,0.5)] transform transition-transform group-hover:scale-110">
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

            {/* Simple Cut Switcher Bar */}
            <div className="mt-3 pt-3 border-t border-[#222222] flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-[#A1A1AA] uppercase">
                Featured Cuts:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                {heroProjects.map((project, idx) => (
                  <button
                    aria-pressed={activeProjectIndex === idx}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeProjectIndex === idx
                        ? "bg-[#FFD21C] text-[#0A0A0A] shadow-sm font-black"
                        : "bg-[#1C1C1C] text-[#A1A1AA] hover:text-white hover:bg-[#252525]"
                    }`}
                    key={project.slug || idx}
                    onClick={() => setActiveProjectIndex(idx)}
                    type="button"
                  >
                    Cut 0{idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
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
