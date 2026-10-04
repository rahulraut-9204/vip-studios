import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import HeroReel from "../components/HeroReel.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import usePublishedProjects from "../hooks/usePublishedProjects.js";
import { contentJourney, serviceOfferings } from "../data/services.js";

const faqs = [
  {
    question: "What does social media management include?",
    answer:
      "Social media strategy, content planning, publishing and account management. Platforms and ongoing scope are discussed in your brief.",
  },
  {
    question: "Can you shoot videos and edit existing footage?",
    answer:
      "Yes. Video shoots and professional editing are available. Share whether you need production, editing for footage you already have, or both.",
  },
  {
    question: "How are timing and pricing decided?",
    answer:
      "Timing, deliverables and pricing depend on the project requirements. They are confirmed after the brief is reviewed; no fixed package rates or turnaround promises are listed here.",
  },
  {
    question: "How do I start?",
    answer:
      "Send a short project brief by email or WhatsApp. The website opens an email draft on your device; it does not store or submit form details to a server.",
  },
];

function FaqSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      type="application/ld+json"
    />
  );
}

export default function HomePage() {
  const { projects, isLoading: projectsLoading, error: projectsError } = usePublishedProjects();
  const homeProjects = [
    ...projects.filter((project) => project.featured),
    ...projects.filter((project) => !project.featured),
  ].slice(0, 4);

  return (
    <div className="studio-route-page">
      <FaqSchema />
      <HeroReel />

      <section aria-labelledby="studio-services-title" className="studio-offer-section studio-route-stop" data-route-stop="Services">
        <div className="studio-section-heading">
          <h2 id="studio-services-title">
            Three services.
            <br />
            <span>One clear brief.</span>
          </h2>
          <p>
            Choose the support you need: social media management, a video shoot
            or professional editing. Each project is scoped around your brief.
          </p>
        </div>
        <div className="studio-service-list">
          {serviceOfferings.map((service) => (
            <Link
              className="studio-service-row"
              key={service.slug}
              to={`/services/${service.slug}`}
            >
              <span className="studio-service-name">{service.title}</span>
              <span className="studio-service-note">
                {service.shortDescription}
                {service.scope && (
                  <small>{service.scope.join(" · ")}</small>
                )}
              </span>
              <ArrowUpRight aria-hidden="true" className="studio-service-arrow" size={20} />
            </Link>
          ))}
        </div>
        <Link className="studio-text-link" to="/services">
          See service details <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </section>

      <section aria-labelledby="studio-work-title" className="studio-work studio-route-stop" data-route-stop="Concept work">
        <div className="studio-section-heading">
          <h2 id="studio-work-title">
            Ideas made
            <br />
            <span>visible.</span>
          </h2>
          <Link className="studio-text-link" to="/work">
            Browse concept studies <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </div>
        <p className="studio-concept-note">
          {projects.length > 0 && projects.every((project) => project.concept)
            ? "These are illustrative studies made with stock imagery—not client commissions, testimonials or performance results."
            : projects.length > 0
              ? "Selected work and illustrative studies are clearly identified. Project details reflect only the material shown."
              : "Approved project work is being added. Start a conversation about your brief."}
        </p>
        {projectsError && <p className="studio-content-error" role="alert">Project work could not be loaded: {projectsError}</p>}
        {projectsLoading && <p aria-live="polite" className="studio-content-loading">Loading project work…</p>}
        <div className="studio-work-grid">
          {homeProjects.map((project, index) => (
            <div key={project.slug}>
              <ProjectCard index={index} project={project} />
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="studio-process-title" className="studio-process studio-route-stop" data-route-stop="Process">
        <div className="studio-section-heading">
          <h2 id="studio-process-title">
            A clear process.
            <br />
            <span>From brief to delivery.</span>
          </h2>
          <p>
            Before work begins, the project scope, deliverables and timing are
            agreed with you.
          </p>
        </div>
        <ol className="studio-process-list">
          {contentJourney.map((step, index) => (
            <li className="studio-process-step" key={step.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.label}</h3>
              <p>{step.detail}</p>
            </li>
          ))}
        </ol>
        <p className="studio-process-note">Review stages and revisions are confirmed in the agreed scope.</p>
      </section>

      <section aria-labelledby="studio-faq-title" className="studio-faq studio-route-stop" data-route-stop="FAQ">
        <div className="studio-faq-heading">
          <h2 id="studio-faq-title">
            Before we
            <br />
            <span>press record.</span>
          </h2>
          <p>Good questions make a better first conversation.</p>
        </div>
        <div className="studio-faq-list">
          {faqs.map(({ question, answer }) => (
            <details key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="studio-cta-title" className="studio-closing studio-route-stop" data-route-stop="Enquire">
        <div>
          <p className="studio-closing-location">PUNE, MAHARASHTRA · WORKING ACROSS INDIA</p>
          <h2 id="studio-cta-title">
            Have a story
            <br />
            <span>to tell?</span>
          </h2>
          <p>
            Tell us what you are making. We will help shape the right format,
            production approach and next step.
          </p>
          <div className="studio-closing-actions">
            <Link className="button button-light" to="/contact">
              Start your project <ArrowUpRight aria-hidden="true" size={17} />
            </Link>
            <Link className="studio-text-link" to="/work">
              See the concept work <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
