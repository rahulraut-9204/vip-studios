import {
  ArrowUpRight,
  Camera,
  Clapperboard,
  Instagram,
  Mic2,
  Scissors,
  TrendingUp,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";
import HeroReel from "../components/HeroReel.jsx";
import ProcessTimeline from "../components/ProcessTimeline.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import { getWhatsAppHref } from "../data/contact.js";
import { projects } from "../data/projects.js";
import { serviceOfferings, studioFacts, studioReasons } from "../data/services.js";
import usePublishedProjects from "../hooks/usePublishedProjects.js";

const serviceIcons = [Instagram, Camera, Scissors, Mic2, Youtube, Clapperboard, TrendingUp, Camera];

const faqs = [
  {
    question: "What can VIP StudioS help with?",
    answer:
      "Social media management, video production and editing, podcast production, YouTube management, content creation, digital growth and brand content.",
  },
  {
    question: "Can I book only one service?",
    answer:
      "Yes. Start with the service you need, or tell us about a wider project. The scope and deliverables are agreed before work begins.",
  },
  {
    question: "Do you guarantee audience or business growth?",
    answer:
      "No specific audience, reach or business result can be guaranteed. Strategy and content are shaped around your goals, and available performance information can guide future work.",
  },
  {
    question: "How do I get started?",
    answer:
      "Share a short project brief by email or WhatsApp. The enquiry form opens an email draft for you to review and send; this website does not store or submit the details.",
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
  const { projects: publishedProjects, isLoading, error } = usePublishedProjects();
  const homeProjects = [
    ...publishedProjects.filter((project) => project.featured),
    ...publishedProjects.filter((project) => !project.featured),
  ].slice(0, 4);
  const whatsAppHref = getWhatsAppHref(
    "Hi VIP StudioS, I'd like to discuss a content or digital project.",
  );

  return (
    <div className="vip-home">
      <FaqSchema />
      <HeroReel />

      <section aria-labelledby="studio-proof-title" className="vip-proof" id="studio-proof">
        <div className="vip-section-shell">
          <div className="vip-proof-heading">
            <h2 id="studio-proof-title">A team built to carry the whole brief.</h2>
            <p>Business details supplied by VIP StudioS.</p>
          </div>
          <dl className="vip-facts">
            {studioFacts.map((fact) => (
              <div className="vip-fact" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="studio-services-title" className="vip-services" id="services">
        <div className="vip-section-shell">
          <div className="vip-section-heading">
            <div>
              <p className="vip-eyebrow">What we do</p>
              <h2 id="studio-services-title">
                Strategy, production
                <br />
                <span>and sharp execution.</span>
              </h2>
            </div>
            <p>
              From a single edit to an ongoing content system, we shape the
              right creative support around the brief.
            </p>
          </div>
          <div className="vip-service-grid">
            {serviceOfferings.map((service, index) => {
              const Icon = serviceIcons[index];
              return (
                <Link
                  className="vip-service-card"
                  key={service.slug}
                  to={`/services/${service.slug}`}
                >
                  <span className="vip-service-card-top">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <Icon aria-hidden="true" size={19} />
                  </span>
                  <h3>{service.title}</h3>
                  <p>{service.shortDescription}</p>
                  <span className="vip-service-link">
                    Explore service <ArrowUpRight aria-hidden="true" size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
          <Link className="vip-inline-link" to="/services">
            Explore all services <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>

      <section aria-labelledby="studio-work-title" className="vip-work" id="work">
        <div className="vip-section-shell">
          <div className="vip-section-heading">
            <div>
              <p className="vip-eyebrow">Featured work</p>
              <h2 id="studio-work-title">
                Make the work
                <br />
                <span>the first conversation.</span>
              </h2>
            </div>
            <Link className="vip-inline-link" to="/work">
              Browse all concepts <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <p className="vip-section-intro">
            A growing library of selected work and clearly labelled concept
            studies. Open a project to see the thinking, role and available proof.
          </p>
          {error && (
            <p className="studio-content-error" role="alert">
              Project work could not be loaded: {error}
            </p>
          )}
          {isLoading && (
            <p aria-live="polite" className="studio-content-loading">
              Loading project work…
            </p>
          )}
          {!isLoading && !error && homeProjects.length === 0 && (
            <p className="studio-content-empty">
              There are no published projects yet.{" "}
              <Link to="/contact">Tell us about your project.</Link>
            </p>
          )}
          <div className="vip-work-grid">
            {homeProjects.map((project, index) => (
              <ProjectCard index={index} key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="studio-reasons-title" className="vip-reasons" id="why-vip">
        <div className="vip-section-shell">
          <div className="vip-section-heading">
            <div>
              <p className="vip-eyebrow">Why VIP StudioS</p>
              <h2 id="studio-reasons-title">
                One team.
                <br />
                <span>A wider view.</span>
              </h2>
            </div>
            <p>
              Creative thinking and consistent execution, coordinated around
              the goals and requirements of your business.
            </p>
          </div>
          <div className="vip-reasons-grid">
            {studioReasons.map((reason, index) => (
              <article className="vip-reason" key={reason.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{reason.title}</h3>
                <p>{reason.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="studio-process-title" className="vip-process" id="process">
        <div className="vip-section-shell">
          <div className="vip-section-heading">
            <div>
              <p className="vip-eyebrow">The process</p>
              <h2 id="studio-process-title">
                From idea
                <br />
                <span>to the next idea.</span>
              </h2>
            </div>
            <p>
              A clear route from discovery to delivery, with scope and review
              stages agreed before production begins.
            </p>
          </div>
          <ProcessTimeline />
          <Link className="vip-inline-link" to="/process">
            See how we work <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>

      <section aria-labelledby="studio-ecosystem-title" className="vip-ecosystem">
        <div className="vip-section-shell vip-ecosystem-layout">
          <div className="vip-ecosystem-copy">
            <p className="vip-eyebrow">Content ecosystem</p>
            <h2 id="studio-ecosystem-title">
              One team.
              <br />
              <span>Every format in view.</span>
            </h2>
            <p>
              Plan the message, create for the right formats, then coordinate
              publishing and account management where they are part of the brief.
            </p>
            <Link className="vip-inline-link" to="/services">
              Find the right support <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <div aria-label="Content planned, produced and managed across formats" className="vip-ecosystem-flow">
            <div className="vip-ecosystem-stage">
              <span>Plan</span>
              <div><b>Strategy</b><b>Content</b><b>Branding</b></div>
            </div>
            <div aria-hidden="true" className="vip-ecosystem-connector">→</div>
            <div className="vip-ecosystem-stage">
              <span>Produce</span>
              <div><b>Video</b><b>Reels</b><b>Podcasts</b></div>
            </div>
            <div aria-hidden="true" className="vip-ecosystem-connector">→</div>
            <div className="vip-ecosystem-stage">
              <span>Publish &amp; manage</span>
              <div><b>Instagram</b><b>Facebook</b><b>YouTube</b></div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="studio-about-title" className="vip-about" id="about">
        <div className="vip-section-shell vip-about-layout">
          <figure className="vip-about-image">
            <img
              alt="Illustrative stock image of a video-production workspace, not a VIP StudioS team photograph"
              height="1000"
              loading="lazy"
              src={projects[3].image}
              width="1200"
            />
            <figcaption>Illustrative stock image · not a VIP StudioS team photograph</figcaption>
          </figure>
          <div className="vip-about-copy">
            <p className="vip-eyebrow">About the studio</p>
            <h2 id="studio-about-title">
              We&apos;re not just
              <br />
              <span>content creators.</span>
            </h2>
            <p>
              We are a creative and digital team helping businesses build a
              stronger online presence through content, video production, social
              media management and digital execution.
            </p>
            <ul className="vip-about-facts">
              {studioFacts.slice(0, 3).map((fact) => (
                <li key={fact.label}><strong>{fact.value}</strong><span>{fact.label}</span></li>
              ))}
            </ul>
            <Link className="vip-secondary-link" to="/about">
              Meet the studio <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="studio-faq-title" className="vip-faq">
        <div className="vip-section-shell vip-faq-layout">
          <div>
            <p className="vip-eyebrow">Good to know</p>
            <h2 id="studio-faq-title">A few things<br /><span>before we start.</span></h2>
          </div>
          <div className="vip-faq-list">
            {faqs.map(({ question, answer }) => (
              <details key={question}>
                <summary>{question}<span aria-hidden="true">+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="studio-cta-title" className="vip-cta">
        <div className="vip-section-shell vip-cta-inner">
          <div>
            <p className="vip-eyebrow">Social · Video · Podcasts · YouTube</p>
            <h2 id="studio-cta-title">
              Ready to grow
              <br />
              your <span>brand?</span>
            </h2>
            <p>Let&apos;s turn your ideas into content with a clear next step.</p>
          </div>
          <div className="vip-cta-actions">
            <Link className="button button-dark" to="/contact">
              Start a project <ArrowUpRight aria-hidden="true" size={17} />
            </Link>
            {whatsAppHref && (
              <a className="vip-dark-link" href={whatsAppHref} rel="noreferrer" target="_blank">
                Message us on WhatsApp <ArrowUpRight aria-hidden="true" size={16} />
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
