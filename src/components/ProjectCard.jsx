import { ArrowUpRight, Play, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { getDirectVideoUrl, getMediaPlatformLabel } from "../data/media.js";
import { AspectPill, AudioEqualizer } from "./StudioGraphics.jsx";
import { getFallbackImage } from "../data/fallbackImages.js";

export default function ProjectCard({ project, index = 0, variant = "auto", onPreviewCut }) {
  const videoRef = useRef(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const directVideoUrl = getDirectVideoUrl(project?.videoUrl);

  const fallback = getFallbackImage(project?.slug);
  const [imgSrc, setImgSrc] = useState(project?.image || fallback);

  useEffect(() => {
    setImgSrc(project?.image || fallback);
  }, [project?.image, fallback]);

  const isVertical = variant === "vertical" || project?.category === "Reels";
  const isFeatured = variant === "featured" || project?.featured;
  const aspectLabel = isVertical ? "9:16" : "16:9";

  // Specific requirement: Link "Brand Film Production" to YouTube in a new tab
  const isBrandFilm =
    project?.title?.toLowerCase().includes("brand film production") ||
    project?.slug === "brand-film-production" ||
    Boolean(project?.externalUrl);

  const externalHref =
    project?.externalUrl ||
    (isBrandFilm ? "https://youtu.be/5ey7tP006cg?si=2XUdvaCgFEbLc06C" : null);

  function startPreview() {
    if (!directVideoUrl || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setIsPreviewing(true);
    videoRef.current?.play().catch(() => setIsPreviewing(false));
  }

  function stopPreview() {
    setIsPreviewing(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  function handlePreviewClick(e) {
    if (onPreviewCut) {
      e.preventDefault();
      e.stopPropagation();
      onPreviewCut(project);
    }
  }

  const cardInner = (
    <>
      <div
        className={`project-image relative overflow-hidden rounded-xl aspect-[16/10] bg-[#121212] border border-[#222222] transition-colors group-hover:border-[#FFD21C]/50 ${
          isVertical ? "flex items-center justify-center p-3" : ""
        }`}
      >
        {isVertical ? (
          /* Vertical Reel Frame with Ambient Glow */
          <>
            <img
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-125 pointer-events-none select-none"
              loading="lazy"
              onError={() => setImgSrc(fallback)}
              src={imgSrc}
            />
            <div className="relative h-full aspect-[9/16] rounded-lg overflow-hidden shadow-2xl border border-white/20 z-10">
              <img
                alt={project.imageAlt || project.title}
                className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                  isPreviewing ? "opacity-0" : "opacity-100"
                }`}
                height="900"
                loading="lazy"
                onError={() => setImgSrc(fallback)}
                src={imgSrc}
                style={{ objectPosition: project.imagePosition || "center" }}
                width="506"
              />
              {directVideoUrl && (
                <video
                  aria-hidden="true"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    isPreviewing ? "opacity-100" : "opacity-0"
                  }`}
                  loop
                  muted
                  playsInline
                  preload="none"
                  ref={videoRef}
                  src={directVideoUrl}
                />
              )}
            </div>
          </>
        ) : (
          /* Standard 16:9 / 16:10 Frame */
          <>
            <img
              alt={project.imageAlt || project.title}
              className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                isPreviewing ? "opacity-0" : "opacity-100"
              }`}
              height="900"
              loading="lazy"
              onError={() => setImgSrc(fallback)}
              src={imgSrc}
              style={{ objectPosition: project.imagePosition || "center" }}
              width="1440"
            />
            {directVideoUrl && (
              <video
                aria-hidden="true"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  isPreviewing ? "opacity-100" : "opacity-0"
                }`}
                loop
                muted
                playsInline
                preload="none"
                ref={videoRef}
                src={directVideoUrl}
              />
            )}
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 z-10 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-black/80 text-white border border-white/10 shadow-sm">
              CUT {String(index + 1).padStart(2, "0")}
            </span>
            <AspectPill aspect={aspectLabel} resolution="4K" />
          </div>
          {project.featured && (
            <span className="font-mono text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#FFD21C] text-[#0A0A0A] shadow-sm">
              FEATURED
            </span>
          )}
        </div>

        {/* Center Play Button Overlay on Hover */}
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span
            className="w-12 h-12 rounded-full bg-[#FFD21C] text-[#0A0A0A] flex items-center justify-center shadow-[0_0_24px_rgba(255,210,28,0.5)] transform scale-90 group-hover:scale-100 transition-transform pointer-events-auto cursor-pointer"
            onClick={handlePreviewClick}
            title={externalHref ? "Open video link" : "Preview cut"}
          >
            <Play className="ml-0.5 fill-current" size={18} />
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
          <span className="text-[10px] font-mono text-[#A1A1AA] uppercase tracking-wider px-2 py-0.5 rounded bg-black/70 border border-white/10">
            {project.category}
          </span>
          <div className="flex items-center gap-2">
            {isPreviewing && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/80 text-[#FFD21C] border border-[#FFD21C]/30 text-[10px] font-mono shadow-sm">
                <Volume2 size={11} />
                <AudioEqualizer isPlaying />
              </span>
            )}

            <button
              aria-label={`Preview ${project.title}`}
              className="pointer-events-auto w-8 h-8 rounded-full bg-black/80 hover:bg-[#FFD21C] hover:text-[#0A0A0A] border border-white/20 text-white flex items-center justify-center transition-all shadow-md hover:scale-105"
              onClick={handlePreviewClick}
              title="Preview video"
              type="button"
            >
              <Play className="ml-0.5 fill-current" size={12} />
            </button>

            <span
              aria-hidden="true"
              className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#FFD21C] text-white group-hover:text-[#0A0A0A] flex items-center justify-center border border-white/20 group-hover:border-[#FFD21C] transition-all"
            >
              <ArrowUpRight size={15} />
            </span>
          </div>
        </div>
      </div>

      <div className="project-caption mt-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="project-label m-0 font-mono text-[11px] font-bold text-[#FFD21C] uppercase tracking-wider">
              {project.category} · {getMediaPlatformLabel(project.platform)}
            </p>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-[#FFD21C] transition-colors m-0">
            {project.title}
          </h3>
          {project.clientName && (
            <p className="project-client font-mono text-xs text-[#A1A1AA] mt-0.5">
              Client: {project.clientName}
            </p>
          )}
        </div>
        <span className="project-format font-mono text-xs text-[#71717A]">{project.format}</span>
      </div>
    </>
  );

  return (
    <article
      className={`project-card group ${isFeatured ? "is-featured-card" : ""} ${isVertical ? "is-vertical-card" : ""}`}
    >
      {externalHref ? (
        <a
          aria-label={`View ${project.title} (opens in new tab)`}
          className="project-link block text-inherit no-underline"
          href={externalHref}
          onMouseEnter={startPreview}
          onMouseLeave={stopPreview}
          rel="noopener noreferrer"
          target="_blank"
        >
          {cardInner}
        </a>
      ) : (
        <Link
          aria-label={`View ${project.title}`}
          className="project-link block text-inherit no-underline"
          onMouseEnter={startPreview}
          onMouseLeave={stopPreview}
          to={`/work/${project.slug}`}
        >
          {cardInner}
        </Link>
      )}
    </article>
  );
}
