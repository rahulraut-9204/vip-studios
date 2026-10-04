import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import ProjectCard from "../components/ProjectCard.jsx";
import { projectCategories } from "../data/projects.js";
import usePublishedProjects from "../hooks/usePublishedProjects.js";

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const reduceMotion = useReducedMotion();
  const { projects, isLoading, error } = usePublishedProjects();
  const visibleProjects = useMemo(
    () =>
      activeCategory === "All"
        ? projects
        : projects.filter((project) => project.category === activeCategory),
    [activeCategory],
  );

  return (
    <section className="studio-page studio-work-page">
      <div className="studio-page-intro">
        <p className="studio-location">VISUAL DIRECTIONS · CONCEPT STUDIES</p>
        <h1>Frames for<br /><span>the story.</span></h1>
        <p>
          {projects.length > 0 && projects.every((project) => project.concept)
            ? "Explore illustrative directions for social and video. These studies use stock imagery; they are not client projects or proof of delivered results."
            : "Explore selected work and visual directions for social and video. Each project is identified clearly, with no invented results or client claims."}
        </p>
      </div>

      <div className="work-toolbar studio-work-toolbar">
        <div aria-label="Filter concept projects" className="filter-list" role="group">
          {projectCategories.map((category) => (
            <button
              aria-pressed={activeCategory === category}
              className={`filter-button${activeCategory === category ? " is-active" : ""}`}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
        <span className="work-count" aria-live="polite">
          {String(visibleProjects.length).padStart(2, "0")}{" "}
          {visibleProjects.length > 0 && visibleProjects.every((project) => project.concept)
            ? "CONCEPT STUDIES"
            : "PROJECTS"}
        </span>
      </div>

      <div aria-live="polite" className="project-grid work-project-grid">
        {isLoading && <p aria-live="polite" className="studio-content-loading">Loading project work…</p>}
        {error && <p className="studio-content-error" role="alert">Project work could not be loaded: {error}</p>}
        {!isLoading && !error && visibleProjects.length === 0 && (
          <p className="studio-content-empty">There are no published projects yet. <Link to="/contact">Tell us about your project.</Link></p>
        )}
        <AnimatePresence initial={false} mode="popLayout">
          {visibleProjects.map((project, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="project-grid-item"
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              key={project.slug}
              layout={!reduceMotion}
              transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
            >
              <ProjectCard index={index} project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="work-inquiry">
        <p>These are visual directions, not client case studies. Bring us a brief and we can shape one around your story.</p>
        <Link className="button button-gold" to="/contact">
          Start a project <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </section>
  );
}
