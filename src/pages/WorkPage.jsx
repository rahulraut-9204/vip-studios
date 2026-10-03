import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import ProjectCard from "../components/ProjectCard.jsx";
import { projectCategories, projects } from "../data/projects.js";

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const reduceMotion = useReducedMotion();
  const visibleProjects = useMemo(
    () =>
      activeCategory === "All"
        ? projects
        : projects.filter((project) => project.category === activeCategory),
    [activeCategory],
  );

  return (
    <section className="page-section page-gutter work-page">
      <div className="page-intro">
        <h1>Frames for<br /><span>the feed.</span></h1>
        <p className="page-lede">
          A few visual directions for the kind of stories we can shape across
          social and video. Every project and stock image here is illustrative,
          not commissioned VIP StudioS work.
        </p>
      </div>

      <div className="work-toolbar">
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
        <span className="work-count">
          {String(visibleProjects.length).padStart(2, "0")} CONCEPTS
        </span>
      </div>

      <div aria-live="polite" className="project-grid work-project-grid">
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
      <p className="replace-notice">
        Launch note: replace concept names, descriptions, and stock images with
        verified, approved portfolio material.
      </p>
    </section>
  );
}
