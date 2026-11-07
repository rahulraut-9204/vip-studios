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
  Palette,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import HeroReel from "../components/HeroReel.jsx";
import StatsCounter from "../components/StatsCounter.jsx";
import ClientSocialShowcase from "../components/ClientSocialShowcase.jsx";
import IndustriesSection from "../components/IndustriesSection.jsx";
import ProcessSection from "../components/ProcessSection.jsx";
import ContentEcosystemSection from "../components/ContentEcosystemSection.jsx";
import WhyVipSection from "../components/WhyVipSection.jsx";
import TestimonialsSection from "../components/TestimonialsSection.jsx";
import TeamSection from "../components/TeamSection.jsx";
import FaqAccordion from "../components/FaqAccordion.jsx";
import LeadCaptureForm from "../components/LeadCaptureForm.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import CinemaModal from "../components/CinemaModal.jsx";
import { serviceOfferings } from "../data/services.js";
import usePublishedProjects from "../hooks/usePublishedProjects.js";
import { getWhatsAppHref } from "../data/contact.js";

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

const PORTFOLIO_FILTERS = [
  "All Projects",
  "Social Media Management",
  "Instagram Reels",
  "YouTube Videos",
  "Podcast",
  "Creative Designs",
  "Carousels",
  "Brand Campaigns",
];

export default function HomePage() {
  const [previewProject, setPreviewProject] = useState(null);
  const [portfolioCategory, setPortfolioCategory] = useState("All Projects");

  const { projects: publishedProjects, isLoading, error } = usePublishedProjects();

  const whatsAppHref = getWhatsAppHref(
    "Hi VIP StudioS, I'm ready to take our brand seriously on social media. Let's discuss."
  );

  // Interactive portfolio filter mapping
  const filteredProjects = useMemo(() => {
    if (portfolioCategory === "All Projects") return publishedProjects;
    return publishedProjects.filter((p) => {
      const cat = p.category?.toLowerCase() || "";
      if (portfolioCategory === "Instagram Reels") return cat.includes("reel");
      if (portfolioCategory === "YouTube Videos") return cat.includes("youtube") || cat.includes("video") || cat.includes("long-form");
      if (portfolioCategory === "Podcast") return cat.includes("podcast");
      if (portfolioCategory === "Social Media Management") return cat.includes("social") || cat.includes("management");
      if (portfolioCategory === "Creative Designs" || portfolioCategory === "Carousels") return cat.includes("branding") || cat.includes("design") || cat.includes("carousel");
      if (portfolioCategory === "Brand Campaigns") return cat.includes("branding") || cat.includes("campaign") || cat.includes("ads");
      return p.category === portfolioCategory;
    });
  }, [publishedProjects, portfolioCategory]);

  return (
    <div className="vip-home bg-[#0A0A0A] text-white">
      {/* SECTION 01 — HERO */}
      <HeroReel projects={publishedProjects} />

      {/* SECTION 02 — TRUST & EXPERIENCE */}
      <StatsCounter />

      {/* SECTION 03 — ABOUT OUR SERVICES */}
      <section
        id="services"
        aria-labelledby="services-heading"
        className="py-24 bg-[#0A0A0A] border-t border-[#1E1E1E] relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
                  SERVICES &amp; CAPABILITIES
                </span>
              </div>
              <h2
                id="services-heading"
                className="text-3xl sm:text-5xl font-black tracking-tight text-white m-0 font-display"
              >
                Complete Social Media Solutions <br />
                <span className="text-[#FFD21C]">Under One Roof.</span>
              </h2>
            </div>
            <p className="text-base text-[#A1A1AA] max-w-md m-0 font-sans leading-relaxed">
              Your business needs more than occasional posts. It needs a consistent content strategy, engaging creatives, and a professional digital presence. VIP StudioS brings all these elements together.
            </p>
          </div>

          {/* 8 Core Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                slug: "social-media-management",
                title: "Social Media Management",
                desc: "Complete Instagram and Facebook account handling, publishing calendars, and community positioning.",
                deliverables: ["Profile optimization", "Monthly content planning", "Scheduled publishing", "Engagement tracking"],
                icon: Share2,
              },
              {
                slug: "content-strategy",
                title: "Content Strategy",
                desc: "Audience research, competitive gap analysis, and tailored monthly content pillars aligned with business revenue.",
                deliverables: ["Pillar development", "Viral retention hooks", "Script templates", "Competitor analysis"],
                icon: TrendingUp,
              },
              {
                slug: "professional-video-editing",
                title: "Reels & Video Editing",
                desc: "High-retention 9:16 vertical reels and shorts with kinetic text, micro-pacing, and audio sound sync.",
                deliverables: ["Kinetic subtitles", "Sound design & foley", "DaVinci color grade", "Multi-platform cutdowns"],
                icon: Scissors,
              },
              {
                slug: "video-shoots",
                title: "Video Production",
                desc: "Professional on-location video shooting in Pune with cinema cameras, studio lighting, and directional audio.",
                deliverables: ["On-location shoots", "Interview direction", "B-roll capture", "Pristine audio recording"],
                icon: Video,
              },
              {
                slug: "podcast-production",
                title: "Podcast Production",
                desc: "Multi-camera studio podcast shooting, audio mastering, and viral short-form clip distribution.",
                deliverables: ["Multi-cam switching", "Dialogue noise reduction", "Short clips extraction", "YouTube packaging"],
                icon: Mic2,
              },
              {
                slug: "youtube-channel-management",
                title: "YouTube Management",
                desc: "Long-form episodic video editing, clickable custom thumbnails, SEO titles, chaptering, and Shorts rollout.",
                deliverables: ["Long-form master cuts", "High-CTR thumbnails", "SEO description & tags", "Community updates"],
                icon: Youtube,
              },
              {
                slug: "content-creation",
                title: "Creative Design",
                desc: "Infographic carousels, custom branded graphics, feed aesthetics, and high-save visual assets.",
                deliverables: ["Multi-slide carousels", "Brand asset templates", "Story creatives", "Offer flyers"],
                icon: Palette,
              },
              {
                slug: "brand-content",
                title: "Brand Content Development",
                desc: "Cohesive visual storytelling and long-term brand equity development across all digital touchpoints.",
                deliverables: ["Brand visual guidelines", "Founder stories", "Commercial brand films", "Identity assets"],
                icon: Layers,
              },
            ].map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <article
                  key={idx}
                  className="p-7 rounded-2xl bg-[#141414]/90 backdrop-blur-md border border-[#222222] hover:border-[#FFD21C]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] text-[#FFD21C] flex items-center justify-center border border-white/5 group-hover:scale-110 group-hover:bg-[#FFD21C] group-hover:text-[#0A0A0A] transition-all">
                        <Icon size={22} />
                      </div>
                      <span className="font-mono text-xs font-black text-[#71717A] tracking-wider uppercase">
                        0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 font-display group-hover:text-[#FFD21C] transition-colors leading-snug">
                      {srv.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6 font-sans">
                      {srv.desc}
                    </p>

                    <div className="pt-3 border-t border-[#222222] mb-6">
                      <strong className="block text-[10px] font-mono uppercase text-[#71717A] tracking-wider mb-2">
                        Deliverables:
                      </strong>
                      <div className="flex flex-wrap gap-1.5">
                        {srv.deliverables.map((item, dIdx) => (
                          <span
                            key={dIdx}
                            className="font-mono text-[10px] text-[#CCCCCC] bg-[#1A1A1A] px-2 py-0.5 rounded border border-white/5"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#222222] flex items-center justify-between">
                    <Link
                      to={`/services/${srv.slug}`}
                      className="text-xs font-mono font-bold text-white group-hover:text-[#FFD21C] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Explore Service</span>
                      <ArrowRight size={13} />
                    </Link>
                    <a
                      href={`#enquiry?service=${encodeURIComponent(srv.title)}`}
                      className="text-xs font-mono font-bold text-[#FFD21C] hover:underline"
                    >
                      Enquire →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-[#1E1E1E]">
            <span className="font-mono text-xs text-[#71717A]">
              END-TO-END SOCIAL MEDIA MANAGEMENT &amp; CREATIVE CONTENT PRODUCTION
            </span>
            <Link
              to="/services"
              className="button button-outline text-xs font-mono font-bold uppercase inline-flex items-center gap-2"
            >
              View Full Services Directory <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 04 — OUR WORK / PORTFOLIO */}
      <section
        id="work"
        aria-labelledby="portfolio-heading"
        className="py-24 bg-[#0E0E0E] border-t border-[#1E1E1E] relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
                  SELECTED WORK ARCHIVE
                </span>
              </div>
              <h2
                id="portfolio-heading"
                className="text-3xl sm:text-5xl font-black tracking-tight text-white m-0 font-display"
              >
                Creative Work. <span className="text-[#FFD21C]">Real Brands. Real Content.</span>
              </h2>
            </div>
            <p className="text-base text-[#A1A1AA] max-w-md m-0 font-sans leading-relaxed">
              Browse actual creative cuts, high-retention Reels, YouTube episodes, and carousels engineered for our retained clients.
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

          {/* Interactive Filter Toolbar */}
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
                    {cat}
                  </button>
                );
              })}
            </div>

            <span className="font-mono text-xs text-[#71717A]">
              AUTOPLAY ON HOVER · CLICK FOR DETAIL LIGHTBOX
            </span>
          </div>

          {isLoading && (
            <div className="py-20 text-center font-mono text-sm text-[#A1A1AA]">
              <span className="inline-block animate-spin mr-2 text-[#FFD21C]">●</span> Loading curated cuts…
            </div>
          )}

          {error && (
            <div className="py-12 text-center text-red-400 font-mono text-xs">
              Notice: Could not load dynamic cuts: {error}. Presenting offline archive.
            </div>
          )}

          {/* Project Grid */}
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
              View Full Work Archive <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 05 — CLIENT SOCIAL MEDIA SHOWCASE */}
      <ClientSocialShowcase />

      {/* SECTION 06 — INDUSTRIES WE WORK WITH */}
      <IndustriesSection />

      {/* SECTION 07 — OUR CONTENT PROCESS */}
      <ProcessSection />

      {/* SECTION 08 — ONE CONTENT IDEA, MULTIPLE FORMATS */}
      <ContentEcosystemSection />

      {/* SECTION 09 — WHY VIP STUDIOS? */}
      <WhyVipSection />

      {/* SECTION 10 — CLIENT TESTIMONIALS */}
      <TestimonialsSection />

      {/* SECTION 11 — OUR TEAM */}
      <TeamSection />

      {/* SECTION 12 — FAQ */}
      <FaqAccordion />

      {/* SECTION 13 — PROJECT ENQUIRY FORM */}
      <LeadCaptureForm />

      {/* SECTION 14 — FINAL CTA */}
      <section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#121212] border-t border-[#1E1E1E] text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFD21C] block mb-3">
            TAKE THE NEXT STEP
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display mb-4">
            Ready to Take Your Brand <br />
            <span className="text-[#FFD21C]">Seriously on Social Media?</span>
          </h2>
          <p className="text-base text-[#A1A1AA] max-w-xl mx-auto font-sans leading-relaxed mb-8">
            Let&apos;s create content that represents your brand, builds credibility, and connects with the right audience.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#enquiry"
              className="button button-gold py-4 px-8 text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-[0_0_25px_rgba(255,210,28,0.35)]"
            >
              <span>Start Your Project</span>
              <ArrowUpRight size={15} />
            </a>

            {whatsAppHref && (
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noreferrer"
                className="button button-outline py-4 px-7 text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:border-[#25D366] hover:text-[#25D366]"
              >
                <MessageCircle size={16} className="text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Cinema Preview Modal */}
      <CinemaModal
        isOpen={Boolean(previewProject)}
        onClose={() => setPreviewProject(null)}
        project={previewProject}
      />
    </div>
  );
}
