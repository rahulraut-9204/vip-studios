import { ArrowUpRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { getDirectVideoUrl, getMediaPlatformLabel } from "../data/media.js";

export default function ProjectCard({ project, index = 0 }) {
  const videoRef = useRef(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const directVideoUrl = getDirectVideoUrl(project.videoUrl);

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
    <article className="project-card">
      <Link
        aria-label={`View ${project.title}${project.concept ? ", a concept project" : ""}`}
        className="project-link"
        onMouseEnter={startPreview}
        onMouseLeave={stopPreview}
        to={`/work/${project.slug}`}
      >
        <div className={`project-image${project.image ? ` image-tone-${project.accent}` : " project-image-empty"}`}>
          {project.image ? (
            <>
              <img
                alt={project.imageAlt}
                className={isPreviewing ? "is-preview-hidden" : ""}
                height="900"
                loading="lazy"
                src={project.image}
                style={{ objectPosition: project.imagePosition }}
                width="1400"
              />
              {directVideoUrl && (
                <video
                  aria-hidden="true"
                  className={`project-video-preview${isPreviewing ? " is-visible" : ""}`}
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
          <span aria-hidden="true" className="project-view">
            <ArrowUpRight size={18} />
          </span>
          {project.videoUrl && (
            <span aria-hidden="true" className="project-play">
              <Play fill="currentColor" size={14} />
            </span>
          )}
          {project.featured && <span className="project-featured">Featured</span>}
        </div>
        <div className="project-caption">
          <div>
            <p className="project-label">
              {project.category} · {getMediaPlatformLabel(project.platform)}
            </p>
            <h3>{project.title}</h3>
            {project.clientName && <p className="project-client">{project.clientName}</p>}
          </div>
          <span className="project-format">{project.format}</span>
        </div>
        {project.concept && !project.videoUrl && <p className="project-concept-label">Concept study</p>}
      </Link>
    </article>
  );
}
