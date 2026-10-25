import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Filter, Play, RotateCcw } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import ProjectCard from "../components/ProjectCard.jsx";
import CinemaModal from "../components/CinemaModal.jsx";
import { CATEGORIES } from "../config/site.js";
import usePublishedProjects from "../hooks/usePublishedProjects.js";

export default function WorkPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cinemaProject, setCinemaProject] = useState(null);
  const currentCategoryParam = searchParams.get("category");
  const activeCategory = CATEGORIES.includes(currentCategoryParam) ? currentCategoryParam : "All";

  const reduceMotion = useReducedMotion();
  const { projects, isLoading, error } = usePublishedProjects();

  const visibleProjects = useMemo(
    () =>
      activeCategory === "All"
        ? projects
        : projects.filter((project) => project.category === activeCategory),
    [activeCategory, projects],
  );

  function handleCategoryChange(category) {
    if (category === "All") {
      searchParams.delete("category");
      setSearchParams(searchParams, { replace: true });
    } else {
      searchParams.set("category", category);
      setSearchParams(searchParams, { replace: true });
    }
  }

  return (
    <section className="studio-page studio-work-page">
      <div className="studio-page-intro">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#FF6542]" />
          <p className="studio-location m-0 font-mono text-xs uppercase tracking-widest text-[#FF6542]">
            SELECTED WORK · FRAMES &amp; CUTS ARCHIVE
          </p>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none mb-4">
          Frames, Stories
          <br />
          <span className="text-[#FF6542]">&amp; Visual Cuts.</span>
        </h1>
        <p className="text-lg text-[#6E6A7C] max-w-2xl leading-relaxed">
          Explore our collection of commercial video edits, dynamic vertical reels,
          podcast productions, and creative directions. Each cut is crafted with precision pacing,
          custom sound design, and cinema-grade color.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="work-toolbar studio-work-toolbar border-b border-[#EAE6E0] pb-6 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div aria-label="Filter portfolio by category" className="filter-list flex flex-wrap gap-2" role="group">
          {["All", ...CATEGORIES].map((category) => {
            const count = category === "All" ? projects.length : projects.filter((p) => p.category === category).length;
            return (
              <button
                aria-pressed={activeCategory === category}
                className={`filter-button font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full border transition-all ${
                  activeCategory === category
                    ? "bg-[#12101E] text-white border-[#12101E] shadow-sm font-bold scale-105"
                    : "bg-white text-[#5C586B] border-[#E8E4DC] hover:border-[#12101E] hover:text-[#12101E]"
                }`}
                key={category}
                onClick={() => handleCategoryChange(category)}
                type="button"
              >
                <span>{category === "All" ? "ALL CUTS" : category}</span>
                <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeCategory === category ? "bg-white/20 text-white" : "bg-black/5 text-[#5C586B]"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-[#6E6A7C]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B9F4D0]" />
          <span className="font-bold text-[#19162B]">
            {String(visibleProjects.length).padStart(2, "0")}{" "}
            {visibleProjects.length === 1 ? "PROJECT INDEXED" : "PROJECTS INDEXED"}
          </span>
        </div>
      </div>

      {/* Asymmetric Editorial Portfolio Board */}
      <div aria-live="polite" className="project-grid work-project-grid min-h-[400px]">
        {isLoading && (
          <div aria-live="polite" className="py-20 text-center font-mono text-sm text-[#6E6A7C]">
            <span className="inline-block animate-spin mr-2">●</span> Loading studio project bins…
          </div>
        )}

        {error && (
          <div className="studio-content-error p-6 rounded-xl bg-red-50 border border-red-200 text-red-700" role="alert">
            Project media could not be loaded: {error}. Please refresh or{" "}
            <Link className="underline font-bold" to="/contact">start a direct brief</Link>.
          </div>
        )}

        {!isLoading && !error && visibleProjects.length === 0 && (
          <div className="studio-content-empty p-12 text-center rounded-2xl border-2 border-dashed border-[#EAE6E0] bg-white">
            <p className="text-base text-[#6E6A7C] mb-4">
              {activeCategory === "All"
                ? "No published cuts in the archive yet."
                : `There are currently no projects indexed under "${activeCategory}".`}
            </p>
            {activeCategory !== "All" && (
              <button
                className="button button-small button-outline inline-flex items-center gap-2"
                onClick={() => handleCategoryChange("All")}
                type="button"
              >
                <RotateCcw size={14} /> Reset Filter to All Cuts
              </button>
            )}
          </div>
        )}

        <AnimatePresence initial={false} mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
            {visibleProjects.map((project, index) => {
              const isFiltered = activeCategory !== "All";
              const isVertical = project.category === "Reels & Short-form";

              let colSpan = "md:col-span-6";
              let variant = isVertical ? "vertical" : "auto";

              if (isFiltered) {
                if (visibleProjects.length === 1) {
                  colSpan = isVertical ? "md:col-span-6 md:col-start-4" : "md:col-span-10 md:col-start-2";
                  variant = isVertical ? "vertical" : "featured";
                } else if (visibleProjects.length === 2) {
                  colSpan = "md:col-span-6";
                }
              } else {
                // Editorial asymmetric rhythm for All Cuts
                if (index === 0) {
                  colSpan = "md:col-span-8";
                  variant = "featured";
                } else if (index === 1) {
                  colSpan = "md:col-span-4";
                  variant = "vertical";
                } else if (index === 2) {
                  colSpan = "md:col-span-5";
                } else if (index === 3) {
                  colSpan = "md:col-span-7";
                } else {
                  colSpan = "md:col-span-6";
                }
              }

              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className={colSpan}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  key={project.slug}
                  layout
                  transition={{
                    delay: reduceMotion ? 0 : (index % 4) * 0.05,
                    duration: reduceMotion ? 0 : 0.3,
                    ease: "easeOut",
                  }}
                >
                  <ProjectCard
                    index={index}
                    onPreviewCut={setCinemaProject}
                    project={project}
                    variant={variant}
                  />
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </div>

      {/* Bottom Editorial Commission Banner */}
      <div className="work-inquiry mt-16 p-8 sm:p-12 rounded-2xl bg-[#F4F1FF] border border-[#7765F8]/20 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#7765F8] block mb-2">
            // COMMISSION A NEW PROJECT
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#19162B] m-0 mb-2">
            Have raw footage or an upcoming production?
          </h3>
          <p className="text-sm text-[#6E6A7C] max-w-xl m-0 leading-relaxed">
            From single hero edits to dedicated monthly channel editing packages,
            we will tailor a cutting pipeline suited to your vision and deadlines.
          </p>
        </div>
        <Link className="button button-gold shrink-0 py-3.5 px-7" to="/contact">
          Commission a Project <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>

      {/* Lightbox Cinema Preview Modal */}
      <CinemaModal
        isOpen={Boolean(cinemaProject)}
        onClose={() => setCinemaProject(null)}
        project={cinemaProject}
      />
    </section>
  );
}
