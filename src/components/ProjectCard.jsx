import { ArrowUpRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { getMediaPlatformLabel } from "../data/media.js";

export default function ProjectCard({ project, index = 0 }) {
  return (
    <article className={`project-card project-card-${index % 2 === 0 ? "wide" : "tall"}`}>
      <Link
        aria-label={`View ${project.title}${project.concept ? ", a concept project" : ""}`}
        className="project-link"
        to={`/work/${project.slug}`}
      >
        <div className={`project-image image-tone-${project.accent}`}>
          <img
            alt={project.imageAlt}
            height="900"
            loading="lazy"
            src={project.image}
            style={{ objectPosition: project.imagePosition }}
            width="1400"
          />
          <span className="project-view">
            <ArrowUpRight aria-hidden="true" size={18} />
          </span>
          {project.videoUrl && (
            <span aria-hidden="true" className="project-play"><Play fill="currentColor" size={16} /></span>
          )}
          <span className="concept-stamp">
            {project.concept ? "Concept work" : getMediaPlatformLabel(project.platform)}
          </span>
        </div>
        <div className="project-caption">
          <div>
            <h3>{project.title}</h3>
            <p>{project.format}{project.clientName ? ` · ${project.clientName}` : ""}</p>
          </div>
          <span className="project-category">{project.category}</span>
        </div>
      </Link>
    </article>
  );
}
