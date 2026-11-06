import { useState, useMemo } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Film,
  Instagram,
  Layers,
  Mail,
  MessageCircle,
  Mic2,
  Play,
  Repeat,
  Scissors,
  Share2,
  Sparkles,
  TrendingUp,
  Tv,
  Users,
  Video,
  Volume2,
  Youtube,
  Zap,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import HeroReel from "../components/HeroReel.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import CinemaModal from "../components/CinemaModal.jsx";
import { getWhatsAppHref, contactConfig } from "../data/contact.js";
import { serviceOfferings } from "../data/services.js";
import usePublishedProjects from "../hooks/usePublishedProjects.js";
import { CATEGORIES, BRAND_JOURNEY } from "../config/site.js";
import { isSupabaseConfigured, supabase } from "../lib/supabase.js";

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

function revealProps(reduceMotion, delay = 0) {
  return {
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 },
    transition: {
      delay: reduceMotion ? 0 : delay,
      duration: reduceMotion ? 0 : 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  };
}

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const [previewProject, setPreviewProject] = useState(null);
  const [portfolioCategory, setPortfolioCategory] = useState("All");

  // Ingest form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formService, setFormService] = useState("Video Production & Editing");
  const [formMessage, setFormMessage] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formFeedback, setFormFeedback] = useState("");

  const { projects: publishedProjects, isLoading, error } = usePublishedProjects();

  // Filterable Our Work
  const filteredProjects = useMemo(() => {
    if (portfolioCategory === "All") return publishedProjects;
    return publishedProjects.filter((p) => p.category === portfolioCategory);
  }, [publishedProjects, portfolioCategory]);

  const whatsAppHref = getWhatsAppHref(
    "Hi VIP StudioS, I'm interested in exploring a complete content and digital growth partnership."
  );

  async function handleContactSubmit(e) {
    e.preventDefault();
    if (formSubmitting) return;

    if (!formEmail && !formPhone) {
      setFormFeedback("Please provide at least an email or WhatsApp phone number.");
      return;
    }

    setFormSubmitting(true);
    setFormFeedback("");

    try {
      if (isSupabaseConfigured && supabase) {
        const { error: insertError } = await supabase.from("enquiries").insert({
          name: formName || "Prospective Partner",
          email: formEmail,
          phone: formPhone,
          service: formService,
          requirements: formMessage,
          status: "new",
        });
        if (insertError) throw insertError;
      }
      setFormSuccess(true);
    } catch (err) {
      setFormFeedback(err?.message || "Could not submit brief. Please connect via direct WhatsApp.");
    } finally {
      setFormSubmitting(false);
    }
  }

  return (
    <div className="vip-home bg-[#0A0A0A] text-white">
      {/* 1. Hero with Brand Message & CTAs */}
      <HeroReel projects={publishedProjects} />

      {/* 2. Credibility Statistics Band */}
      <section aria-label="Studio credibility statistics" className="py-14 bg-[#121212] border-y border-[#1E1E1E]" id="stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="p-6 rounded-xl bg-[#161616] border border-[#222222]">
              <span className="block font-display text-4xl sm:text-5xl font-black text-[#FFD21C] tracking-tight leading-none mb-2">
                6+
              </span>
              <strong className="block text-white text-base font-display font-bold mb-1">
                Years of Experience
              </strong>
              <span className="text-xs text-[#A1A1AA] font-sans">
                Hands-on video editing, post-production &amp; brand positioning.
              </span>
            </div>

            <div className="p-6 rounded-xl bg-[#161616] border border-[#222222]">
              <span className="block font-display text-4xl sm:text-5xl font-black text-[#FFD21C] tracking-tight leading-none mb-2">
                10+
              </span>
              <strong className="block text-white text-base font-display font-bold mb-1">
                Team Members
              </strong>
              <span className="text-xs text-[#A1A1AA] font-sans">
                Specialized editors, colorists, sound designers &amp; strategists.
              </span>
            </div>

            <div className="p-6 rounded-xl bg-[#161616] border border-[#222222]">
              <span className="block font-display text-4xl sm:text-5xl font-black text-[#FFD21C] tracking-tight leading-none mb-2">
                12+
              </span>
              <strong className="block text-white text-base font-display font-bold mb-1">
                Active Clients
              </strong>
              <span className="text-xs text-[#A1A1AA] font-sans">
                Long-term retained creators, corporate leaders &amp; growth partners.
              </span>
            </div>

            <div className="p-6 rounded-xl bg-[#161616] border border-[#222222]">
              <span className="block font-display text-4xl sm:text-5xl font-black text-[#FFD21C] tracking-tight leading-none mb-2">
                1,000+
              </span>
              <strong className="block text-white text-base font-display font-bold mb-1">
                Projects Delivered
              </strong>
              <span className="text-xs text-[#A1A1AA] font-sans">
                4K commercial cuts, high-retention reels &amp; documentary masters.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services Overview Covering Full Range & Growth Journey */}
      <motion.section
        {...revealProps(reduceMotion)}
        aria-labelledby="services-title"
        className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        id="services"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FFD21C]" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFD21C]">
                FULL-SERVICE CREATIVE &amp; GROWTH PARTNER
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white m-0 font-display" id="services-title">
              Complete Content, Social Media &amp; <span className="text-[#FFD21C]">Digital Growth.</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#A1A1AA] max-w-md m-0 font-sans leading-relaxed">
            Not just a posting agency. We engineer end-to-end production pipelines built to capture audience attention and scale revenue.
          </p>
        </div>

        {/* Brand Journey Bar */}
        <div className="mb-12 p-4 sm:p-5 rounded-xl bg-[#141414] border border-[#222222]">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#FFD21C] block mb-2">
            THE COMPLETE JOURNEY WE GUIDE YOU THROUGH
          </span>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-display font-bold">
            {BRAND_JOURNEY.map((step, idx) => (
              <span className="inline-flex items-center gap-2" key={step}>
                <span className="px-3 py-1 rounded bg-[#1C1C1C] border border-[#2E2E2E] text-white hover:border-[#FFD21C] transition-colors">
                  {step}
                </span>
                {idx < BRAND_JOURNEY.length - 1 && (
                  <span className="text-[#FFD21C] font-mono text-xs">→</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* 8 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {serviceOfferings.map((service, index) => {
            const IconComponent = serviceIconsMap[service.slug] || Scissors;
            return (
              <div
                className="group p-6 rounded-xl bg-[#141414] border border-[#222222] hover:border-[#FFD21C]/60 transition-all flex flex-col justify-between"
                key={service.slug}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#1C1C1C] text-[#FFD21C] flex items-center justify-center border border-white/5 group-hover:bg-[#FFD21C] group-hover:text-[#0A0A0A] transition-colors">
                      <IconComponent size={20} />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-[#71717A] tracking-wider uppercase">
                      0{index + 1} // SUITE
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 font-display group-hover:text-[#FFD21C] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-4 font-sans">
                    {service.shortDescription}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#222222] mb-4">
                    {service.scope.slice(0, 3).map((item) => (
                      <span
                        className="font-mono text-[10px] text-[#A1A1AA] bg-[#1A1A1A] px-2 py-0.5 rounded border border-white/5"
                        key={item}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <Link
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#FFD21C] hover:underline"
                    to={`/services/${service.slug}`}
                  >
                    View Details <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-[#1E1E1E]">
          <span className="font-mono text-xs text-[#71717A]">
            FULL PRODUCTION &amp; POST-PRODUCTION SUITE WITH UNLIMITED REVISIONS
          </span>
          <Link className="button button-outline text-xs font-mono font-bold uppercase inline-flex items-center gap-2" to="/services">
            Explore All 8 Services <ArrowUpRight size={14} />
          </Link>
        </div>
      </motion.section>

      {/* 4. Filterable Our Work Portfolio */}
      <motion.section
        {...revealProps(reduceMotion)}
        aria-labelledby="portfolio-title"
        className="py-24 bg-[#121212] border-y border-[#1E1E1E]"
        id="portfolio"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#FFD21C]" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFD21C]">
                  SHOWCASE // CURATED WORK
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white m-0 font-display" id="portfolio-title">
                Our Work. <span className="text-[#FFD21C]">Crafted to Convert.</span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#A1A1AA] max-w-md m-0 font-sans leading-relaxed">
              Explore recent projects across social media campaigns, high-retention vertical reels, podcasts, YouTube series, and brand films.
            </p>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-[#1E1E1E]">
            {["All", ...CATEGORIES].map((cat) => {
              const isActive = portfolioCategory === cat;
              return (
                <button
                  className={`font-mono text-xs uppercase px-4 py-2 rounded-lg border transition-all cursor-pointer font-bold ${
                    isActive
                      ? "bg-[#FFD21C] text-[#0A0A0A] border-[#FFD21C] shadow-sm"
                      : "bg-[#161616] text-[#A1A1AA] border-[#222222] hover:text-white hover:border-[#333333]"
                  }`}
                  key={cat}
                  onClick={() => setPortfolioCategory(cat)}
                  type="button"
                >
                  {cat === "All" ? "ALL WORK" : cat}
                </button>
              );
            })}
          </div>

          {/* Highlight Callout: Direct Link to Brand Film Production */}
          <div className="mb-8 p-4 rounded-xl bg-[#161616] border border-[#FFD21C]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] animate-pulse" />
              <div>
                <strong className="block text-white text-sm font-display font-bold">
                  Featured Master Cut: Brand Film Production
                </strong>
                <span className="text-xs text-[#A1A1AA] font-sans">
                  Direct commercial link hosted on YouTube 4K.
                </span>
              </div>
            </div>
            <a
              className="button button-gold button-small inline-flex items-center gap-1.5"
              href="https://youtu.be/5ey7tP006cg?si=2XUdvaCgFEbLc06C"
              rel="noopener noreferrer"
              target="_blank"
            >
              Watch Brand Film <ArrowUpRight size={14} />
            </a>
          </div>

          {isLoading && (
            <div className="py-20 text-center font-mono text-sm text-[#A1A1AA]">
              <span className="inline-block animate-spin mr-2">●</span> Loading curated cuts…
            </div>
          )}

          {error && (
            <div className="py-12 text-center text-red-400 font-mono text-xs">
              Notice: Could not load dynamic cuts: {error}. Presenting curated offline archive.
            </div>
          )}

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                index={index}
                key={project.slug || index}
                onPreviewCut={setPreviewProject}
                project={project}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <Link className="button button-outline font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2" to="/work">
              View Complete Work Archive <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* 5. Reasons to Work with VIP StudioS */}
      <motion.section
        {...revealProps(reduceMotion)}
        aria-labelledby="reasons-title"
        className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        id="reasons"
      >
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FFD21C]" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFD21C]">
              THE VIP DIFFERENCE
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white m-0 font-display" id="reasons-title">
            Why Partner with <span className="text-[#FFD21C]">VIP StudioS.</span>
          </h2>
          <p className="text-base text-[#A1A1AA] mt-3 font-sans leading-relaxed">
            Content creation is broken when treated as isolated tasks. Here is how our coordinated model sets your brand apart:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-[#141414] border border-[#222222]">
            <span className="font-mono text-2xl font-black text-[#FFD21C] block mb-3">01</span>
            <h3 className="text-lg font-bold text-white mb-2 font-display">End-to-End Ownership</h3>
            <p className="text-sm text-[#A1A1AA] m-0 font-sans leading-relaxed">
              No disconnected freelancers. One synchronized team handles strategy, filming, editing, publishing, analytics, and growth.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#141414] border border-[#222222]">
            <span className="font-mono text-2xl font-black text-[#FFD21C] block mb-3">02</span>
            <h3 className="text-lg font-bold text-white mb-2 font-display">Retention Psychology</h3>
            <p className="text-sm text-[#A1A1AA] m-0 font-sans leading-relaxed">
              Every cut, speed ramp, and sound cue is calculated to stop the scroll, elevate watch time, and satisfy algorithm curves.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#141414] border border-[#222222]">
            <span className="font-mono text-2xl font-black text-[#FFD21C] block mb-3">03</span>
            <h3 className="text-lg font-bold text-white mb-2 font-display">Cinema-Grade Color &amp; Mix</h3>
            <p className="text-sm text-[#A1A1AA] m-0 font-sans leading-relaxed">
              Graded on calibrated monitors in DaVinci Resolve Studio with broadcast-level multi-track audio mastering.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#141414] border border-[#222222]">
            <span className="font-mono text-2xl font-black text-[#FFD21C] block mb-3">04</span>
            <h3 className="text-lg font-bold text-white mb-2 font-display">Built to Scale</h3>
            <p className="text-sm text-[#A1A1AA] m-0 font-sans leading-relaxed">
              Structured asset pipelines that allow your output to double or triple without sacrificing brand rigor or delivery speed.
            </p>
          </div>
        </div>
      </motion.section>

      {/* 6. Clear Six-Step Process */}
      <motion.section
        {...revealProps(reduceMotion)}
        aria-labelledby="process-title"
        className="py-24 bg-[#121212] border-y border-[#1E1E1E]"
        id="process"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#FFD21C]" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFD21C]">
                  METHODICAL EXECUTION
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white m-0 font-display" id="process-title">
                Our 6-Step <span className="text-[#FFD21C]">Growth Process.</span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#A1A1AA] max-w-md m-0 font-sans leading-relaxed">
              Discover, Strategy, Create, Edit, Publish, Optimize. A proven system that turns raw ideas into compounding brand performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                name: "Discover",
                tagline: "AUDIT & ALIGNMENT",
                desc: "We analyze your audience demographics, brand identity, competitors, and growth goals to identify immediate high-payoff opportunities.",
              },
              {
                step: "02",
                name: "Strategy",
                tagline: "CONTENT BLUEPRINT",
                desc: "We build your weekly editorial calendar, content pillars, viral retention hooks, and production formats tailored to target platforms.",
              },
              {
                step: "03",
                name: "Create",
                tagline: "SHOOT & INGEST",
                desc: "From creative scripting and lighting direction to camera shooting and raw media ingest, we capture pristine, high-fidelity footage.",
              },
              {
                step: "04",
                name: "Edit",
                tagline: "RHYTHM & FINISHING",
                desc: "Our editors assemble the narrative curve, craft bespoke sound foley, layer motion typography, and calibrate DaVinci color grading.",
              },
              {
                step: "05",
                name: "Publish",
                tagline: "PACKAGING & ROLLOUT",
                desc: "High-CTR custom thumbnails, SEO-optimized titles, hashtags, and multi-format exports (16:9 & 9:16) scheduled for maximum reach.",
              },
              {
                step: "06",
                name: "Optimize",
                tagline: "ANALYSIS & COMPOUNDING",
                desc: "We review retention graphs, click-through rates, and follower conversions, feeding data insights directly back into the next sprint.",
              },
            ].map((st) => (
              <div className="p-6 rounded-xl bg-[#161616] border border-[#222222] flex flex-col justify-between" key={st.step}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-[#FFD21C]">STEP {st.step}</span>
                    <span className="font-mono text-[10px] text-[#A1A1AA] px-2 py-0.5 rounded bg-white/5 border border-white/10 uppercase">
                      {st.tagline}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-display">{st.name}</h3>
                  <p className="text-sm text-[#A1A1AA] leading-relaxed m-0 font-sans">{st.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between text-xs font-mono text-[#71717A]">
                  <span>SYSTEM PHASE</span>
                  <span className="text-[#FFD21C]">✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 7. Visual Content & Platform Ecosystem */}
      <motion.section
        {...revealProps(reduceMotion)}
        aria-labelledby="ecosystem-title"
        className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        id="ecosystem"
      >
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FFD21C]" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFD21C]">
              MULTIPLIER ARCHITECTURE
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white m-0 font-display" id="ecosystem-title">
            The Content &amp; <span className="text-[#FFD21C]">Platform Ecosystem.</span>
          </h2>
          <p className="text-base text-[#A1A1AA] mt-3 font-sans leading-relaxed">
            How a single core master production is repurposed into an omnipresent digital engine across all major platforms:
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-[#141414] border border-[#222222]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Core Hub */}
            <div className="lg:col-span-4 p-6 rounded-xl bg-[#1C1C1C] border border-[#FFD21C]/40 text-center">
              <span className="font-mono text-xs font-bold uppercase text-[#FFD21C] tracking-widest block mb-2">
                CORE MASTER ASSET
              </span>
              <h3 className="text-2xl font-black text-white mb-2 font-display">
                Brand Film / Studio Podcast
              </h3>
              <p className="text-xs text-[#A1A1AA] m-0 font-sans mb-4">
                High-fidelity 4K recording with calibrated multi-track audio and multi-camera angles.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FFD21C]/10 text-[#FFD21C] font-mono text-xs font-bold">
                <Zap size={14} /> 1 PRODUCTION → 20+ ASSETS
              </div>
            </div>

            {/* Middle Divider */}
            <div className="hidden lg:flex lg:col-span-1 justify-center text-[#FFD21C] font-mono text-xl">
              →
            </div>

            {/* Right Cascading Outputs */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#181818] border border-[#2A2A2A]">
                <div className="flex items-center gap-2 mb-1.5 text-xs font-mono font-bold text-[#FFD21C]">
                  <Youtube size={15} /> YOUTUBE 4K MASTER
                </div>
                <p className="text-xs text-[#A1A1AA] m-0 font-sans">
                  Long-form episodic asset, chapter timestamps, custom high-CTR thumbnails &amp; SEO description.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#181818] border border-[#2A2A2A]">
                <div className="flex items-center gap-2 mb-1.5 text-xs font-mono font-bold text-[#FFD21C]">
                  <Instagram size={15} /> 10+ 9:16 VERTICAL REELS
                </div>
                <p className="text-xs text-[#A1A1AA] m-0 font-sans">
                  Fast-hook cutdowns engineered for Instagram Reels, TikTok, and YouTube Shorts algorithms.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#181818] border border-[#2A2A2A]">
                <div className="flex items-center gap-2 mb-1.5 text-xs font-mono font-bold text-[#FFD21C]">
                  <Share2 size={15} /> LINKEDIN &amp; SOCIAL CAROUSELS
                </div>
                <p className="text-xs text-[#A1A1AA] m-0 font-sans">
                  High-value quotes, data charts, and leadership snippets for executive authority building.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#181818] border border-[#2A2A2A]">
                <div className="flex items-center gap-2 mb-1.5 text-xs font-mono font-bold text-[#FFD21C]">
                  <TrendingUp size={15} /> CONVERSION PAID ADS
                </div>
                <p className="text-xs text-[#A1A1AA] m-0 font-sans">
                  Targeted short-form video ads optimized for customer acquisition and retargeting campaigns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 8. Workflow Strip & Team / About Section */}
      <section aria-label="Studio tools and team" className="py-20 bg-[#121212] border-t border-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Production Toolchain Strip */}
          <div className="mb-16 pb-12 border-b border-[#1E1E1E]">
            <p className="text-center font-mono text-xs uppercase tracking-widest text-[#71717A] mb-6">
              ENGINEERED ON INDUSTRY-STANDARD PRODUCTION TOOLCHAINS
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 font-mono text-xs font-bold text-[#A1A1AA]">
              <span className="hover:text-white transition-colors">DAVINCI RESOLVE STUDIO</span>
              <span className="text-white/20">/</span>
              <span className="hover:text-white transition-colors">ADOBE PREMIERE PRO</span>
              <span className="text-white/20">/</span>
              <span className="hover:text-white transition-colors">AFTER EFFECTS</span>
              <span className="text-white/20">/</span>
              <span className="hover:text-white transition-colors">SONY &amp; RED CINEMA DCI</span>
              <span className="text-white/20">/</span>
              <span className="hover:text-white transition-colors">4K DCI COLOR SCOPES</span>
            </div>
          </div>

          {/* Team / About Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#FFD21C]" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFD21C]">
                  ABOUT VIP STUDIOS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4 font-display">
                Editors, Directors &amp; <span className="text-[#FFD21C]">Growth Partners.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed mb-4 font-sans">
                Founded by passionate creative editors, VIP StudioS was created to bridge the gap between cinema-quality video production and data-driven business growth. We do not believe in superficial vanity posting—we believe in crafting visual stories that command attention, foster trust, and drive measurable revenue.
              </p>
              <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed mb-6 font-sans">
                Whether you need a dedicated editing room for daily short-form reels or an ongoing multi-channel digital growth partner, our team is equipped to scale with your ambitions.
              </p>
              <div className="flex items-center gap-4">
                <Link className="button button-gold text-xs font-mono uppercase font-bold" to="/about">
                  Learn More About Us <ArrowRight size={14} />
                </Link>
                <Link className="button button-outline text-xs font-mono uppercase font-bold" to="/process">
                  Our Workflows
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-[#161616] border border-[#222222]">
                <strong className="block text-white text-base font-bold font-display mb-1">
                  Editorial Craftsmanship
                </strong>
                <p className="text-xs text-[#A1A1AA] m-0 font-sans leading-relaxed">
                  Frame-accurate timing, bespoke audio ducking, and tailored visual hooks.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#161616] border border-[#222222]">
                <strong className="block text-white text-base font-bold font-display mb-1">
                  Strategic Distribution
                </strong>
                <p className="text-xs text-[#A1A1AA] m-0 font-sans leading-relaxed">
                  Tailored packaging for YouTube, Meta, TikTok, and professional networks.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#161616] border border-[#222222]">
                <strong className="block text-white text-base font-bold font-display mb-1">
                  Transparent Timelines
                </strong>
                <p className="text-xs text-[#A1A1AA] m-0 font-sans leading-relaxed">
                  Clear delivery SLAs, collaborative review stages, and zero hidden friction.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#161616] border border-[#222222]">
                <strong className="block text-white text-base font-bold font-display mb-1">
                  Ready to Scale
                </strong>
                <p className="text-xs text-[#A1A1AA] m-0 font-sans leading-relaxed">
                  Sprint models designed to scale output seamlessly as your business expands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Direct Contact Section */}
      <section aria-labelledby="contact-title" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="contact">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFD21C]">
                START A PROJECT // CONNECT DIRECTLY
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white m-0 mb-4 font-display" id="contact-title">
              Let&apos;s Build Something <span className="text-[#FFD21C]">Exceptional.</span>
            </h2>
            <p className="text-base text-[#A1A1AA] font-sans leading-relaxed mb-8">
              Share your project brief, footage scope, or growth goals. Our lead team will review your requirements and respond within 2 to 4 business hours.
            </p>

            <div className="flex flex-col gap-3 font-mono text-xs">
              <a
                className="p-4 rounded-xl bg-[#141414] border border-[#222222] hover:border-[#FFD21C] transition-colors flex items-center justify-between text-white"
                href="mailto:mr.rohit8530@gmail.com"
              >
                <span className="flex items-center gap-2.5">
                  <Mail className="text-[#FFD21C]" size={16} /> mr.rohit8530@gmail.com
                </span>
                <ArrowUpRight size={14} />
              </a>

              {whatsAppHref && (
                <a
                  className="p-4 rounded-xl bg-[#141414] border border-[#222222] hover:border-[#25D366] transition-colors flex items-center justify-between text-white"
                  href={whatsAppHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span className="flex items-center gap-2.5">
                    <MessageCircle className="text-[#25D366]" size={16} /> WhatsApp: +91 8530541815
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#25D366]/20 text-[#25D366] font-bold text-[10px]">
                    FAST CHAT
                  </span>
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#141414] border border-[#222222]">
            {formSuccess ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#FFD21C]/20 text-[#FFD21C] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 font-display">Brief Logged in Studio Desk!</h3>
                <p className="text-sm text-[#A1A1AA] max-w-md mx-auto mb-6">
                  Thank you, {formName || "Partner"}. Our lead director will review your project parameters and reach out promptly.
                </p>
                {whatsAppHref && (
                  <a className="button button-gold" href={whatsAppHref} rel="noreferrer" target="_blank">
                    <MessageCircle size={15} /> Instant WhatsApp Follow-up
                  </a>
                )}
              </div>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Your Name / Brand
                    </label>
                    <input
                      className="w-full bg-[#181818] border border-[#2A2A2A] focus:border-[#FFD21C] rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-sans"
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Alex Vance or Apex Brand"
                      required
                      type="text"
                      value={formName}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Service Category
                    </label>
                    <select
                      className="w-full bg-[#181818] border border-[#2A2A2A] focus:border-[#FFD21C] rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-colors font-sans"
                      onChange={(e) => setFormService(e.target.value)}
                      value={formService}
                    >
                      <option value="Social Media Management & Strategy">Social Media Management &amp; Strategy</option>
                      <option value="Video Production & Editing">Video Production &amp; Editing</option>
                      <option value="Reels & Short-Form Content">Reels &amp; Short-Form Content</option>
                      <option value="Podcast Production">Podcast Production</option>
                      <option value="YouTube Channel Management">YouTube Channel Management</option>
                      <option value="Content Creation">Content Creation</option>
                      <option value="Creative Branding">Creative Branding</option>
                      <option value="Digital Growth">Digital Growth</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      Email Address
                    </label>
                    <input
                      className="w-full bg-[#181818] border border-[#2A2A2A] focus:border-[#FFD21C] rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-mono"
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="alex@company.com"
                      type="email"
                      value={formEmail}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                      WhatsApp / Phone
                    </label>
                    <input
                      className="w-full bg-[#181818] border border-[#2A2A2A] focus:border-[#FFD21C] rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-mono"
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+91 00000 00000"
                      type="tel"
                      value={formPhone}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                    Project Goals / Raw Footage Details
                  </label>
                  <textarea
                    className="w-full bg-[#181818] border border-[#2A2A2A] focus:border-[#FFD21C] rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-sans"
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Tell us about your brand targets, footage volume, or timeline requirements..."
                    rows={3}
                    value={formMessage}
                  />
                </div>

                {formFeedback && (
                  <p className="text-xs font-mono text-[#FFD21C] m-0">{formFeedback}</p>
                )}

                <button
                  className="button button-gold w-full py-4 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                  disabled={formSubmitting}
                  type="submit"
                >
                  {formSubmitting ? "Connecting to Studio Queue…" : "Send Project Brief →"}
                </button>
              </form>
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
