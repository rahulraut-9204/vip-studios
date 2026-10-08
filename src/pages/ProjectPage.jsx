import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowUpRight, ExternalLink, Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
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

function MotionBlock({ children, className, delay = 0, reduceMotion, ...props }) {
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduceMotion ? 0 : delay, duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default function ProjectPage() {
  const { slug } = useParams();
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { projects, isLoading, error } = usePublishedProjects();
  const project = projects.find((item) => item.slug === slug);

  if (isLoading) return <div aria-live="polite" className="studio-route-loading">Loading project…</div>;
  if (error) return <div className="studio-content-error" role="alert">Project work could not be loaded: {error}</div>;
  if (!project) return <NotFoundPage />;

  const youtubeId = getYouTubeId(project.videoUrl);
  const directVideoUrl = getDirectVideoUrl(project.videoUrl);
  const instagramUrl = getInstagramUrl(project.videoUrl);
  const externalMediaUrl = getSafeExternalUrl(project.videoUrl);
  const hasPlayableMedia = Boolean(youtubeId || directVideoUrl);
  const mediaPoster = project.image || (youtubeId ? getYouTubeThumbnail(project.videoUrl) : "");
  const hasImage = Boolean(mediaPoster);
  const relatedProjects = projects
    .filter((item) => item.slug !== project.slug && item.category === project.category)
    .slice(0, 3);
  const relatedFallback = relatedProjects.length > 0
    ? relatedProjects
    : projects.filter((item) => item.slug !== project.slug).slice(0, 3);
  const hasMeta = Boolean(project.clientName || project.format || project.year);
  const hasBody = Boolean(project.approach || project.role || project.result);
  const mediaAlt = project.imageAlt || `${project.title} project still`;

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="project-detail page-gutter"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
    >
      <Link className="project-detail-back" to="/work">
        <ArrowLeft aria-hidden="true" size={15} /> All work
      </Link>

      <header className="project-detail-header">
        <MotionBlock className="project-detail-kicker" delay={0} reduceMotion={reduceMotion}>
          {project.category && <span>{project.category}</span>}
          {project.platform && <span>· {getMediaPlatformLabel(project.platform)}</span>}
        </MotionBlock>
        <MotionBlock delay={0.06} reduceMotion={reduceMotion}>
          <h1>{project.title}</h1>
        </MotionBlock>
        {project.summary && (
          <MotionBlock className="project-detail-summary" delay={0.12} reduceMotion={reduceMotion}>
            {project.summary}
          </MotionBlock>
        )}
        {hasMeta && (
          <MotionBlock className="project-detail-meta" delay={0.18} reduceMotion={reduceMotion}>
            {project.clientName && <div><span>Client</span><strong>{project.clientName}</strong></div>}
            {project.format && <div><span>Service</span><strong>{project.format}</strong></div>}
            {project.year && <div><span>Year</span><strong>{project.year}</strong></div>}
          </MotionBlock>
        )}
      </header>

      {(hasImage || hasPlayableMedia) && (
        <MotionBlock className="project-detail-media" delay={0.28} reduceMotion={reduceMotion}>
          {isMediaOpen && youtubeId ? (
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="project-detail-media-player"
              loading="lazy"
              src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0`}
              title={`${project.title} on YouTube`}
            />
          ) : isMediaOpen && directVideoUrl ? (
            <video autoPlay className="project-detail-media-player" controls playsInline poster={project.image} preload="metadata">
              <source src={directVideoUrl} />
              Your browser does not support this video.
            </video>
          ) : hasImage ? (
            <button
              aria-label={hasPlayableMedia ? `Play ${project.title}` : undefined}
              className={`project-detail-media-poster${hasPlayableMedia ? " is-playable" : ""}`}
              onClick={() => hasPlayableMedia && setIsMediaOpen(true)}
              type={hasPlayableMedia ? "button" : "button"}
            >
              <img alt={mediaAlt} height="1000" src={mediaPoster} style={{ objectPosition: project.imagePosition }} width="1800" />
              {hasPlayableMedia && <span className="project-detail-play"><Play fill="currentColor" size={20} /> Play project media</span>}
            </button>
          ) : null}
          {(instagramUrl || (externalMediaUrl && !hasPlayableMedia)) && (
            <p className="project-detail-media-source">
              {instagramUrl ? (
                <a href={instagramUrl} rel="noreferrer" target="_blank">View on Instagram <ExternalLink aria-hidden="true" size={13} /></a>
              ) : (
                <a href={externalMediaUrl} rel="noreferrer" target="_blank">Open source media <ExternalLink aria-hidden="true" size={13} /></a>
              )}
            </p>
          )}
        </MotionBlock>
      )}

      {hasBody ? (
        <MotionBlock className="project-detail-body" delay={0.43} reduceMotion={reduceMotion}>
          {project.approach && <section><p className="project-detail-label">Approach</p><p className="project-detail-approach">{project.approach}</p></section>}
          <div className="project-detail-meta-cards">
            {project.role && <div className="project-detail-meta-card"><span>Role</span><p>{project.role}</p></div>}
            {project.result && <div className="project-detail-meta-card"><span>Result</span><p>{project.result}</p></div>}
          </div>
        </MotionBlock>
      ) : (
        <p className="project-detail-empty">Project details coming soon.</p>
      )}

      {relatedFallback.length > 0 && (
        <motion.section
          aria-labelledby="related-projects-title"
          className="project-detail-related"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
        >
          <SectionHeading
            detail="More work in the same visual conversation."
            id="related-projects-title"
            title="Related work"
          />
          <div className="project-detail-related-grid">
            {relatedFallback.map((relatedProject, index) => (
              <motion.div
                className={`project-detail-related-item project-detail-related-item-${index + 1}`}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                key={relatedProject.slug}
                transition={{ delay: reduceMotion ? 0 : index * 0.06, duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.2 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <ProjectCard index={index} project={relatedProject} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      <div className="project-detail-cta">
        <span className="project-detail-label">Have a brief like this?</span>
        <Link className="button button-gold" to="/contact">
          Start a conversation <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </motion.article>
  );
}
