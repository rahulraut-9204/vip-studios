import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroReel() {
  const reduceMotion = useReducedMotion();
  const entrance = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <section aria-labelledby="home-title" className="vip-hero">
      <div className="vip-hero-copy">
        <motion.p
          className="vip-eyebrow"
          initial="hidden"
          animate="visible"
          variants={entrance}
          transition={{ duration: reduceMotion ? 0 : 0.3, delay: 0 }}
        >
          CREATIVE STUDIO
        </motion.p>
        <motion.h1
          id="home-title"
          initial="hidden"
          animate="visible"
          variants={entrance}
          transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0.08 }}
        >
          VIP STUDIOS
        </motion.h1>
        <motion.p
          className="vip-hero-intro"
          initial="hidden"
          animate="visible"
          variants={entrance}
          transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0.16 }}
        >
          We create videos and content that help ambitious brands look sharper,
          sound clearer and move people to act.
        </motion.p>
        <motion.div
          className="vip-hero-actions"
          initial="hidden"
          animate="visible"
          variants={entrance}
          transition={{ duration: reduceMotion ? 0 : 0.4, delay: 0.24 }}
        >
          <Link className="button button-gold" to="/work">
            View our work <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
          <Link className="button button-outline" to="/contact">
            Start a project <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </motion.div>
      </div>

      <a className="vip-scroll-cue" href="#services">
        Scroll to explore <ArrowDown aria-hidden="true" size={14} />
      </a>
    </section>
  );
}
