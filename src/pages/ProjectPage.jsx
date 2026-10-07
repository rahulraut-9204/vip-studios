import { ArrowLeft, ArrowUpRight, ExternalLink, Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import NotFoundPage from "./NotFoundPage.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import {
  getDirectVideoUrl,
  getInstagramUrl,
  getMediaPlatformLabel,
  getSafeExternalUrl,
  getYouTubeId,
} from "../data/media.js";
import usePublishedProjects from "../hooks/usePublishedProjects.js";

export default function ProjectPage() {
  const { slug } = useParams();
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const { projects, isLoading, error } = usePublishedProjects();
  const project = projects.find((item) => item.slug === slug);

  if (isLoading) return <div aria-live="polite" className="studio-route-loading">Loading project…</div>;
  if (error) return <div className="studio-content-error" role="alert">Project work could not be loaded: {error}</div>;
  if (!project) return <NotFoundPage />;
  const relatedProjects = projects
    .filter((item) => item.slug !== project.slug)
    .slice(0, 2);
  const youtubeId = getYouTubeId(project.videoUrl);
  const directVideoUrl = getDirectVideoUrl(project.videoUrl);
  const instagramUrl = getInstagramUrl(project.videoUrl);
  const externalMediaUrl = getSafeExternalUrl(project.videoUrl);
  const hasPlayableMedia = Boolean(youtubeId || directVideoUrl);

  return (
    <article className="project-detail page-gutter">
      <Link className="text-link back-link" to="/work">
        <ArrowLeft aria-hidden="true" size={16} /> Back to work
      </Link>
      <div className="project-detail-heading">
        <div>
          <h1>{project.title}<span className="gold-stop">.</span></h1>
          {project.concept && <p className="project-disclosure">Illustrative concept / not client work</p>}
        </div>
        <div className="project-meta">
          <span>{project.category}</span>
          <span>{project.format}</span>
          <span>{getMediaPlatformLabel(project.platform)}</span>
          <span>{project.concept ? "Illustrative concept study" : "Selected project"}</span>
        </div>
      </div>
      <figure className="project-detail-visual">
        {isMediaOpen && youtubeId ? (
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="project-detail-player"
            loading="lazy"
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0`}
            title={`${project.title} on YouTube`}
          />
        ) : isMediaOpen && directVideoUrl ? (
          <video className="project-detail-player" controls playsInline poster={project.image} preload="metadata">
            <source src={directVideoUrl} />
            Your browser does not support this video.
          </video>
        ) : (
          <button
            className={`project-detail-poster${hasPlayableMedia ? " is-playable" : ""}`}
            onClick={() => hasPlayableMedia && setIsMediaOpen(true)}
            type={hasPlayableMedia ? "button" : undefined}
          >
            <img
              alt={project.imageAlt}
              height="1000"
              src={project.image}
              style={{ objectPosition: project.imagePosition }}
              width="1800"
            />
            {hasPlayableMedia && (
              <span className="project-detail-play">
                <Play fill="currentColor" size={22} /> Play project media
              </span>
            )}
          </button>
        )}
        <figcaption>
          <span>{project.concept ? "Illustrative stock image" : "Project image"}</span>
          <span>
            {instagramUrl ? (
              <a href={instagramUrl} rel="noreferrer" target="_blank">
                View on Instagram <ExternalLink aria-hidden="true" size={13} />
              </a>
            ) : externalMediaUrl && !hasPlayableMedia ? (
              <a href={externalMediaUrl} rel="noreferrer" target="_blank">
                Open source media <ExternalLink aria-hidden="true" size={13} />
              </a>
            ) : project.concept ? "Not a commissioned project" : "Shared as selected work"}
          </span>
        </figcaption>
      </figure>
      <div className="project-story">
        <div>
          <span className="story-label">{project.concept ? "THE IDEA" : "THE PROJECT"}</span>
          <p className="project-summary">{project.summary}</p>
          {project.clientName && <p className="project-detail-line"><strong>Client</strong>{project.clientName}</p>}
        </div>
        <div className="project-story-note">
          <span className="story-label">THE VISUAL APPROACH</span>
          <p>{project.approach}</p>
          {project.role && <p className="project-detail-line"><strong>Role</strong>{project.role}</p>}
          {project.result && <p className="project-detail-line"><strong>Result</strong>{project.result}</p>}
          {project.concept && <p className="concept-disclosure">
            This illustrative concept study uses stock imagery. It is not
            evidence of commissioned work, a client, or a result.
          </p>}
        </div>
      </div>
      <section aria-labelledby="related-projects-title" className="related-projects">
        <div className="related-projects-heading">
          <h2 id="related-projects-title">More visual directions.</h2>
          <Link className="text-link" to="/work">
            View all concepts <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <div className="related-projects-grid">
          {relatedProjects.map((relatedProject, index) => (
            <ProjectCard index={index} key={relatedProject.slug} project={relatedProject} />
          ))}
        </div>
      </section>
      <div className="project-next">
        <span className="story-label">HAVE A BRIEF LIKE THIS?</span>
        <Link className="button button-gold" to="/contact">
          Start a conversation <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </article>
  );
}
