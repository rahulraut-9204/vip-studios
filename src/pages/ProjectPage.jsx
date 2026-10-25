import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowUpRight, ExternalLink, Play, Sparkles, Volume2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import {
  getDirectVideoUrl,
  getInstagramUrl,
  getMediaPlatformLabel,
  getSafeExternalUrl,
  getYouTubeId,
  getYouTubeThumbnail,
} from "../data/media.js";
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
      <div aria-live="polite" className="studio-route-loading py-32 text-center font-mono">
        Loading project reel…
      </div>
    );
  }

  if (error) {
    return (
      <div className="studio-content-error max-w-xl mx-auto my-20 p-8 rounded-xl bg-red-50 text-red-700 text-center" role="alert">
        Project reel could not be loaded. Please return to{" "}
        <Link className="underline font-bold" to="/work">all work</Link> or{" "}
        <Link className="underline font-bold" to="/contact">start a conversation</Link>.
      </div>
    );
  }

  if (!project) return <NotFoundPage />;

  const youtubeId = getYouTubeId(project.videoUrl);
  const directVideoUrl = getDirectVideoUrl(project.videoUrl);
  const instagramUrl = getInstagramUrl(project.videoUrl);
  const externalMediaUrl = getSafeExternalUrl(project.videoUrl);
  const hasPlayableMedia = Boolean(youtubeId || directVideoUrl);
  const mediaPoster = project.image || (youtubeId ? getYouTubeThumbnail(project.videoUrl) : "");
  const hasImage = Boolean(mediaPoster);
  const mediaAlt = project.imageAlt || `${project.title} project still`;

  const relatedProjects = projects
    .filter((item) => item.slug !== project.slug && item.category === project.category)
    .slice(0, 3);
  const relatedFallback =
    relatedProjects.length > 0
      ? relatedProjects
      : projects.filter((item) => item.slug !== project.slug).slice(0, 3);

  const isVertical = project.category === "Reels & Short-form";

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="project-detail studio-page"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
    >
      {/* Back to Work Nav */}
      <Link className="project-detail-back group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#6E6A7C] hover:text-[#19162B] transition-colors mb-6" to="/work">
        <ArrowLeft aria-hidden="true" className="transition-transform group-hover:-translate-x-1" size={15} />
        <span>Return to Work Board</span>
      </Link>

      {/* Film Slate Meta Bar */}
      <div className="border border-[#EAE6E0] bg-[#FFFDF8] rounded-xl p-4 sm:p-5 mb-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAE6E0] pb-3 mb-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <RecIndicator />
            <span className="font-bold text-[#19162B]">
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
            <span className="font-mono text-xs font-bold text-[#FF6542] uppercase tracking-widest block mb-1">
              {project.category} · {getMediaPlatformLabel(project.platform)}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#19162B] tracking-tight m-0">
              {project.title}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {project.clientName && (
              <span className="font-mono text-xs bg-[#F4F1FF] text-[#7765F8] px-3 py-1 rounded-full font-bold">
                CLIENT: {project.clientName}
              </span>
            )}
            <span className="font-mono text-xs bg-black text-white px-3 py-1 rounded-full font-bold">
              {project.format || "COMMERCIAL CUT"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Cinema Viewport Presentation */}
      {(hasImage || hasPlayableMedia) && (
        <section aria-label="Project media presentation" className="relative my-8 rounded-2xl overflow-hidden bg-[#19162B] shadow-2xl border border-[#27213D]">
          {isMediaOpen && youtubeId ? (
            <div className="aspect-[16/9] w-full">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-none"
                loading="lazy"
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0`}
                title={`${project.title} on YouTube`}
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
                src={mediaPoster}
                style={{ objectPosition: project.imagePosition }}
                width="1800"
              />
              <ViewfinderCorners color="#FFFDF8" />

              {hasPlayableMedia ? (
                <button
                  aria-label={`Play master cut for ${project.title}`}
                  className="absolute inset-0 flex items-center justify-center bg-black/35 hover:bg-black/20 transition-all cursor-pointer group"
                  onClick={() => setIsMediaOpen(true)}
                  type="button"
                >
                  <span className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#FF6542] hover:bg-[#E85331] text-white font-mono text-sm font-bold shadow-2xl transform transition-transform group-hover:scale-110">
                    <Play fill="currentColor" size={18} />
                    <span>PLAY MASTER REEL</span>
                  </span>
                </button>
              ) : (
                <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
                  <span className="font-mono text-xs px-3 py-1 rounded bg-black/75 text-white/90 backdrop-blur-sm border border-white/10">
                    MASTER FRAME CAPTURE // 4K STILL
                  </span>
                </div>
              )}
            </div>
          ) : null}

          {(instagramUrl || (externalMediaUrl && !hasPlayableMedia)) && (
            <div className="p-3 bg-black/60 border-t border-white/10 flex justify-end">
              {instagramUrl ? (
                <a
                  className="font-mono text-xs text-white/80 hover:text-[#FF6542] inline-flex items-center gap-1.5 transition-colors"
                  href={instagramUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span>View Original Post on Instagram</span>
                  <ExternalLink size={12} />
                </a>
              ) : (
                <a
                  className="font-mono text-xs text-white/80 hover:text-[#FF6542] inline-flex items-center gap-1.5 transition-colors"
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
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 my-16 py-12 border-y border-[#EAE6E0]">
        <div className="lg:col-span-7">
          <span className="font-mono text-xs font-bold text-[#FF6542] uppercase tracking-widest block mb-2">
            // NARRATIVE &amp; EDITORIAL CONTEXT
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#19162B] mb-4">
            The Creative Brief
          </h2>
          <p className="text-base text-[#6E6A7C] leading-relaxed mb-6">
            {project.summary ||
              "An illustrative video editing study highlighting deliberate pacing, visual rhythm, and focused narrative tension."}
          </p>

          {project.approach && (
            <div className="mt-8 p-6 rounded-xl bg-[#F4F1FF] border border-[#7765F8]/15">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#7765F8] mb-2">
                DIRECTOR&apos;S CUT APPROACH
              </h3>
              <p className="text-sm text-[#19162B] leading-relaxed m-0">{project.approach}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4">
          <span className="font-mono text-xs font-bold text-[#19162B] uppercase tracking-widest block mb-2">
            // SPECIFICATION SHEET
          </span>

          <div className="p-5 rounded-xl bg-white border border-[#EAE6E0] shadow-sm">
            <span className="font-mono text-[11px] text-[#6E6A7C] uppercase block mb-1">
              Editorial Role
            </span>
            <strong className="text-base text-[#19162B]">
              {project.role || "Lead Editor & Sound Designer"}
            </strong>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#EAE6E0] shadow-sm">
            <span className="font-mono text-[11px] text-[#6E6A7C] uppercase block mb-1">
              Pipeline Deliverables
            </span>
            <strong className="text-base text-[#19162B]">
              {project.result || "4K Master, 9:16 Social Cutdowns, Stills"}
            </strong>
          </div>

          <div className="p-5 rounded-xl bg-[#19162B] text-white">
            <span className="font-mono text-[11px] text-[#B9F4D0] uppercase block mb-1">
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
              <span className="font-mono text-xs font-bold text-[#7765F8] uppercase tracking-widest block mb-1">
                // MORE IN THIS FORMAT
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#19162B] m-0" id="related-title">
                Related Studio Cuts
              </h2>
            </div>
            <Link className="vip-inline-link font-mono text-xs font-bold uppercase" to="/work">
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
      <div className="my-16 p-8 sm:p-12 rounded-2xl bg-[#19162B] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF6542] block mb-2">
            // COMMISSION A SIMILAR CUT
          </span>
          <h2 className="text-3xl font-black text-white m-0 mb-2">
            Ready to shape a cut like {project.title}?
          </h2>
          <p className="text-sm text-white/70 max-w-lg m-0">
            Let&apos;s talk about your raw footage, timeline, and narrative goals.
          </p>
        </div>
        <Link
          className="button button-gold shrink-0 py-3.5 px-7"
          to={`/contact?service=${encodeURIComponent(project.category)}`}
        >
          Commission This Cut <ArrowUpRight size={16} />
        </Link>
      </div>
    </motion.article>
  );
}
