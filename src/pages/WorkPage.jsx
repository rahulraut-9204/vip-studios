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
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <section className="studio-page studio-work-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Editorial Page Header */}
        <div className="studio-page-intro mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
            <p className="studio-location m-0 font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
              SHOWCASE ARCHIVE // CURATED CUTS
            </p>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none mb-4 text-white font-display">
            Crafted Cuts &amp; <span className="text-[#FFD21C]">Commercial Edits.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1AA] max-w-2xl leading-relaxed font-sans m-0">
            A portfolio across high-retention vertical reels, YouTube episodic cuts, podcasts, corporate narratives, and commercial brand films engineered for maximum attention and compounding digital growth.
          </p>
        </div>

        {/* Featured Direct Link Callout: Brand Film Production */}
        <div className="mb-10 p-5 rounded-xl bg-[#141414] border border-[#FFD21C]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <span className="w-3 h-3 rounded-full bg-[#FFD21C] animate-pulse" />
            <div>
              <strong className="block text-white text-base font-display font-bold">
                Featured Master Reel: Brand Film Production
              </strong>
              <span className="text-xs text-[#A1A1AA] font-sans">
                Direct external commercial cut hosted on YouTube in 4K DCI.
              </span>
            </div>
          </div>
          <a
            className="button button-gold button-small inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider"
            href="https://youtu.be/5ey7tP006cg?si=2XUdvaCgFEbLc06C"
            rel="noopener noreferrer"
            target="_blank"
          >
            Watch on YouTube <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Filter Toolbar */}
        <div className="work-toolbar studio-work-toolbar border-b border-[#1E1E1E] pb-6 mb-10 flex flex-wrap items-center justify-between gap-4">
          <div aria-label="Filter portfolio by category" className="filter-list flex flex-wrap gap-2" role="group">
            {["All", ...CATEGORIES].map((category) => {
              const count = category === "All" ? projects.length : projects.filter((p) => p.category === category).length;
              const isActive = activeCategory === category;
              return (
                <button
                  aria-pressed={isActive}
                  className={`filter-button font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-lg border transition-all cursor-pointer font-bold ${
                    isActive
                      ? "bg-[#FFD21C] text-[#0A0A0A] border-[#FFD21C] shadow-sm scale-105"
                      : "bg-[#141414] text-[#A1A1AA] border-[#222222] hover:border-[#333333] hover:text-white"
                  }`}
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  type="button"
                >
                  <span>{category === "All" ? "ALL PROJECTS" : category}</span>
                  <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isActive ? "bg-[#0A0A0A]/20 text-[#0A0A0A]" : "bg-white/10 text-[#A1A1AA]"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5 font-mono text-xs text-[#A1A1AA] bg-[#141414] px-4 py-2 rounded-lg border border-[#222222]">
            <span className="w-2 h-2 rounded-full bg-[#FFD21C]" />
            <span className="font-bold text-white">
              {String(visibleProjects.length).padStart(2, "0")}{" "}
              {visibleProjects.length === 1 ? "PROJECT INDEXED" : "PROJECTS INDEXED"}
            </span>
          </div>
        </div>

        {/* Project Grid Container */}
        <div aria-live="polite" className="work-project-grid min-h-[400px]">
          {isLoading && (
            <div aria-live="polite" className="py-24 text-center font-mono text-sm text-[#A1A1AA]">
              <span className="inline-block animate-spin mr-2">●</span> Loading studio projects…
            </div>
          )}

          {error && (
            <div className="p-6 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-sm font-mono" role="alert">
              Project media could not be loaded: {error}. Please refresh or{" "}
              <Link className="underline font-bold text-[#FFD21C]" to="/contact">start a direct brief</Link>.
            </div>
          )}

          {!isLoading && !error && visibleProjects.length === 0 && (
            <div className="p-12 text-center rounded-2xl border border-dashed border-[#2A2A2A] bg-[#141414]">
              <p className="text-base text-[#A1A1AA] mb-4 font-sans">
                {activeCategory === "All"
                  ? "No published projects found."
                  : `There are currently no projects indexed under "${activeCategory}".`}
              </p>
              {activeCategory !== "All" && (
                <button
                  className="button button-small button-outline inline-flex items-center gap-2 font-mono text-xs uppercase"
                  onClick={() => handleCategoryChange("All")}
                  type="button"
                >
                  <RotateCcw size={14} /> Reset Filter to All Projects
                </button>
              )}
            </div>
          )}

          <AnimatePresence initial={false} mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
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
        <div className="work-inquiry mt-20 p-8 sm:p-12 rounded-2xl bg-[#141414] border border-[#222222] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFD21C] block mb-2">
              START A PROJECT // CUTTING ROOM READY
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white m-0 mb-2 font-display">
              Have raw footage or an upcoming production sprint?
            </h3>
            <p className="text-sm text-[#A1A1AA] max-w-xl m-0 leading-relaxed font-sans">
              From single commercial films to dedicated monthly social content editing,
              we engineer an editing pipeline suited to your vision, brand, and turnaround requirements.
            </p>
          </div>
          <Link className="button button-gold shrink-0 py-3.5 px-7 font-mono text-xs font-bold uppercase tracking-wider" to="/contact">
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
    </div>
  );
}
