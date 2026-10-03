import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage.jsx";
import { getProjectBySlug } from "../data/projects.js";

export default function ProjectPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) return <NotFoundPage />;

  return (
    <article className="project-detail page-gutter">
      <Link className="text-link back-link" to="/work">
        <ArrowLeft aria-hidden="true" size={16} /> Back to work
      </Link>
      <div className="project-detail-heading">
        <div>
          <h1>{project.title}<span className="gold-stop">.</span></h1>
          <p className="project-disclosure">Illustrative concept / not client work</p>
        </div>
        <div className="project-meta">
          <span>{project.category}</span>
          <span>{project.format}</span>
        </div>
      </div>
      <figure className="project-detail-visual">
        <img
          alt={project.imageAlt}
          height="1000"
          src={project.image}
          style={{ objectPosition: project.imagePosition }}
          width="1800"
        />
        <figcaption>
          <span>Illustrative concept image</span>
          <span>Replace before launch</span>
        </figcaption>
      </figure>
      <div className="project-story">
        <div>
          <span className="story-label">THE IDEA</span>
          <p className="project-summary">{project.summary}</p>
        </div>
        <div className="project-story-note">
          <span className="story-label">THE VISUAL APPROACH</span>
          <p>{project.approach}</p>
          <p className="concept-disclosure">
            This illustrative concept study uses stock imagery. It is not
            evidence of commissioned work, a client, or a result.
          </p>
        </div>
      </div>
      <div className="project-next">
        <span className="story-label">HAVE A BRIEF LIKE THIS?</span>
        <Link className="button button-gold" to="/contact">
          Start a conversation <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </article>
  );
}
