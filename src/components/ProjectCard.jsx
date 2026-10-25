import { ArrowUpRight, Play, Volume2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { getDirectVideoUrl, getMediaPlatformLabel } from "../data/media.js";
import { AspectPill, AudioEqualizer, TimecodeBadge, ViewfinderCorners } from "./StudioGraphics.jsx";

export default function ProjectCard({ project, index = 0, variant = "auto", onPreviewCut }) {
  const videoRef = useRef(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const directVideoUrl = getDirectVideoUrl(project.videoUrl);

  const isVertical = variant === "vertical" || (variant === "auto" && project.category === "Reels & Short-form");
  const isFeatured = variant === "featured" || project.featured;

  const aspectLabel = isVertical ? "9:16" : "16:9";
  const dummyTimecodes = ["00:00:45:12", "00:01:12:04", "00:03:20:18", "00:00:30:00", "00:02:15:22"];
  const timecode = dummyTimecodes[index % dummyTimecodes.length];

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

  return (
    <article
      className={`project-card group ${isFeatured ? "is-featured-card" : ""} ${isVertical ? "is-vertical-card" : ""}`}
    >
      <Link
        aria-label={`View ${project.title}${project.concept ? ", a concept project" : ""}`}
        className="project-link"
        onMouseEnter={startPreview}
        onMouseLeave={stopPreview}
        to={`/work/${project.slug}`}
      >
        <div
          className={`project-image relative overflow-hidden rounded-2xl ${
            isVertical ? "aspect-[9/16] max-h-[580px]" : "aspect-[16/10]"
          } ${project.image ? `image-tone-${project.accent}` : "project-image-empty"}`}
        >
          {project.image ? (
            <>
              <img
                alt={project.imageAlt || project.title}
                className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                  isPreviewing ? "is-preview-hidden opacity-0" : "opacity-100"
                }`}
                height="900"
                loading="lazy"
                src={project.image}
                style={{ objectPosition: project.imagePosition || "center" }}
                width="1400"
              />
              {directVideoUrl && (
                <video
                  aria-hidden="true"
                  className={`project-video-preview absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    isPreviewing ? "is-visible opacity-100" : "opacity-0"
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
          ) : (
            <span className="project-image-empty-copy">
              <strong>{project.title}</strong>
              <small>No preview</small>
            </span>
          )}

          {/* Viewfinder HUD Overlays */}
          <ViewfinderCorners color="rgba(255, 255, 255, 0.85)" />

          {/* Top Overlays */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-black/80 text-white/95 border border-white/15 backdrop-blur-md shadow-sm">
                CUT {String(index + 1).padStart(2, "0")}
              </span>
              <AspectPill aspect={aspectLabel} resolution="4K" />
            </div>
            {project.featured && (
              <span className="font-mono text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFD76A] text-[#4A3700] shadow-[0_2px_8px_rgba(255,215,106,0.5)] border border-[#E8C250]">
                FEATURED
              </span>
            )}
          </div>

          {/* Center Play Button Overlay on Hover */}
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span
              className="w-12 h-12 rounded-full bg-[#FF4D2D] text-white flex items-center justify-center shadow-[0_0_24px_rgba(255,77,45,0.7)] transform scale-90 group-hover:scale-100 transition-transform pointer-events-auto cursor-pointer"
              onClick={handlePreviewClick}
              title="Click to preview cut"
            >
              <Play className="ml-0.5" fill="currentColor" size={18} />
            </span>
          </div>

          {/* Bottom Overlays */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
            <TimecodeBadge timecode={timecode} />
            <div className="flex items-center gap-2">
              {isPreviewing && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/80 text-[#00E599] border border-[#00E599]/30 text-[10px] font-mono backdrop-blur-md shadow-sm">
                  <Volume2 size={11} />
                  <AudioEqualizer isPlaying />
                </span>
              )}

              {/* Quick Play Trigger */}
              <button
                aria-label={`Preview ${project.title}`}
                className="pointer-events-auto w-8 h-8 rounded-full bg-black/80 hover:bg-[#FF4D2D] border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md hover:scale-105"
                onClick={handlePreviewClick}
                title="Preview video cut"
                type="button"
              >
                <Play className="ml-0.5" fill="currentColor" size={12} />
              </button>

              <span
                aria-hidden="true"
                className="w-8 h-8 rounded-full bg-white text-[#12101E] flex items-center justify-center shadow-md transform transition-transform group-hover:scale-110"
              >
                <ArrowUpRight size={15} />
              </span>
            </div>
          </div>
        </div>

        <div className="project-caption mt-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="project-label m-0 font-mono text-[11px] font-bold text-[#FF4D2D] uppercase tracking-wider">
                {project.category} · {getMediaPlatformLabel(project.platform)}
              </p>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-[#12101E] group-hover:text-[#FF4D2D] transition-colors m-0">
              {project.title}
            </h3>
            {project.clientName && (
              <p className="project-client font-mono text-xs text-[#5C586B] mt-0.5">
                Client: {project.clientName}
              </p>
            )}
          </div>
          <span className="project-format font-mono text-xs text-[#5C586B]">{project.format}</span>
        </div>
        {project.concept && !project.videoUrl && (
          <p className="project-concept-label font-mono text-[11px] text-[#8E8A9E] mt-1">
            Curated concept study · Authentic studio direction
          </p>
        )}
      </Link>
    </article>
  );
}
