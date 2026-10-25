import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { serviceOfferings } from "../data/services.js";

export default function ServicesPage() {
  return (
    <section className="studio-page vip-services-page">
      <header className="studio-page-intro">
        <p className="studio-location">WHAT WE DO · SERVICES &amp; SCOPE</p>
        <h1>
          Your complete
          <br />
          <span>creative content partner.</span>
        </h1>
        <p>
          Bring video editing, production shoots, short-form reels, podcast recording,
          and YouTube channel management into one cohesive creative partner.
        </p>
      </header>

      <div className="vip-services-list">
        {serviceOfferings.map((service, index) => (
          <article className="vip-service-line" key={service.slug}>
            <span className="vip-service-line-index">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.85rem" }}>
                {service.scope.map((item) => (
                  <span
                    key={item}
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      padding: "0.25rem 0.65rem",
                      borderRadius: "6px",
                      background: "var(--bg-secondary)",
                      color: "var(--color-periwinkle)",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", alignItems: "flex-end" }}>
              <Link
                aria-label={`Explore ${service.title}`}
                className="vip-service-line-link"
                to={`/services/${service.slug}`}
              >
                <span>View Details</span>
                <ArrowUpRight aria-hidden="true" size={17} />
              </Link>
              <Link
                style={{ fontSize: "0.82rem", color: "var(--color-coral)", fontWeight: 600, textDecoration: "none" }}
                to={`/contact?service=${encodeURIComponent(service.enquiryValue)}`}
              >
                Book this service →
              </Link>
            </div>
          </article>
        ))}
      </div>

      <p className="studio-quote-note">
        Deliverables, format requirements, turnaround times, and scope are confirmed
        before production begins. No unexpected surprises or hidden conditions.
      </p>

      <div className="studio-end-card">
        <div>
          <h2>Need a custom scope or multiple deliverables?</h2>
          <p>
            Tell us about your brand, channels, and timeline. We will recommend the most
            effective creative package for your budget.
          </p>
        </div>
        <Link className="button button-gold" to="/contact">
          Start a conversation <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </section>
  );
}
