import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowUpRight, ExternalLink, Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import {
  getDirectVideoUrl,
  getInstagramReelId,
  getInstagramUrl,
  getMediaPlatformLabel,
  getSafeExternalUrl,
  getYouTubeId,
  getYouTubeThumbnail,
  isYouTubeShort,
} from "../data/media.js";
import { getFallbackImage } from "../data/fallbackImages.js";
import usePublishedProjects from "../hooks/usePublishedProjects.js";
import { AspectPill, RecIndicator, TimecodeBadge, ViewfinderCorners } from "../components/StudioGraphics.jsx";

export default function ProjectPage() {
  const { slug } = useParams();
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { projects, isLoading, error } = usePublishedProjects();
  const project = projects.find((item) => item.slug === slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div aria-live="polite" className="studio-route-loading py-32 text-center font-mono text-sm text-[#A1A1AA]">
          <span className="inline-block animate-spin mr-2">●</span> Loading project reel…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
        <div className="studio-content-error max-w-xl mx-auto my-20 p-8 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-center font-mono text-sm" role="alert">
          Project reel could not be loaded. Please return to{" "}
          <Link className="underline font-bold text-[#FFD21C]" to="/work">all work</Link> or{" "}
          <Link className="underline font-bold text-[#FFD21C]" to="/contact">start a conversation</Link>.
        </div>
      </div>
    );
  }

  if (!project) return <NotFoundPage />;

  const fallback = getFallbackImage(project.slug);
  const youtubeId = getYouTubeId(project.videoUrl);
  const isShort = isYouTubeShort(project.videoUrl);
  const instagramReelId = getInstagramReelId(project.videoUrl);
  const directVideoUrl = getDirectVideoUrl(project.videoUrl);
  const instagramUrl = getInstagramUrl(project.videoUrl);
  const externalMediaUrl = getSafeExternalUrl(project.videoUrl);
  const hasPlayableMedia = Boolean(youtubeId || instagramReelId || directVideoUrl);
  const mediaPoster = project.image || (youtubeId ? getYouTubeThumbnail(project.videoUrl) : fallback);
  const hasImage = Boolean(mediaPoster);
  const mediaAlt = project.imageAlt || `${project.title} project still`;

  const relatedProjects = projects
    .filter((item) => item.slug !== project.slug && item.category === project.category)
    .slice(0, 3);
  const relatedFallback =
    relatedProjects.length > 0
      ? relatedProjects
      : projects.filter((item) => item.slug !== project.slug).slice(0, 3);

  const isVertical = isShort || Boolean(instagramReelId) || project.category === "Reels & Short-form";

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <motion.article
        animate={{ opacity: 1, y: 0 }}
        className="project-detail studio-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
      >
        {/* Back to Work Nav */}
        <Link className="project-detail-back group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#A1A1AA] hover:text-[#FFD21C] transition-colors mb-6" to="/work">
          <ArrowLeft aria-hidden="true" className="transition-transform group-hover:-translate-x-1" size={15} />
          <span>Return to Work Board</span>
        </Link>

        {/* Film Slate Meta Bar */}
        <div className="border border-[#222222] bg-[#141414] rounded-xl p-4 sm:p-5 mb-8 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#222222] pb-3 mb-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <RecIndicator />
              <span className="font-bold text-white">
                SLATE // {project.slug.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AspectPill aspect={isVertical ? "9:16 VERTICAL" : "16:9 DCI"} resolution="4K" />
              <TimecodeBadge timecode="00:01:24:18" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-bold text-[#FFD21C] uppercase tracking-widest block mb-1">
                {project.category} · {getMediaPlatformLabel(project.platform)}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight m-0 font-display">
                {project.title}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {project.clientName && (
                <span className="font-mono text-xs bg-[#1C1C1C] text-[#FFD21C] px-3 py-1 rounded-full border border-[#FFD21C]/30 font-bold">
                  CLIENT: {project.clientName}
                </span>
              )}
              <span className="font-mono text-xs bg-[#222222] text-white px-3 py-1 rounded-full font-bold">
                {project.format || "COMMERCIAL CUT"}
              </span>
            </div>
          </div>
        </div>

        {/* Main Cinema Viewport Presentation */}
        {(hasImage || hasPlayableMedia) && (
          <section aria-label="Project media presentation" className="relative my-8 rounded-2xl overflow-hidden bg-[#121212] shadow-2xl border border-[#222222]">
            {isMediaOpen && youtubeId ? (
              <div className={`w-full flex items-center justify-center ${isVertical ? "max-w-md mx-auto aspect-[9/16] p-4" : "aspect-[16/9]"}`}>
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-none rounded-xl shadow-2xl"
                  loading="lazy"
                  src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0`}
                  title={`${project.title} on YouTube`}
                />
              </div>
            ) : isMediaOpen && instagramReelId ? (
              <div className="w-full max-w-sm mx-auto aspect-[9/16] p-4 flex items-center justify-center">
                <iframe
                  allow="encrypted-media"
                  allowTransparency
                  className="w-full h-full border-0 rounded-xl bg-black shadow-2xl"
                  loading="lazy"
                  src={`https://www.instagram.com/reel/${instagramReelId}/embed/`}
                  title={`${project.title} on Instagram`}
                />
              </div>
            ) : isMediaOpen && directVideoUrl ? (
              <div className="aspect-[16/9] w-full flex items-center justify-center bg-black">
                <video
                  autoPlay
                  className="w-full h-full object-contain"
                  controls
                  playsInline
                  poster={project.image}
                  preload="metadata"
                >
                  <source src={directVideoUrl} />
                  Your browser does not support this video format.
                </video>
              </div>
            ) : hasImage ? (
              <div className={`relative ${isVertical ? "max-w-md mx-auto aspect-[9/16]" : "aspect-[16/9]"} w-full group overflow-hidden`}>
                <img
                  alt={mediaAlt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  height="1000"
                  onError={(e) => {
                    e.currentTarget.src = fallback;
                  }}
                  src={mediaPoster}
                  style={{ objectPosition: project.imagePosition }}
                  width="1800"
                />
                <ViewfinderCorners color="#FFD21C" />

                {hasPlayableMedia ? (
                  <button
                    aria-label={`Play master cut for ${project.title}`}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/25 transition-all cursor-pointer group"
                    onClick={() => setIsMediaOpen(true)}
                    type="button"
                  >
                    <span className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#FFD21C] hover:bg-[#E5BC10] text-[#0A0A0A] font-mono text-sm font-bold shadow-[0_0_30px_rgba(255,210,28,0.5)] transform transition-transform group-hover:scale-110">
                      <Play fill="currentColor" size={18} />
                      <span>PLAY MASTER REEL</span>
                    </span>
                  </button>
                ) : (
                  <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
                    <span className="font-mono text-xs px-3 py-1 rounded bg-black/85 text-white/90 backdrop-blur-sm border border-white/10">
                      MASTER FRAME CAPTURE // 4K STILL
                    </span>
                  </div>
                )}
              </div>
            ) : null}

            {(instagramUrl || (externalMediaUrl && !hasPlayableMedia)) && (
              <div className="p-3 bg-black/80 border-t border-[#222222] flex justify-end">
                {instagramUrl ? (
                  <a
                    className="font-mono text-xs text-white/80 hover:text-[#FFD21C] inline-flex items-center gap-1.5 transition-colors"
                    href={instagramUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span>View Original Post on Instagram</span>
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <a
                    className="font-mono text-xs text-white/80 hover:text-[#FFD21C] inline-flex items-center gap-1.5 transition-colors"
                    href={externalMediaUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span>Open External Media Source</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            )}
          </section>
        )}

        {/* Two-Column Editorial Brief */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 my-16 py-12 border-y border-[#1E1E1E]">
          <div className="lg:col-span-7">
            <span className="font-mono text-xs font-bold text-[#FFD21C] uppercase tracking-widest block mb-2">
              // NARRATIVE &amp; EDITORIAL CONTEXT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 font-display">
              The Creative Brief
            </h2>
            <p className="text-base text-[#A1A1AA] leading-relaxed mb-6 font-sans">
              {project.summary ||
                "A high-impact video edit highlighting deliberate pacing, visual rhythm, and focused narrative tension."}
            </p>

            {project.approach && (
              <div className="mt-8 p-6 rounded-xl bg-[#141414] border border-[#222222]">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFD21C] mb-2">
                  DIRECTOR&apos;S CUT APPROACH
                </h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed m-0 font-sans">{project.approach}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-widest block mb-2">
              // SPECIFICATION SHEET
            </span>

            <div className="p-5 rounded-xl bg-[#141414] border border-[#222222] shadow-sm">
              <span className="font-mono text-[11px] text-[#71717A] uppercase block mb-1">
                Editorial Role
              </span>
              <strong className="text-base text-white font-display">
                {project.role || "Lead Editor & Sound Designer"}
              </strong>
            </div>

            <div className="p-5 rounded-xl bg-[#141414] border border-[#222222] shadow-sm">
              <span className="font-mono text-[11px] text-[#71717A] uppercase block mb-1">
                Pipeline Deliverables
              </span>
              <strong className="text-base text-white font-display">
                {project.result || "4K Master, 9:16 Social Cutdowns, Stills"}
              </strong>
            </div>

            <div className="p-5 rounded-xl bg-[#181818] border border-[#2A2A2A] text-white">
              <span className="font-mono text-[11px] text-[#FFD21C] uppercase block mb-1">
                Color &amp; Sound Standard
              </span>
              <strong className="text-sm font-mono block text-white/90">
                DaVinci Resolve Rec.709 // Dolby EBU R128 (-14 LUFS)
              </strong>
            </div>
          </div>
        </section>

        {/* Related Studio Cuts */}
        {relatedFallback.length > 0 && (
          <section aria-labelledby="related-title" className="my-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-mono text-xs font-bold text-[#FFD21C] uppercase tracking-widest block mb-1">
                  // MORE IN THIS FORMAT
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white m-0 font-display" id="related-title">
                  Related Studio Cuts
                </h2>
              </div>
              <Link className="vip-inline-link font-mono text-xs font-bold uppercase text-[#FFD21C] hover:underline" to="/work">
                View All Work <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedFallback.map((item, index) => (
                <ProjectCard index={index} key={item.slug} project={item} />
              ))}
            </div>
          </section>
        )}

        {/* CTA Box */}
        <div className="my-16 p-8 sm:p-12 rounded-2xl bg-[#141414] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl border border-[#222222]">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFD21C] block mb-2">
              // START A SIMILAR PROJECT
            </span>
            <h2 className="text-3xl font-black text-white m-0 mb-2 font-display">
              Ready to shape a cut like {project.title}?
            </h2>
            <p className="text-sm text-[#A1A1AA] max-w-lg m-0 font-sans">
              Let&apos;s talk about your raw footage, timeline, and narrative goals.
            </p>
          </div>
          <Link
            className="button button-gold shrink-0 py-3.5 px-8 font-mono text-xs font-bold uppercase tracking-wider"
            to={`/contact?service=${encodeURIComponent(project.category)}&project=${encodeURIComponent(project.title)}`}
          >
            Start Similar Project <ArrowUpRight size={16} />
          </Link>
        </div>
      </motion.article>
    </div>
  );
}
