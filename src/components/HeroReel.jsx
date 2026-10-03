import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects.js";

const moments = [
  { id: "social", label: "Social", image: projects[0] },
  { id: "shoot", label: "Shoot", image: projects[3] },
  { id: "edit", label: "Edit", image: projects[2] },
];

const spring = { type: "spring", stiffness: 120, damping: 22 };

export default function HeroReel() {
  const [activeMoment, setActiveMoment] = useState(moments[1]);
  const reduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="home-title" className="hero-reel page-gutter">
      <div className="hero-orbit" aria-hidden="true" />
      <div className="hero-overline">
        <span>VIP StudioS</span>
        <span>Social, shot &amp; edited.</span>
      </div>

      <div className="hero-composition">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="hero-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          transition={reduceMotion ? { duration: 0 } : { ...spring, delay: 0.08 }}
        >
          <h1 id="home-title">
            Make your
            <br />
            feed <span>move.</span>
          </h1>
          <p className="hero-offer">
            Social strategy, content planning, publishing and account
            management—paired with video shoots and professional editing.
          </p>
          <div className="hero-actions">
            <Link className="button button-gold" to="/contact">
              Let&apos;s make something <ArrowUpRight aria-hidden="true" size={17} />
            </Link>
            <Link className="text-link" to="/services">
              Explore what we do <ArrowDown aria-hidden="true" size={16} />
            </Link>
          </div>
          <p className="hero-note">
            A consistent, considered presence—without promises of overnight
            growth.
          </p>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          className="hero-reel-stage"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, rotate: 2.5 }}
          transition={reduceMotion ? { duration: 0 } : { ...spring, delay: 0.18 }}
        >
          <div className="reel-frame">
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                alt={activeMoment.image.imageAlt}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.035 }}
                initial={reduceMotion ? false : { opacity: 0, scale: 1.055 }}
                key={activeMoment.id}
                loading="eager"
                fetchPriority="high"
                src={activeMoment.image.image}
                transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>
            <span aria-hidden="true" className="reel-flash" />
            <div aria-live="polite" className="reel-caption">
              <span>ILLUSTRATIVE CONCEPT / NOT CLIENT WORK</span>
              <strong>{activeMoment.image.title}</strong>
            </div>
            <span aria-hidden="true" className="reel-frame-mark reel-frame-mark-top" />
            <span aria-hidden="true" className="reel-frame-mark reel-frame-mark-bottom" />
          </div>

          <div aria-label="Explore our services" className="reel-controls" role="group">
            {moments.map((moment) => (
              <button
                aria-pressed={activeMoment.id === moment.id}
                className={`reel-control${activeMoment.id === moment.id ? " is-active" : ""}`}
                key={moment.id}
                onClick={() => setActiveMoment(moment)}
                type="button"
              >
                <span>{moment.label}</span>
                <span aria-hidden="true" className="reel-control-line" />
              </button>
            ))}
          </div>
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            className="hero-sticker"
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>STORY</span>
            <span>×</span>
            <span>STRATEGY</span>
          </motion.div>
        </motion.div>
      </div>

      <div className="hero-base">
        <span>STRATEGY / SHOOT / EDIT / PUBLISH</span>
        <span className="hero-base-rule" />
        <Link to="/services">
          One creative partner <ArrowUpRight aria-hidden="true" size={15} />
        </Link>
      </div>
    </section>
  );
}
