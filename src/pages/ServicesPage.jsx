import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { serviceOfferings } from "../data/services.js";

export default function ServicesPage() {
  return (
    <section className="studio-page studio-services-page">
      <header className="studio-page-intro">
        <p className="studio-location">FROM FIRST IDEA TO FINAL FRAME</p>
        <h1>
          Make the idea
          <br />
          <span>go further.</span>
        </h1>
        <p>
          Social-media planning and management, video shoots and professional
          editing—shaped around what you want to create.
        </p>
      </header>
      <div className="studio-offering-list">
        {serviceOfferings.map((service, index) => (
          <article className="studio-offering" key={service.slug}>
            <span className="studio-offering-index">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
            </div>
            <Link
              aria-label={`Learn about ${service.title}`}
              className="studio-offering-link"
              to={`/services/${service.slug}`}
            >
              <ArrowUpRight aria-hidden="true" size={21} />
            </Link>
          </article>
        ))}
      </div>
      <p className="studio-quote-note">
        Pricing is scoped to the brief. Share your requirements for a project
  quotation; no package rates or performance outcomes are promised here.
      </p>
      <div className="studio-end-card">
        <div>
          <h2>Not sure what you need yet?</h2>
          <p>Start with the goal. We can talk through the format and next step.</p>
        </div>
        <Link className="button button-gold" to="/contact">
          Tell us about it <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </section>
  );
}
