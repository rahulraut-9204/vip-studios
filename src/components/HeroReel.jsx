import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Layers3, Play, Scissors, Video } from "lucide-react";
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
    <section aria-labelledby="home-title" className="studio-hero studio-route-stop" data-route-stop="Start">
      <div className="studio-hero-copy">
        <p className="studio-location">SOCIAL MEDIA & VIDEO STUDIO · PUNE</p>
        <h1 id="home-title">
          Social media.
          <br />
          <span>Shot &amp; edited.</span>
        </h1>
        <p className="studio-hero-intro">
          We manage social accounts and create the video content around them —
          from planning and shoots to professional editing and publishing.
          Based in Pune, working across India.
        </p>
        <div className="studio-hero-actions">
          <Link className="button button-gold" to="/contact">
            Discuss your project <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
          <Link className="studio-text-link" to="/services">
            Explore services <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <p className="studio-hero-services">
          Social media management <i /> Video shoots <i /> Professional editing
        </p>
      </div>

      <div className="studio-hero-art">
        <div className="studio-frame-stamp">
          <span>V/S</span>
          <span>CONTENT / STUDY 01</span>
        </div>
        <div className="studio-frame-master">
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              alt={active.project.imageAlt}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.025 }}
              initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
              key={active.id}
              loading="eager"
              fetchPriority="high"
              src={active.project.image}
              style={{ objectPosition: active.project.imagePosition }}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
          </AnimatePresence>
          <div className="studio-frame-shade" />
          <div className="studio-frame-caption">
            <span><Icon aria-hidden="true" size={15} /> CONCEPT VISUAL · NOT CLIENT WORK</span>
            <strong>{active.project.title}</strong>
          </div>
          <span className="studio-frame-index">00{frames.indexOf(active) + 1} / 03</span>
          <span aria-hidden="true" className="studio-frame-crosshair studio-crosshair-one" />
          <span aria-hidden="true" className="studio-frame-crosshair studio-crosshair-two" />
          <div aria-label="Illustrative concept shown in landscape, vertical and square crops" className="studio-export-stamps">
            <span>LANDSCAPE</span>
            <span>VERTICAL</span>
            <span>SQUARE</span>
          </div>
        </div>

        <div aria-label="Explore the connected services" className="studio-frame-controls" role="group">
          {frames.map((frame, index) => {
            const FrameIcon = frame.icon;
            return (
              <button
                aria-pressed={active.id === frame.id}
                className={`studio-frame-control${active.id === frame.id ? " is-active" : ""}`}
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
        <p className="studio-frame-footnote">
          <Play aria-hidden="true" size={13} /> A visual study, not a showreel
        </p>
      </div>
    </section>
  );
}
