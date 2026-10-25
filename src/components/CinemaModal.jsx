import { useEffect } from "react";
import { ArrowUpRight, Play, Volume2, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getDirectVideoUrl,
  getInstagramUrl,
  getMediaPlatformLabel,
  getYouTubeId,
} from "../data/media.js";
import { getFallbackImage } from "../data/fallbackImages.js";
import { AspectPill, AudioEqualizer, RecIndicator, TimecodeBadge } from "./StudioGraphics.jsx";

export default function CinemaModal({ project, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const youtubeId = getYouTubeId(project.videoUrl);
  const directVideoUrl = getDirectVideoUrl(project.videoUrl);
  const instagramUrl = getInstagramUrl(project.videoUrl);
  const isVertical = project.category === "Reels & Short-form";
  const fallback = getFallbackImage(project.slug);

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in"
      role="dialog"
    >
      {/* Background click dismiss */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-4xl bg-[#0E0C18] text-[#FFFDF8] rounded-2xl sm:rounded-3xl border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cinema Monitor Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-black/50 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <RecIndicator />
            <span className="hidden sm:inline font-bold text-white/90">
              VIDEO PREVIEW // {project.slug.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <AspectPill
              aspect={isVertical ? "9:16 VERTICAL" : "16:9 DCI"}
              resolution="4K HDR"
            />
            <TimecodeBadge timecode="00:01:24:18" />
            <button
              aria-label="Close cinema preview"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors ml-1 cursor-pointer"
              onClick={onClose}
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Video Viewport Stage */}
        <div className="relative bg-black flex items-center justify-center overflow-hidden flex-1 min-h-[300px] sm:min-h-[440px]">
          {youtubeId ? (
            <div className={`w-full h-full ${isVertical ? "max-w-[340px] aspect-[9/16]" : "aspect-video"}`}>
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
                loading="eager"
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={project.title}
              />
            </div>
          ) : directVideoUrl ? (
            <video
              autoPlay
              className={`w-full h-full object-contain ${isVertical ? "max-w-[340px] max-h-[520px]" : "max-h-[500px]"}`}
              controls
              playsInline
              src={directVideoUrl}
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                alt={project.imageAlt || project.title}
                className="w-full h-full object-cover opacity-85"
                onError={(e) => {
                  e.currentTarget.src = fallback;
                }}
                src={project.image || fallback}
                style={{ objectPosition: project.imagePosition || "center" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6">
                <span className="font-mono text-xs text-[#FF4D2D] font-bold uppercase mb-1">
                  FEATURED VIDEO DIRECTION
                </span>
                <p className="text-white/80 text-sm max-w-lg mb-4">
                  {project.summary}
                </p>
                {instagramUrl && (
                  <a
                    className="button button-gold inline-flex items-center gap-2 w-fit py-2 px-4 text-xs font-mono"
                    href={instagramUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    View Original on Instagram <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cinema Monitor Footer & Actions */}
        <div className="px-4 sm:px-6 py-4 bg-[#141222] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[11px] font-bold text-[#FF4D2D] uppercase tracking-wider">
                {project.category}
              </span>
              <span className="text-white/30 text-xs">·</span>
              <span className="font-mono text-[11px] text-white/60">
                {project.format}
              </span>
              {project.clientName && (
                <>
                  <span className="text-white/30 text-xs">·</span>
                  <span className="font-mono text-[11px] text-[#00E599]">
                    {project.clientName}
                  </span>
                </>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate m-0">
              {project.title}
            </h3>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              className="button button-small button-outline text-white border-white/20 hover:border-white text-xs font-mono"
              onClick={onClose}
              to={`/work/${project.slug}`}
            >
              Full Case Study <ArrowUpRight size={14} />
            </Link>
            <Link
              className="button button-small button-gold text-xs font-mono font-bold"
              onClick={onClose}
              to={`/contact?service=${encodeURIComponent(project.category)}&project=${encodeURIComponent(project.title)}`}
            >
              Start a Project <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
