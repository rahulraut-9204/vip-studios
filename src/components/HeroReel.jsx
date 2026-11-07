import { useState } from "react";
import { ArrowUpRight, Play, Sparkles, Video, Instagram, Youtube, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { projects as fallbackProjects } from "../data/projects.js";
import { getFallbackImage } from "../data/fallbackImages.js";
import CinemaModal from "./CinemaModal.jsx";

const TRUST_TAGS = [
  "Creative Strategy",
  "Social Media Management",
  "Content Production",
];

const CLIENT_PREVIEWS = [
  "CINEWAVE STUDIOS",
  "PULSE APPAREL",
  "APEX MEDIA",
  "FOUNDER PERSPECTIVES",
  "VELOCITY GLOBAL",
  "KALA COLLECTIVE",
];

export default function HeroReel({ projects: customProjects }) {
  const availableProjects = customProjects && customProjects.length > 0 ? customProjects : fallbackProjects;
  const heroProjects = availableProjects.filter((p) => p.image).slice(0, 4);

  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [cinemaModalProject, setCinemaModalProject] = useState(null);

  const activeProject = heroProjects[activeProjectIndex] || heroProjects[0] || fallbackProjects[0];
  const activeFallback = getFallbackImage(activeProject?.slug);

  return (
    <>
      <section aria-labelledby="hero-headline" className="relative bg-[#0A0A0A] text-white overflow-hidden pt-32 pb-20">
        {/* Subtle Brand Accent Glow */}
        <div
          aria-hidden="true"
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[480px] bg-gradient-to-br from-[#FFD21C]/15 via-[#FFD21C]/5 to-transparent blur-3xl pointer-events-none rounded-full"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Core Positioning & CTAs */}
            <div className="lg:col-span-7">
              {/* Trust Statement */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#2A2A2A] text-xs font-mono text-[#CCCCCC] mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C] animate-pulse" />
                <span className="text-white/90 font-bold">
                  {TRUST_TAGS.join(" | ")}
                </span>
              </div>

              {/* Main Headline */}
              <h1
                id="hero-headline"
                className="font-display font-black tracking-tight text-white mb-4 leading-none text-4xl sm:text-6xl lg:text-7xl"
              >
                Your Brand Deserves <br />
                <span className="text-[#FFD21C] drop-shadow-[0_0_35px_rgba(255,210,28,0.3)]">
                  More Than Just Posting.
                </span>
              </h1>

              {/* Alternative Tagline */}
              <p className="font-display font-bold text-lg sm:text-xl text-white/90 mb-4 tracking-tight">
                We Create Content. We Manage Brands. We Build Digital Presence.
              </p>

              {/* Supporting Content */}
              <p className="text-base sm:text-lg text-[#A1A1AA] max-w-2xl leading-relaxed mb-8 font-sans">
                From social media strategy and content creation to professional video production and page management, VIP StudioS helps businesses build a consistent and engaging digital presence.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <a
                  href="#enquiry"
                  className="button button-gold py-4 px-8 text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-[0_0_25px_rgba(255,210,28,0.35)] hover:scale-105 transition-all"
                >
                  <Sparkles size={15} />
                  <span>Start Your Project</span>
                  <ArrowUpRight size={16} />
                </a>

                <a
                  href="#work"
                  className="button button-outline py-4 px-7 text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:border-[#FFD21C] hover:text-white"
                >
                  <Play size={13} className="fill-current text-[#FFD21C]" />
                  <span>Explore Our Work</span>
                </a>
              </div>

              {/* Floating Social Media & Deliverable Badges */}
              <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] text-[#A1A1AA]">
                <span className="px-2.5 py-1 rounded bg-[#141414] border border-white/5 flex items-center gap-1.5">
                  <Instagram size={12} className="text-[#FFD21C]" /> Reels &amp; Carousels
                </span>
                <span className="px-2.5 py-1 rounded bg-[#141414] border border-white/5 flex items-center gap-1.5">
                  <Video size={12} className="text-[#FFD21C]" /> Video Shoots &amp; Editing
                </span>
                <span className="px-2.5 py-1 rounded bg-[#141414] border border-white/5 flex items-center gap-1.5">
                  <Youtube size={12} className="text-[#FFD21C]" /> YouTube Management
                </span>
                <span className="px-2.5 py-1 rounded bg-[#141414] border border-white/5 flex items-center gap-1.5">
                  <CheckCircle size={12} className="text-[#FFD21C]" /> Page Management
                </span>
              </div>
            </div>

            {/* Right Column: Animated Content Collage & Reel Showcase */}
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

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-90 group-hover:opacity-100 transition-opacity z-20">
                    <div className="w-14 h-14 rounded-full bg-[#FFD21C] text-[#0A0A0A] flex items-center justify-center shadow-[0_0_25px_rgba(255,210,28,0.6)] transform transition-transform group-hover:scale-110">
                      <Play className="ml-1 fill-current" size={22} />
                    </div>
                  </div>

                  {/* Bottom Bar */}
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
                      <span>PREVIEW</span>
                    </span>
                  </div>
                </div>

                {/* Cut Switcher Tabs */}
                <div className="mt-3 pt-3 border-t border-[#222222] flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-[#A1A1AA] uppercase">
                    Client Work:
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
                        Sample 0{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Strip Beneath Hero */}
        <div className="mt-16 pt-8 border-t border-[#1E1E1E] overflow-hidden">
          <p className="text-center font-mono text-[11px] uppercase tracking-widest text-[#71717A] mb-4">
            HELPING BRANDS &amp; CREATORS BUILD THEIR DIGITAL PRESENCE
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 font-mono text-xs font-bold text-[#A1A1AA]">
            {CLIENT_PREVIEWS.map((name, i) => (
              <span key={i} className="hover:text-white transition-colors">
                {name}
              </span>
            ))}
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
