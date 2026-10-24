import { ArrowRight, Check, MoveUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { getWhatsAppHref } from "../data/contact.js";
import { projects as conceptProjects } from "../data/projects.js";
import { contentJourney, serviceOfferings } from "../data/services.js";
import ProjectCard from "../components/ProjectCard.jsx";
import usePublishedProjects from "../hooks/usePublishedProjects.js";

const routeOptions = [
  { eyebrow: "01 / Make", title: "I need a film, edit or campaign.", service: "Video Editing", tone: "coral" },
  { eyebrow: "02 / Build", title: "I need a consistent content system.", service: "Content Creation", tone: "lavender" },
  { eyebrow: "03 / Grow", title: "I need a stronger digital presence.", service: "Digital Growth", tone: "mint" },
];

function reveal(reduceMotion, delay = 0) {
  return {
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.16 },
    transition: { delay: reduceMotion ? 0 : delay, duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] },
  };
}

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const { projects, isLoading, error } = usePublishedProjects();
  const work = (projects.length ? projects : conceptProjects).slice(0, 3);
  const whatsapp = getWhatsAppHref("Hi VIP StudioS, I have a content project to discuss.");

  return (
    <div className="new-home">
      <section className="new-hero" aria-labelledby="new-home-title">
        <div className="new-hero-grid">
          <div className="new-hero-copy">
            <motion.p className="new-kicker" {...reveal(reduceMotion)}>VIP STUDIOS / CREATIVE PARTNER</motion.p>
            <motion.h1 id="new-home-title" {...reveal(reduceMotion, .06)}>
              Make your next
              <span>frame matter.</span>
            </motion.h1>
            <motion.p className="new-hero-lede" {...reveal(reduceMotion, .12)}>
              Video, content and digital support for brands that want their
              ideas to land with clarity.
            </motion.p>
            <motion.div className="new-hero-actions" {...reveal(reduceMotion, .18)}>
              <Link className="new-button new-button-dark" to="/contact">Start with a brief <ArrowRight aria-hidden="true" size={16} /></Link>
              <Link className="new-text-link" to="/work">See selected work <MoveUpRight aria-hidden="true" size={16} /></Link>
            </motion.div>
          </div>
          <motion.div className="new-hero-art" {...reveal(reduceMotion, .1)}>
            <div className="new-hero-number">01</div>
            <div className="new-hero-image new-hero-image-main">
              <img alt={work[0].imageAlt} height="1000" src={work[0].image} width="1200" />
            </div>
            <div className="new-hero-image new-hero-image-small">
              <img alt={work[1]?.imageAlt || work[0].imageAlt} height="800" loading="lazy" src={work[1]?.image || work[0].image} width="900" />
            </div>
            <span className="new-hero-sticker">Ideas<br />into motion.</span>
          </motion.div>
        </div>
        <div className="new-hero-bottom">
          <span>Scroll to choose your route</span>
          <span className="new-hero-rule" />
          <span>Social / Video / Digital</span>
        </div>
      </section>

      <motion.section className="new-route-section" aria-labelledby="route-title" {...reveal(reduceMotion)}>
        <div className="new-section-head">
          <div>
            <p className="new-kicker">Start where the need is</p>
            <h2 id="route-title">What are you<br /><em>trying to make happen?</em></h2>
          </div>
          <p>Choose the closest fit. Your enquiry can still cover more than one service.</p>
        </div>
        <div className="new-route-grid">
          {routeOptions.map((route) => (
            <Link className={`new-route-card new-route-card-${route.tone}`} key={route.service} to={`/contact?service=${encodeURIComponent(route.service)}`}>
              <span>{route.eyebrow}</span>
              <h3>{route.title}</h3>
              <span className="new-route-arrow"><ArrowRight aria-hidden="true" size={18} /></span>
            </Link>
          ))}
        </div>
      </motion.section>

      <motion.section className="new-work-section" aria-labelledby="new-work-title" {...reveal(reduceMotion)}>
        <div className="new-section-head new-section-head-work">
          <div>
            <p className="new-kicker">Proof, not promises</p>
            <h2 id="new-work-title">A few frames<br /><em>from the studio.</em></h2>
          </div>
          <Link className="new-text-link" to="/work">Open the full library <MoveUpRight aria-hidden="true" size={16} /></Link>
        </div>
        {error && <p className="studio-content-error" role="alert">Project work could not be loaded: {error}</p>}
        {isLoading && <p aria-live="polite" className="studio-content-loading">Loading project work…</p>}
        {!isLoading && <div className="new-work-grid">{work.map((project, index) => <ProjectCard key={project.slug} index={index} project={project} />)}</div>}
      </motion.section>

      <motion.section className="new-system-section" aria-labelledby="system-title" {...reveal(reduceMotion)}>
        <div className="new-system-intro">
          <p className="new-kicker">The operating idea</p>
          <h2 id="system-title">One clear story.<br /><em>Many useful outputs.</em></h2>
          <p>We help connect the thinking, making and follow-through so every piece of content has a job to do.</p>
          <Link className="new-button new-button-light" to="/services">Explore the services <ArrowRight aria-hidden="true" size={16} /></Link>
        </div>
        <ol className="new-system-list">
          {contentJourney.slice(0, 4).map((step, index) => (
            <li key={step.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{step.label}</h3><p>{step.detail}</p></div>
              <Check aria-hidden="true" size={18} />
            </li>
          ))}
        </ol>
      </motion.section>

      <motion.section className="new-proof-section" aria-labelledby="proof-title" {...reveal(reduceMotion)}>
        <div className="new-proof-card">
          <div>
            <p className="new-kicker">A better first conversation</p>
            <h2 id="proof-title">Bring the rough idea.<br /><em>Leave with a next step.</em></h2>
          </div>
          <div className="new-proof-points">
            <p><Check aria-hidden="true" size={17} /> No fixed package required</p>
            <p><Check aria-hidden="true" size={17} /> Scope agreed before work begins</p>
            <p><Check aria-hidden="true" size={17} /> Email draft or WhatsApp, your choice</p>
          </div>
          <div className="new-proof-actions">
            <Link className="new-button new-button-dark" to="/contact">Build your brief <ArrowRight aria-hidden="true" size={16} /></Link>
            {whatsapp && <a className="new-text-link" href={whatsapp} rel="noreferrer" target="_blank">Open WhatsApp <MoveUpRight aria-hidden="true" size={16} /></a>}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
