import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import HeroReel from "../components/HeroReel.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import { projects } from "../data/projects.js";
import { contentJourney, serviceAreas } from "../data/services.js";

const spring = { type: "spring", stiffness: 120, damping: 22 };

export default function HomePage() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <HeroReel />

      <div aria-hidden="true" className="motion-ticker">
        <motion.div
          animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
          className="motion-ticker-track"
          transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        >
          {[0, 1].map((copy) => (
            <span className="motion-ticker-set" key={copy}>
              {["PLAN", "SHOOT", "EDIT", "PUBLISH", "MANAGE"].map((label) => (
                <span className="motion-ticker-word" key={label}>
                  {label}<i />
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      <section
        aria-labelledby="services-title"
        className="services-overview page-gutter"
      >
        <div className="section-lead">
          <h2 id="services-title">
            Good content<br />
            keeps <span>moving.</span>
          </h2>
          <p className="section-lede">
            From the plan to the post, social and video work better when every
            part is pulling in the same direction.
          </p>
        </div>

        <div className="service-choreography">
          {serviceAreas.map((service, index) => (
            <motion.article
              className={`service-choreo service-choreo-${service.id}`}
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              key={service.id}
              transition={reduceMotion ? { duration: 0 } : { ...spring, delay: index * 0.08 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
            >
              <span className="service-choreo-label">{service.label}</span>
              <div className="service-choreo-body">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              <Link
                aria-label={`Explore ${service.label}`}
                className="service-choreo-arrow"
                to="/services"
              >
                <ArrowUpRight aria-hidden="true" size={22} />
              </Link>
                <span className="service-choreo-glyph" aria-hidden="true">
                  {service.id === "social" ? "S" : service.id === "shoot" ? "V" : "E"}
              </span>
            </motion.article>
          ))}
        </div>

        <p className="growth-note">
          Thoughtful work and consistent publishing can support account growth.
          Audience response and results vary.
        </p>
      </section>

      <section aria-labelledby="journey-title" className="journey-section">
        <div className="journey-inner page-gutter">
          <div className="journey-heading">
            <h2 id="journey-title">
              A good idea<br />
              gets <span>out there.</span>
            </h2>
            <p>
              A clear creative thread runs through every step, so the finished
              content still feels like it belongs to you.
            </p>
            <Link className="text-link" to="/services">
              See the full service mix <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <ol className="journey-list">
            {contentJourney.map((step, index) => (
              <motion.li
                className="journey-item"
                initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                key={step.label}
                transition={reduceMotion ? { duration: 0 } : { ...spring, delay: index * 0.07 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                <span className="journey-item-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{step.label}</h3>
                  <p>{step.detail}</p>
                </div>
                <span className="journey-item-arrow" aria-hidden="true">↗</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="work-title" className="work-showcase page-gutter">
        <div className="showcase-heading">
          <div>
            <h2 id="work-title">Ideas in <span>motion.</span></h2>
          </div>
          <Link className="text-link" to="/work">
            See all concepts <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <p className="showcase-disclosure">
          These are illustrative concept studies using stock imagery, not
          commissioned VIP StudioS projects.
        </p>
        <div className="showcase-grid">
          {projects.slice(0, 3).map((project, index) => (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              key={project.slug}
              transition={reduceMotion ? { duration: 0 } : { ...spring, delay: index * 0.06 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <ProjectCard index={index} project={project} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="manifesto-band" aria-label="Creative approach">
        <div className="manifesto-track" aria-hidden="true">
          <span>Plan with purpose.</span>
          <span>Make it move.</span>
          <span>Show up well.</span>
        </div>
        <p>
          Strategy gives it direction. Video gives it a face. Consistency gives
          it room to grow.
        </p>
      </section>

      <section className="closing-cta page-gutter">
        <div className="closing-cta-copy">
          <h2>Let&apos;s make<br /><span>it happen.</span></h2>
          <p>
            Tell us what you want to say. We can help shape the plan, make the
            video, and look after the account.
          </p>
          <Link className="button button-light" to="/contact">
            Start a conversation <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </div>
        <div aria-hidden="true" className="closing-cta-mark">V/S</div>
      </section>
    </>
  );
}
