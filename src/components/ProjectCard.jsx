import { ArrowUpRight, Play, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { getDirectVideoUrl, getMediaPlatformLabel } from "../data/media.js";
import { AspectPill, AudioEqualizer, TimecodeBadge, ViewfinderCorners } from "./StudioGraphics.jsx";

export default function ProjectCard({ project, index = 0, variant = "auto" }) {
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

  return (
    <article
      className={`project-card ${isFeatured ? "is-featured-card" : ""} ${isVertical ? "is-vertical-card" : ""}`}
    >
      <Link
        aria-label={`View ${project.title}${project.concept ? ", a concept project" : ""}`}
        className="project-link"
        onMouseEnter={startPreview}
        onMouseLeave={stopPreview}
        to={`/work/${project.slug}`}
      >
        <div
          className={`project-image ${isVertical ? "aspect-[9/16] max-h-[580px]" : "aspect-[16/10]"} ${
            project.image ? `image-tone-${project.accent}` : "project-image-empty"
          }`}
        >
          {project.image ? (
            <>
              <img
                alt={project.imageAlt}
                className={isPreviewing ? "is-preview-hidden opacity-0" : "opacity-100"}
                height="900"
                loading="lazy"
                src={project.image}
                style={{ objectPosition: project.imagePosition }}
                width="1400"
              />
              {directVideoUrl && (
                <video
                  aria-hidden="true"
                  className={`project-video-preview ${isPreviewing ? "is-visible opacity-100" : "opacity-0"}`}
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
          <ViewfinderCorners color="rgba(255, 255, 255, 0.75)" />

          {/* Top Overlays */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-black/75 text-white/90 border border-white/10 backdrop-blur-sm">
                CUT {String(index + 1).padStart(2, "0")}
              </span>
              <AspectPill aspect={aspectLabel} resolution="4K" />
            </div>
            {project.featured && (
              <span className="font-mono text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFD76A] text-[#553E00] shadow-sm">
                FEATURED
              </span>
            )}
          </div>

          {/* Bottom Overlays */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
            <TimecodeBadge timecode={timecode} />
            <div className="flex items-center gap-1.5">
              {isPreviewing && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/75 text-[#B9F4D0] border border-[#B9F4D0]/30 text-[10px] font-mono">
                  <Volume2 size={11} />
                  <AudioEqualizer isPlaying />
                </span>
              )}
              {project.videoUrl && (
                <span
                  aria-hidden="true"
                  className="w-7 h-7 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm"
                >
                  <Play fill="currentColor" size={11} />
                </span>
              )}
              <span
                aria-hidden="true"
                className="w-7 h-7 rounded-full bg-white/95 text-[#19162B] flex items-center justify-center shadow-md transform transition-transform group-hover:scale-110"
              >
                <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </div>

        <div className="project-caption">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="project-label m-0">
                {project.category} · {getMediaPlatformLabel(project.platform)}
              </p>
            </div>
            <h3>{project.title}</h3>
            {project.clientName && <p className="project-client">{project.clientName}</p>}
          </div>
          <span className="project-format">{project.format}</span>
        </div>
        {project.concept && !project.videoUrl && (
          <p className="project-concept-label">Curated concept study · Authentic studio direction</p>
        )}
      </Link>
    </article>
  );
}
