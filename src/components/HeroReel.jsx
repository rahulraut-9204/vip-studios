import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects.js";

const moments = [
  {
    id: "social",
    label: "Social",
    detail: "Plan the presence",
    image: projects[0],
  },
  {
    id: "shoot",
    label: "Shoot",
    detail: "Capture the moment",
    image: projects[3],
  },
  {
    id: "edit",
    label: "Edit",
    detail: "Shape the final cut",
    image: projects[2],
  },
];

const spring = { type: "spring", stiffness: 120, damping: 22 };

export default function HeroReel() {
  const [activeMoment, setActiveMoment] = useState(moments[1]);
  const reduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="home-title" className="hero-reel page-gutter">
      <div className="hero-composition">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="hero-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          transition={reduceMotion ? { duration: 0 } : { ...spring, delay: 0.08 }}
        >
          <h1 id="home-title">
            Stories,
            <br />
            <span>in motion.</span>
          </h1>
          <p className="hero-offer">
            We plan and manage your social presence, then produce the video
            that brings your ideas to life—from shoot to final edit.
          </p>
          <div className="hero-actions">
            <Link className="button button-gold" to="/contact">
              Plan a project <ArrowUpRight aria-hidden="true" size={17} />
            </Link>
            <Link className="text-link" to="/services">
              Explore services <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <div className="hero-promise">
            <span aria-hidden="true" className="hero-promise-mark" />
            <p>One creative partner, from the first plan to the final post.</p>
          </div>
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
                transition={{
                  duration: reduceMotion ? 0 : 0.42,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </AnimatePresence>
            <span aria-hidden="true" className="reel-flash" />
            <div aria-live="polite" className="reel-caption">
              <span>ILLUSTRATIVE CONCEPT / NOT CLIENT WORK</span>
              <strong>{activeMoment.image.title}</strong>
            </div>
            <span aria-hidden="true" className="reel-frame-index">
              V/S — 01
            </span>
          </div>

          <div
            aria-label="Explore our services"
            className="reel-controls"
            role="group"
          >
            {moments.map((moment, index) => (
              <button
                aria-pressed={activeMoment.id === moment.id}
                className={`reel-control${activeMoment.id === moment.id ? " is-active" : ""}`}
                key={moment.id}
                onClick={() => setActiveMoment(moment)}
                type="button"
              >
                <img alt="" className="reel-control-image" src={moment.image.image} />
                <span className="reel-control-copy">
                  <span className="reel-control-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="reel-control-label">{moment.label}</span>
                  <span className="reel-control-detail">{moment.detail}</span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="reel-control-arrow"
                  size={15}
                />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="hero-base">
        <span>STRATEGY</span>
        <span aria-hidden="true">/</span>
        <span>SHOOT</span>
        <span aria-hidden="true">/</span>
        <span>EDIT</span>
        <span aria-hidden="true">/</span>
        <span>PUBLISH</span>
        <span className="hero-base-rule" />
        <Link to="/services">
          How we work <ArrowUpRight aria-hidden="true" size={15} />
        </Link>
      </div>
    </section>
  );
}
