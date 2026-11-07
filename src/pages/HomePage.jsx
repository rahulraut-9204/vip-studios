import { useState, useMemo } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Scissors,
  Share2,
  Sparkles,
  TrendingUp,
  Video,
  Mic2,
  Youtube,
  Layers,
} from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import HeroReel from "../components/HeroReel.jsx";
import StatsCounter from "../components/StatsCounter.jsx";
import ProcessSection from "../components/ProcessSection.jsx";
import ResultsSection from "../components/ResultsSection.jsx";
import TestimonialsSection from "../components/TestimonialsSection.jsx";
import PricingSection from "../components/PricingSection.jsx";
import FaqAccordion from "../components/FaqAccordion.jsx";
import LeadMagnetSection from "../components/LeadMagnetSection.jsx";
import LeadCaptureForm from "../components/LeadCaptureForm.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import CinemaModal from "../components/CinemaModal.jsx";
import { serviceOfferings } from "../data/services.js";
import usePublishedProjects from "../hooks/usePublishedProjects.js";

const serviceIconsMap = {
  "social-media-management": Share2,
  "video-shoots": Video,
  "professional-video-editing": Scissors,
  "podcast-production": Mic2,
  "youtube-channel-management": Youtube,
  "content-creation": Sparkles,
  "digital-growth": TrendingUp,
  "brand-content": Layers,
};

const PORTFOLIO_FILTERS = ["All", "Reels", "Long-form", "Podcasts", "Ads", "Branding"];

export default function HomePage() {
  const context = useOutletContext();
  const openCalendly = context?.openCalendly;

  const [previewProject, setPreviewProject] = useState(null);
  const [portfolioCategory, setPortfolioCategory] = useState("All");

  const { projects: publishedProjects, isLoading, error } = usePublishedProjects();

  // Filterable Our Work
  const filteredProjects = useMemo(() => {
    if (portfolioCategory === "All") return publishedProjects;
    return publishedProjects.filter((p) => {
      if (portfolioCategory === "Reels") return p.category === "Reels";
      if (portfolioCategory === "Long-form") return p.category === "Long-form" || p.category === "Video" || p.category === "YouTube";
      if (portfolioCategory === "Podcasts") return p.category === "Podcasts" || p.category === "Podcast";
      if (portfolioCategory === "Ads") return p.category === "Ads" || p.category === "Social Media";
      if (portfolioCategory === "Branding") return p.category === "Branding";
      return p.category === portfolioCategory;
    });
  }, [publishedProjects, portfolioCategory]);

  return (
    <div className="vip-home bg-[#0A0A0A] text-white">
      {/* 2. Hero: Outcome Headline, One-Line Subheading, Dual CTAs, Showreel & Trust Strip */}
      <HeroReel projects={publishedProjects} onOpenCalendly={openCalendly} />

      {/* 3. Animated Stats Counters */}
      <StatsCounter />

      {/* 4. Filterable Our Work Portfolio */}
      <section
        id="portfolio"
        aria-labelledby="portfolio-title"
        className="py-24 bg-[#0A0A0A] border-t border-[#1E1E1E] relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
                  HIGH-RETENTION PORTFOLIO
                </span>
              </div>
              <h2
                id="portfolio-title"
                className="text-3xl sm:text-5xl font-black tracking-tight text-white m-0 font-display"
              >
                Selected Work. <span className="text-[#FFD21C]">Engineered to Convert.</span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#A1A1AA] max-w-md m-0 font-sans leading-relaxed">
              Explore 9:16 viral reels, episodic YouTube series, commercial brand films, and visual podcasts built for compounding attention.
            </p>
          </div>

          {/* Featured Direct Link Callout: Brand Film Production */}
          <div className="mb-10 p-5 rounded-2xl bg-[#141414] border border-[#FFD21C]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <span className="w-3 h-3 rounded-full bg-[#FFD21C] animate-pulse" />
              <div>
                <strong className="block text-white text-base font-display font-bold">
                  Featured Master Cut: Brand Film Production
                </strong>
                <span className="text-xs text-[#A1A1AA] font-sans">
                  Direct commercial cut hosted on YouTube in 4K DCI anamorphic format.
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

          {/* Filter Categories Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[#1E1E1E]">
            <div className="flex flex-wrap items-center gap-2">
              {PORTFOLIO_FILTERS.map((cat) => {
                const isActive = portfolioCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPortfolioCategory(cat)}
                    className={`font-mono text-xs uppercase px-4 py-2 rounded-xl border transition-all cursor-pointer font-bold ${
                      isActive
                        ? "bg-[#FFD21C] text-[#0A0A0A] border-[#FFD21C] shadow-[0_0_15px_rgba(255,210,28,0.3)] scale-105"
                        : "bg-[#141414] text-[#A1A1AA] border-[#222222] hover:text-white hover:border-[#333333]"
                    }`}
                  >
                    {cat === "All" ? "ALL PROJECTS" : cat}
                  </button>
                );
              })}
            </div>

            <span className="font-mono text-xs text-[#71717A]">
              AUTOPLAY ON HOVER · CLICK FOR LIGHTBOX
            </span>
          </div>

          {isLoading && (
            <div className="py-20 text-center font-mono text-sm text-[#A1A1AA]">
              <span className="inline-block animate-spin mr-2 text-[#FFD21C]">●</span> Loading curated portfolio cuts…
            </div>
          )}

          {error && (
            <div className="py-12 text-center text-red-400 font-mono text-xs">
              Notice: Could not load dynamic cuts: {error}. Presenting offline archive.
            </div>
          )}

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.slug || index}
                index={index}
                onPreviewCut={setPreviewProject}
                project={project}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <Link
              to="/work"
              className="button button-outline font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
            >
              View Full Portfolio Archive <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Services: Cards with Icons, One-Line Benefit Each & Scope */}
      <section
        id="services"
        aria-labelledby="services-title"
        className="py-24 bg-[#0E0E0E] border-t border-[#1E1E1E] relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
                  CORE AGENCY CAPABILITIES
                </span>
              </div>
              <h2
                id="services-title"
                className="text-3xl sm:text-5xl font-black tracking-tight text-white m-0 font-display"
              >
                Full-Funnel Services. <br />
                <span className="text-[#FFD21C]">One Coordinated Partner.</span>
              </h2>
            </div>
            <p className="text-base text-[#A1A1AA] max-w-md m-0 font-sans leading-relaxed">
              We eliminate the friction of coordinating between disconnected videographers, editors, and ad agencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {serviceOfferings.slice(0, 6).map((service, index) => {
              const IconComponent = serviceIconsMap[service.slug] || Scissors;
              return (
                <article
                  key={service.slug}
                  className="p-8 rounded-2xl bg-[#141414]/90 backdrop-blur-md border border-[#222222] hover:border-[#FFD21C]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] text-[#FFD21C] flex items-center justify-center border border-white/5 group-hover:bg-[#FFD21C] group-hover:text-[#0A0A0A] transition-all">
                        <IconComponent size={22} />
                      </div>
                      <span className="font-mono text-xs font-black text-[#71717A] tracking-wider uppercase">
                        0{index + 1} // SPRINT
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white mb-2 font-display group-hover:text-[#FFD21C] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6 font-sans">
                      {service.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {service.scope.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="font-mono text-[10px] text-[#CCCCCC] bg-[#1A1A1A] px-2.5 py-1 rounded-md border border-white/5"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#222222] flex items-center justify-between">
                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-white group-hover:text-[#FFD21C] transition-colors"
                    >
                      <span>Learn More</span>
                      <ArrowRight size={13} />
                    </Link>
                    <a
                      href={`#contact?service=${encodeURIComponent(service.title)}`}
                      className="text-xs font-mono font-bold text-[#FFD21C] hover:underline"
                    >
                      Book Service →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Process: 4-Step Animated Timeline */}
      <ProcessSection />

      {/* 7. Case Studies / Results */}
      <ResultsSection />

      {/* 8. Testimonials Carousel */}
      <TestimonialsSection />

      {/* 9. Pricing & Packages */}
      <PricingSection />

      {/* 10. Frequently Asked Questions Accordion */}
      <FaqAccordion />

      {/* 11. Lead Magnet Download Section */}
      <LeadMagnetSection />

      {/* 11. Final CTA Banner & High-Converting Lead Form */}
      <LeadCaptureForm onOpenCalendly={openCalendly} />

      {/* Lightbox Cinema Preview Modal */}
      <CinemaModal
        isOpen={Boolean(previewProject)}
        onClose={() => setPreviewProject(null)}
        project={previewProject}
      />
    </div>
  );
}
