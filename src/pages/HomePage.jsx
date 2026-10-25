import { useState } from "react";
import {
  ArrowUpRight,
  Camera,
  Clapperboard,
  Film,
  Instagram,
  Mic2,
  Scissors,
  TrendingUp,
  Volume2,
  Youtube,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import HeroReel from "../components/HeroReel.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import CinemaModal from "../components/CinemaModal.jsx";
import { getWhatsAppHref } from "../data/contact.js";
import { serviceOfferings } from "../data/services.js";
import usePublishedProjects from "../hooks/usePublishedProjects.js";
import { EditRazorIcon } from "../components/StudioGraphics.jsx";

const serviceIcons = [Instagram, Camera, Scissors, Mic2, Youtube, Clapperboard, TrendingUp, Film];

function revealProps(reduceMotion, delay = 0) {
  return {
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: {
      delay: reduceMotion ? 0 : delay,
      duration: reduceMotion ? 0 : 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  };
}

const faqs = [
  {
    question: "What creative editing services does VIP STUDIOS provide?",
    answer:
      "We provide professional video editing, high-retention vertical Reels and TikToks, long-form YouTube channel production, multi-camera podcast editing, corporate films, color grading in DaVinci Resolve, and complete audio mastering.",
  },
  {
    question: "Can I book a single project or video edit?",
    answer:
      "Yes. You can book a standalone video edit, a batch campaign of short-form reels, or an ongoing monthly editing partnership. Deliverables, formats, and turnarounds are agreed upon before cutting begins.",
  },
  {
    question: "What is your turnaround time for rough cuts and revisions?",
    answer:
      "Standard turnarounds are 48 to 72 hours for first rough cuts depending on footage volume. We provide frame-accurate review links with timestamped feedback to make revisions fast and frictionless.",
  },
  {
    question: "How do we send our footage and get started?",
    answer:
      "You can send footage via Google Drive, Dropbox, Frame.io, or WeTransfer. Submit your project details through our contact form or message our studio directly on WhatsApp to get started immediately.",
  },
];

function FaqSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      type="application/ld+json"
    />
  );
}

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const [previewProject, setPreviewProject] = useState(null);
  const { projects: publishedProjects, isLoading, error } = usePublishedProjects();
  const featuredProjects = publishedProjects.filter((project) => project.featured);
  const homeProjects = (featuredProjects.length > 0 ? featuredProjects : publishedProjects).slice(0, 4);
  const whatsAppHref = getWhatsAppHref(
    "Hi VIP StudioS, I'd like to discuss a video editing or creative content project.",
  );

  return (
    <div className="vip-home">
      <FaqSchema />
      <HeroReel projects={homeProjects} />

      {/* Cinematic Trust Band */}
      <section aria-label="Studio verified track record" className="studio-stats-band bg-[#F4F1FF] border-y border-[#EAE6E0]">
        <div className="vip-section-shell">
          <div className="studio-stats-grid">
            <div className="studio-stat-item">
              <span className="studio-stat-number">6<span>+</span></span>
              <span className="studio-stat-label">Years of Studio Craft</span>
            </div>
            <div className="studio-stat-item">
              <span className="studio-stat-number">1,000<span>+</span></span>
              <span className="studio-stat-label">Projects Mastered</span>
            </div>
            <div className="studio-stat-item">
              <span className="studio-stat-number">10<span>+</span></span>
              <span className="studio-stat-label">Editing Specialists</span>
            </div>
            <div className="studio-stat-item">
              <span className="studio-stat-number">12<span>+</span></span>
              <span className="studio-stat-label">Active Studio Partners</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED WORK — Editorial Project Board */}
      <motion.section
        {...revealProps(reduceMotion)}
        aria-labelledby="studio-work-title"
        className="vip-work"
        id="featured-cuts"
      >
        <div className="vip-section-shell">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#FF4D2D]" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF4D2D]">
                  PORTFOLIO SHOWCASE // RECENT CUTS
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight m-0" id="studio-work-title">
                Make the work the <span className="text-[#FF4D2D]">first conversation.</span>
              </h2>
            </div>
            <p className="vip-section-summary">
              Selected video edits engineered for high retention, narrative rhythm, and visual distinction.
            </p>
          </div>

          {error && (
            <p className="studio-content-error" role="alert">
              Project work could not be loaded: {error}
            </p>
          )}

          {isLoading && (
            <p aria-live="polite" className="studio-content-loading">
              Loading featured projects…
            </p>
          )}

          {!isLoading && !error && homeProjects.length === 0 && (
            <p className="studio-content-empty">
              No published projects yet.{" "}
              <Link to="/contact">Contact us to start your project.</Link>
            </p>
          )}

          {/* Balanced 2-Column Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {homeProjects.map((project, index) => (
              <ProjectCard
                index={index}
                key={project.slug}
                onPreviewCut={setPreviewProject}
                project={project}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <Link className="button button-dark" to="/work">
              View All Projects <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* STUDIO EDITING PHILOSOPHY */}
      <motion.section
        {...revealProps(reduceMotion)}
        aria-labelledby="studio-craft-title"
        className="py-20 bg-[#12101E] text-[#FFFDF8] relative overflow-hidden"
      >
        <div className="vip-section-shell">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FF4D2D] block mb-3">
                // STUDIO EDITING PHILOSOPHY
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-6 leading-tight" id="studio-craft-title">
                Editing is rhythm,
                <br />
                <span className="text-[#FF4D2D]">pacing and psychology.</span>
              </h2>
              <p className="text-[#B8B5C6] text-base leading-relaxed mb-6">
                Most video falls flat not because the camera was wrong, but because the edit lacked
                tension and purpose. At VIP STUDIOS, we treat every timeline as an emotional curve—shaping
                sound, speed ramps, and cutaways to hold viewer retention.
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-[#00E599]">
                <span className="flex items-center gap-1.5 bg-[#1C182E] px-3 py-1.5 rounded border border-white/10">
                  <EditRazorIcon className="text-[#FF4D2D]" size={14} />
                  PRECISION PACING
                </span>
                <span className="flex items-center gap-1.5 bg-[#1C182E] px-3 py-1.5 rounded border border-white/10">
                  <Volume2 className="text-[#635BFF]" size={14} />
                  CUSTOM SOUND DESIGN
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-xl bg-[#1C182E]/80 border border-white/10 backdrop-blur-sm">
                <span className="font-mono text-xl font-bold text-[#FF4D2D]">01</span>
                <h3 className="text-lg font-bold text-white mt-2 mb-2">The 3-Second Retention Hook</h3>
                <p className="text-sm text-[#B8B5C6] m-0 leading-normal">
                  Opening frames engineered with immediate visual payoff, sound punch, and motion to arrest the infinite scroll.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#1C182E]/80 border border-white/10 backdrop-blur-sm">
                <span className="font-mono text-xl font-bold text-[#635BFF]">02</span>
                <h3 className="text-lg font-bold text-white mt-2 mb-2">DaVinci Color Calibration</h3>
                <p className="text-sm text-[#B8B5C6] m-0 leading-normal">
                  Cinema-grade color grading that sets an ownable visual tone, matching skin tones and mood across varied lighting.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#1C182E]/80 border border-white/10 backdrop-blur-sm">
                <span className="font-mono text-xl font-bold text-[#00E599]">03</span>
                <h3 className="text-lg font-bold text-white mt-2 mb-2">Multi-Track Sound Design</h3>
                <p className="text-sm text-[#B8B5C6] m-0 leading-normal">
                  Audio accounts for 50% of the cinematic experience. We build custom whooshes, risers, and dialogue EQ that feel visceral.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#1C182E]/80 border border-white/10 backdrop-blur-sm">
                <span className="font-mono text-xl font-bold text-[#FFB800]">04</span>
                <h3 className="text-lg font-bold text-white mt-2 mb-2">Multi-Format Delivery</h3>
                <p className="text-sm text-[#B8B5C6] m-0 leading-normal">
                  Exported specifically for YouTube 4K, 9:16 Instagram Reels, TikTok, and direct broadcast with calibrated bitrates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* STUDIO CAPABILITIES — 8 Specialized Services */}
      <motion.section
        {...revealProps(reduceMotion)}
        aria-labelledby="studio-services-title"
        className="vip-services"
        id="services"
      >
        <div className="vip-section-shell">
          <div className="vip-section-heading">
            <div>
              <p className="vip-eyebrow">Production &amp; Editing Suites</p>
              <h2 id="studio-services-title">
                Full-spectrum video craft,
                <br />
                <span>from capture to master.</span>
              </h2>
            </div>
            <p>
              Whether you need high-tempo short-form reels or full channel management,
              we bring editing rigor and creative vision to every deliverable.
            </p>
          </div>

          <div className="vip-service-grid">
            {serviceOfferings.map((service, index) => {
              const Icon = serviceIcons[index] || Scissors;
              const specs = [
                "9:16 + 16:9",
                "4K Master",
                "Color + Audio",
                "Multi-Cam",
                "Full Management",
                "Fast Turnaround",
                "High Retention",
                "Brand Consistency",
              ][index % 8];

              return (
                <motion.div
                  {...revealProps(reduceMotion, index * 0.045)}
                  key={service.slug}
                >
                  <Link
                    className="vip-service-card group"
                    to={`/services/${service.slug}`}
                  >
                    <div className="vip-service-card-top">
                      <span className="font-mono text-xs font-bold text-[#635BFF]">
                        SUITE {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#F5F3FF] text-[#12101E] border border-[#635BFF]/20">
                        {specs}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F5F3FF] text-[#FF4D2D] flex items-center justify-center transition-colors group-hover:bg-[#FF4D2D] group-hover:text-white">
                        <Icon size={20} />
                      </div>
                      <h3 className="m-0 text-xl font-bold tracking-tight">{service.title}</h3>
                    </div>

                    <p>{service.shortDescription}</p>

                    <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-[#E8E4DC]">
                      {service.scope.slice(0, 3).map((item) => (
                        <span
                          className="font-mono text-[10px] text-[#5C586B] bg-[#FCFBF8] px-2 py-0.5 rounded border border-[#E8E4DC]"
                          key={item}
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <span className="vip-service-link mt-4">
                      Inspect Suite Details <ArrowUpRight aria-hidden="true" size={15} />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-between items-center flex-wrap gap-4 pt-4 border-t border-[#E8E4DC]">
            <span className="font-mono text-xs text-[#5C586B]">
              ALL SUITES INCLUDE AUDIO MASTERING &amp; UNLIMITED FRAME-ACCURATE REVIEWS
            </span>
            <Link className="vip-inline-link font-mono text-sm font-bold uppercase" to="/services">
              Explore All Suites <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* THE EDITING WORKFLOW — Timeline Pipeline */}
      <motion.section
        {...revealProps(reduceMotion)}
        aria-labelledby="studio-pipeline-title"
        className="vip-process"
        id="process"
      >
        <div className="vip-section-shell">
          <div className="vip-section-heading">
            <div>
              <p className="vip-eyebrow">The Cutting Pipeline</p>
              <h2 id="studio-pipeline-title">
                From raw ingest
                <br />
                <span>to locked master.</span>
              </h2>
            </div>
            <p>
              A dependable production workflow designed for speed, frame-level precision,
              and seamless client collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-12">
            {[
              {
                step: "01",
                label: "INGEST & DISCOVERY",
                timing: "DAY 01",
                title: "Footage Ingest & Story Sync",
                desc: "We analyze your raw clips, organize bins, sync audio, and align on visual references and rhythm.",
              },
              {
                step: "02",
                label: "THE ASSEMBLY",
                timing: "DAY 02",
                title: "Narrative Assembly & Rough Cut",
                desc: "We build the core pacing curve, trimming dead air and locking the story before styling.",
              },
              {
                step: "03",
                label: "COLOR & SOUND",
                timing: "DAY 03",
                title: "DaVinci Color & Audio Mix",
                desc: "Dialogue cleanup, music ducking, SFX foley, and cinema-grade color balance applied to every shot.",
              },
              {
                step: "04",
                label: "FINAL MASTER",
                timing: "DAY 04",
                title: "4K Master Delivery & Formats",
                desc: "Platform-optimized exports delivered with frame accuracy, subtitles, and clean thumbnail grabs.",
              },
            ].map((stage) => (
              <div
                className="p-6 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm relative flex flex-col justify-between"
                key={stage.step}
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-xs mb-4">
                    <span className="font-bold text-[#FF4D2D]">{stage.step} // STAGE</span>
                    <span className="px-2 py-0.5 rounded bg-[#F5F3FF] text-[#635BFF] font-bold">
                      {stage.timing}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight mb-2">{stage.title}</h3>
                  <p className="text-sm text-[#5C586B] leading-relaxed mb-6">{stage.desc}</p>
                </div>
                <div className="pt-4 border-t border-[#E8E4DC] font-mono text-[11px] text-[#12101E] font-bold flex items-center justify-between">
                  <span>{stage.label}</span>
                  <span className="text-[#FF4D2D]">✓</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Link className="vip-inline-link font-mono text-sm font-bold uppercase" to="/process">
              Read Detailed Workflow &amp; Delivery SLA <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <motion.section
        {...revealProps(reduceMotion)}
        aria-labelledby="studio-faq-title"
        className="vip-faq bg-[#FCFBF8]"
      >
        <div className="vip-section-shell vip-faq-layout">
          <div>
            <p className="vip-eyebrow">Studio Transparency</p>
            <h2 id="studio-faq-title">
              Clear answers,
              <br />
              <span>zero friction.</span>
            </h2>
            <p>Everything you need to know about working with VIP STUDIOS before starting your project.</p>
          </div>
          <div className="vip-faq-list">
            {faqs.map(({ question, answer }) => (
              <details key={question}>
                <summary>{question}<span aria-hidden="true">+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CLOSING CINEMATIC CTA */}
      <motion.section
        {...revealProps(reduceMotion)}
        aria-labelledby="studio-cta-title"
        className="vip-cta"
      >
        <div className="vip-section-shell vip-cta-inner bg-[#12101E] text-white">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D2D] animate-ping" />
              <p className="vip-eyebrow text-[#FF4D2D] m-0">START YOUR PROJECT</p>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight" id="studio-cta-title">
              Let&apos;s make something
              <br />
              <span className="text-[#FF4D2D]">worth watching.</span>
            </h2>
            <p className="text-lg text-white/70 max-w-xl">
              Have footage ready to edit, or planning your next campaign?
              Share your brief and let&apos;s engineer a visual cut that drives engagement.
            </p>
          </div>
          <div className="vip-cta-actions">
            <Link className="button button-gold text-base py-4 px-8" to="/contact">
              Start Your Project <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
            {whatsAppHref && (
              <a
                className="vip-dark-link font-mono text-sm uppercase tracking-wider text-center"
                href={whatsAppHref}
                rel="noreferrer"
                target="_blank"
              >
                Instant WhatsApp Brief <ArrowUpRight aria-hidden="true" size={14} />
              </a>
            )}
          </div>
        </div>
      </motion.section>

      {/* Lightbox Cinema Preview Modal */}
      <CinemaModal
        isOpen={Boolean(previewProject)}
        onClose={() => setPreviewProject(null)}
        project={previewProject}
      />
    </div>
  );
}
