import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectCard({ project, index = 0 }) {
  return (
    <article className={`project-card project-card-${index % 2 === 0 ? "wide" : "tall"}`}>
      <Link
        aria-label={`View ${project.title}, a concept project`}
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
          <span className="concept-stamp">Concept work</span>
        </div>
        <div className="project-caption">
          <div>
            <h3>{project.title}</h3>
            <p>{project.format}</p>
          </div>
          <span className="project-category">{project.category}</span>
        </div>
      </Link>
    </article>
  );
}
