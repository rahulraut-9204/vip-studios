import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { serviceOfferings } from "../data/services.js";

export default function ServicesPage() {
  return (
    <section className="studio-page vip-services-page">
      <header className="studio-page-intro">
        <p className="studio-location">CONTENT · SOCIAL · DIGITAL GROWTH</p>
        <h1>
          Your complete
          <br />
          <span>content partner.</span>
        </h1>
        <p>
          Bring strategy, production, publishing and account management together.
          Choose one service or shape a wider scope around your business.
        </p>
      </header>
      <div className="vip-services-list">
        {serviceOfferings.map((service, index) => (
          <article className="vip-service-line" key={service.slug}>
            <span className="vip-service-line-index">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
            </div>
            <Link
              aria-label={`Explore ${service.title}`}
              className="vip-service-line-link"
              to={`/services/${service.slug}`}
            >
              <span>Explore service</span>
              <ArrowUpRight aria-hidden="true" size={20} />
            </Link>
          </article>
        ))}
      </div>
      <p className="studio-quote-note">
        Deliverables, timing and pricing depend on the brief and are agreed
        before work begins. Digital activity does not guarantee a particular
        audience or business outcome.
      </p>
      <div className="studio-end-card">
        <div>
          <h2>Not sure where to begin?</h2>
          <p>Tell us what you want to make or improve. We can discuss a sensible first step.</p>
        </div>
        <Link className="button button-gold" to="/contact">
          Start a conversation <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </section>
  );
}
