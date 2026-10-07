import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
  Layers3,
  Play,
  Scissors,
  Video,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects.js";

const frames = [
  { id: "social", label: "Social", icon: Layers3, project: projects[0] },
  { id: "shoot", label: "Shoot", icon: Video, project: projects[3] },
  { id: "edit", label: "Edit", icon: Scissors, project: projects[2] },
];

export default function HeroReel() {
  const [active, setActive] = useState(frames[1]);
  const reduceMotion = useReducedMotion();
  const Icon = active.icon;

  return (
    <section aria-labelledby="home-title" className="vip-hero">
      <div className="vip-hero-copy">
        <p className="vip-eyebrow">VIP STUDIOS · CREATIVE PRODUCTION</p>
        <h1 id="home-title">
          VIP STUDIOS
          <br />
          <span>Crafting visual stories that move.</span>
        </h1>
        <p className="vip-hero-intro">
          We create videos and content that help ambitious brands look sharper,
          sound clearer and move people to act.
        </p>
        <div className="vip-hero-actions">
          <Link className="button button-gold" to="/work">
            View our work <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
          <Link className="vip-secondary-link" to="/contact">
            Start a project <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <p className="vip-hero-journey">FILM <i /> EDIT <i /> DESIGN <i /> DELIVER</p>
      </div>

      <div className="vip-hero-visual">
        <div className="vip-hero-image">
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              alt={active.project.imageAlt}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.025 }}
              fetchPriority="high"
              initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
              key={active.id}
              loading="eager"
              src={active.project.image}
              style={{ objectPosition: active.project.imagePosition }}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
          </AnimatePresence>
          <div aria-hidden="true" className="vip-hero-image-shade" />
          <span className="vip-hero-image-label">
            <Icon aria-hidden="true" size={15} /> Concept visual · not client work
          </span>
          <span className="vip-hero-image-title">{active.project.title}</span>
          <span className="vip-hero-image-index">
            0{frames.indexOf(active) + 1} / 03
          </span>
        </div>
        <div
          aria-label="Explore social media, video shooting and editing concept visuals"
          className="vip-hero-controls"
          role="group"
        >
          {frames.map((frame, index) => {
            const FrameIcon = frame.icon;
            return (
              <button
                aria-pressed={active.id === frame.id}
                className={`vip-hero-control${active.id === frame.id ? " is-active" : ""}`}
                key={frame.id}
                onClick={() => setActive(frame)}
                type="button"
              >
                <span>0{index + 1}</span>
                <FrameIcon aria-hidden="true" size={15} />
                {frame.label}
              </button>
            );
          })}
        </div>
        <p className="vip-hero-disclosure">
          <Play aria-hidden="true" size={13} />
          Illustrative stock imagery, not a studio showreel
        </p>
      </div>
      <a className="vip-scroll-cue" href="#studio-proof">
        Scroll to explore <ArrowDown aria-hidden="true" size={14} />
      </a>
    </section>
  );
}
