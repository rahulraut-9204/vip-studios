import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, RotateCcw } from "lucide-react";
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
      {/* Editorial Page Header */}
      <div className="studio-page-intro mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D2D] shadow-[0_0_8px_#FF4D2D]" />
          <p className="studio-location m-0 font-mono text-xs uppercase tracking-widest text-[#FF4D2D] font-bold">
            SELECTED WORK · PORTFOLIO ARCHIVE
          </p>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none mb-4 text-[#12101E]">
          Crafted Cuts &amp;
          <br />
          <span className="text-[#FF4D2D]">Commercial Edits.</span>
        </h1>
        <p className="text-lg text-[#5C586B] max-w-2xl leading-relaxed">
          A selection of commercial videos, dynamic vertical reels, YouTube productions,
          and brand films crafted for maximum engagement, cinematic color, and high viewer retention.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="work-toolbar studio-work-toolbar border-b border-[#E8E4DC] pb-6 mb-10 flex flex-wrap items-center justify-between gap-4">
        <div aria-label="Filter portfolio by category" className="filter-list flex flex-wrap gap-2" role="group">
          {["All", ...CATEGORIES].map((category) => {
            const count = category === "All" ? projects.length : projects.filter((p) => p.category === category).length;
            const isActive = activeCategory === category;
            return (
              <button
                aria-pressed={isActive}
                className={`filter-button font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-full border transition-all ${
                  isActive
                    ? "bg-[#12101E] text-white border-[#12101E] shadow-sm font-bold scale-105"
                    : "bg-white text-[#5C586B] border-[#E8E4DC] hover:border-[#12101E] hover:text-[#12101E]"
                }`}
                key={category}
                onClick={() => handleCategoryChange(category)}
                type="button"
              >
                <span>{category === "All" ? "ALL PROJECTS" : category}</span>
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? "bg-white/20 text-white" : "bg-black/5 text-[#5C586B]"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 font-mono text-xs text-[#5C586B] bg-white px-3.5 py-1.5 rounded-full border border-[#E8E4DC] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#00E599]" />
          <span className="font-bold text-[#12101E]">
            {String(visibleProjects.length).padStart(2, "0")}{" "}
            {visibleProjects.length === 1 ? "PROJECT INDEXED" : "PROJECTS INDEXED"}
          </span>
        </div>
      </div>

      {/* Project Grid Container */}
      <div aria-live="polite" className="work-project-grid min-h-[400px]">
        {isLoading && (
          <div aria-live="polite" className="py-20 text-center font-mono text-sm text-[#5C586B]">
            <span className="inline-block animate-spin mr-2">●</span> Loading studio projects…
          </div>
        )}

        {error && (
          <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-700" role="alert">
            Project media could not be loaded: {error}. Please refresh or{" "}
            <Link className="underline font-bold" to="/contact">start a direct brief</Link>.
          </div>
        )}

        {!isLoading && !error && visibleProjects.length === 0 && (
          <div className="p-12 text-center rounded-2xl border-2 border-dashed border-[#E8E4DC] bg-white">
            <p className="text-base text-[#5C586B] mb-4">
              {activeCategory === "All"
                ? "No published projects found."
                : `There are currently no projects indexed under "${activeCategory}".`}
            </p>
            {activeCategory !== "All" && (
              <button
                className="button button-small button-outline inline-flex items-center gap-2"
                onClick={() => handleCategoryChange("All")}
                type="button"
              >
                <RotateCcw size={14} /> Reset Filter to All Projects
              </button>
            )}
          </div>
        )}

        <AnimatePresence initial={false} mode="popLayout">
          <div className={
            visibleProjects.length === 1
              ? "max-w-2xl mx-auto w-full"
              : "grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 w-full"
          }>
            {visibleProjects.map((project, index) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
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
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      {/* Bottom Project Inquiry Banner */}
      <div className="work-inquiry mt-16 p-8 sm:p-12 rounded-2xl bg-[#F5F3FF] border border-[#635BFF]/20 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#635BFF] block mb-2">
            START A PROJECT
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#12101E] m-0 mb-2">
            Have raw footage or an upcoming video project?
          </h3>
          <p className="text-sm text-[#5C586B] max-w-xl m-0 leading-relaxed">
            From single commercial films to dedicated monthly social content editing,
            we will tailor an editing pipeline suited to your vision, brand, and deadlines.
          </p>
        </div>
        <Link className="button button-gold shrink-0 py-3.5 px-7" to="/contact">
          Start Your Project <ArrowUpRight aria-hidden="true" size={17} />
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
