import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { serviceAreas } from "../data/services.js";

const spring = { type: "spring", stiffness: 120, damping: 22 };

export default function ServicesPage() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="page-section page-gutter services-page">
      <div className="page-intro">
        <h1>
          Social, shot<br />
          &amp; <span>edited.</span>
        </h1>
        <p className="page-lede">
          Strategy and content under one roof. We plan and manage your social
          presence, then make the videos that bring it to life.
        </p>
      </div>

      <div className="services-list">
        {serviceAreas.map((service, index) => (
          <motion.article
            className={`service-detail-row service-detail-${service.id}`}
            id={`service-${service.id}`}
            key={service.id}
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            transition={reduceMotion ? { duration: 0 } : { ...spring, delay: index * 0.07 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <span className="service-detail-label">{service.label}</span>
            <div className="service-detail-main">
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <Link
                className="service-enquire-link"
                to={`/contact?service=${encodeURIComponent(service.enquiryValue)}`}
              >
                Enquire about {service.label.toLowerCase()}{" "}
                <ArrowUpRight aria-hidden="true" size={15} />
              </Link>
            </div>
            <ul>
              {service.deliverables.map((deliverable) => (
                <li key={deliverable}>{deliverable}</li>
              ))}
            </ul>
            <span className="service-detail-glyph" aria-hidden="true">
              {service.id === "social" ? "S" : service.id === "shoot" ? "V" : "E"}
            </span>
          </motion.article>
        ))}
      </div>

      <p className="growth-note">
        Social strategy and consistent publishing are built to support growth.
        No one can promise how an audience will respond.
      </p>

      <div className="service-end">
        <div>
          <h2>Different idea?<br />Let&apos;s talk it through.</h2>
          <p>Tell us what you want to make, manage, or improve.</p>
        </div>
        <Link className="button button-gold" to="/contact">
          Start a conversation <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </section>
  );
}
