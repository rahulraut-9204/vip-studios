import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { serviceOfferings } from "../data/services.js";

export default function ServicesPage() {
  return (
    <section className="studio-page studio-services-page">
      <header className="studio-page-intro">
        <h1>
          Social, shoots
          <br />
          <span>and editing.</span>
        </h1>
        <p>
          Social media strategy, planning, publishing and account management,
          alongside video shoots and professional editing. Scope is agreed
          around your brief.
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
        Deliverables, timing and pricing depend on the brief and are confirmed
        before work begins.
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
