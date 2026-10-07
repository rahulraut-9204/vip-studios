import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage.jsx";
import { getServiceBySlug } from "../data/services.js";

export default function ServiceDetailPage() {
  const { serviceSlug } = useParams();
  const service = getServiceBySlug(serviceSlug);

  if (!service) return <NotFoundPage />;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: "VIP StudioS",
      url: "https://vip-studios.pages.dev/",
      address: {
        "@type": "PostalAddress",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
    },
    areaServed: "India",
  };

  return (
    <article className="studio-page studio-service-detail">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        type="application/ld+json"
      />
      <Link className="studio-back-link" to="/services">
        <ArrowLeft aria-hidden="true" size={16} /> All services
      </Link>
      <header className="studio-page-intro">
        <p className="studio-location">VIP STUDIOS · SERVICE</p>
        <h1>{service.title}<span>.</span></h1>
        <p>{service.description}</p>
      </header>
      <section aria-labelledby="service-scope-title" className="studio-detail-scope">
        <h2 id="service-scope-title">A scope shaped around your brief.</h2>
        <ul>
          {service.scope.map((item, index) => (
            <li key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item}
            </li>
          ))}
        </ul>
        <p>
          Exact deliverables, review stages, timing and pricing are confirmed
          after understanding the project requirements.
        </p>
      </section>
      <div className="studio-detail-cta">
        <div>
          <h2>Let&apos;s talk about your {service.title.toLowerCase()}.</h2>
          <p>Share the goal, format and any references you have in mind.</p>
        </div>
        <Link
          className="button button-gold"
          to={`/contact?service=${encodeURIComponent(service.enquiryValue)}`}
        >
          Start a project <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </article>
  );
}
