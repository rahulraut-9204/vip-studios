import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Clapperboard,
  Layers3,
  Play,
  Scissors,
  Video,
} from "lucide-react";
import { Link } from "react-router-dom";
import HeroReel from "../components/HeroReel.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import { projects } from "../data/projects.js";
import { contentJourney, serviceOfferings } from "../data/services.js";

const faqs = [
  {
    question: "What type of videos do you edit?",
    answer:
      "VIP StudioS offers professional editing for social and video content. Share the format, footage and goal in your brief so the scope can be discussed before work begins.",
  },
  {
    question: "Do you provide video shoots?",
    answer:
      "Yes. Video shoots are part of the studio's confirmed services. The production approach and requirements are discussed for each project.",
  },
  {
    question: "Can you edit footage we already have?",
    answer:
      "Yes. Send a description of the footage, intended platform and final format. The studio can review the material and confirm whether it fits the requested edit.",
  },
  {
    question: "Can you make short videos from longer content?",
    answer:
      "Short-form and social-ready edits can be discussed as part of the brief. The final scope depends on the source material and the formats you need.",
  },
  {
    question: "Do you offer monthly content support?",
    answer:
      "Recurring social-media planning, publishing and account management are available to discuss. Monthly scope and pricing are quoted after understanding the requirements.",
  },
  {
    question: "How do revisions and turnaround work?",
    answer:
      "Review stages, revision scope and delivery timing are agreed for the individual project. No standard turnaround is promised on this site.",
  },
  {
    question: "Do you work outside Pune?",
    answer:
      "VIP StudioS is based in Pune and works with clients across India. For an on-location shoot, share the city so availability can be confirmed.",
  },
  {
    question: "How do I start a project?",
    answer:
      "Send a project brief by email or start a WhatsApp conversation. The website opens an email draft on your device; it does not store or submit the details to a server.",
  },
  {
    question: "Can I receive the source files?",
    answer:
      "File handover is confirmed as part of the project scope. Include any source-file requirements in your brief so they can be discussed before work begins.",
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
  const reduceMotion = useReducedMotion();

  return (
    <div className="studio-route-page">
      <FaqSchema />
      <HeroReel />

      <section aria-label="Studio services" className="studio-service-rail studio-route-stop" data-route-stop="Services">
        <p>One creative partner</p>
        {["Social strategy", "Video shoots", "Professional editing", "Publishing"].map(
          (item, index) => (
            <span className="studio-rail-item" key={item}>
              {index > 0 && <i aria-hidden="true" />}
              {item}
            </span>
          ),
        )}
      </section>

      <section aria-labelledby="studio-offer-title" className="studio-offer-section studio-route-stop" data-route-stop="Planning">
        <div className="studio-section-heading">
          <h2 id="studio-offer-title">
            More than a
            <br />
            <span>final cut.</span>
          </h2>
          <p>
            Bring the idea, the footage or the account that needs a clearer
            direction. We connect the moving parts, from planning and production
            to edit and publish.
          </p>
        </div>
        <div className="studio-offer-columns">
          {[
            {
              icon: <Layers3 aria-hidden="true" />,
              title: "Plan with purpose",
              copy: "Shape social direction and content plans around your brand, audience and goals.",
            },
            {
              icon: <Video aria-hidden="true" />,
              title: "Shoot the story",
              copy: "Create video around the message, the people and the platform it needs to reach.",
            },
            {
              icon: <Scissors aria-hidden="true" />,
              title: "Edit for the feed",
              copy: "Turn footage into considered, platform-ready edits without promising audience outcomes.",
            },
          ].map((item, index) => (
            <motion.article
              className="studio-offer-item"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              key={item.title}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
            >
              <span className="studio-offer-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section aria-labelledby="studio-services-title" className="studio-services studio-route-stop" data-route-stop="Production">
        <div className="studio-section-heading studio-section-heading-light">
          <h2 id="studio-services-title">
            What we can
            <br />
            <span>make together.</span>
          </h2>
          <Link className="studio-text-link" to="/services">
            Explore all services <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </div>
        <div className="studio-service-list">
          {serviceOfferings.slice(0, 6).map((service, index) => (
            <Link
              className="studio-service-row"
              key={service.slug}
              to={`/services/${service.slug}`}
            >
              <span className="studio-service-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="studio-service-name">{service.title}</span>
              <span className="studio-service-note">{service.shortDescription}</span>
              <ArrowUpRight aria-hidden="true" className="studio-service-arrow" size={20} />
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="content-system-title" className="studio-system studio-route-stop" data-route-stop="Formats">
        <div className="studio-system-copy">
          <h2 id="content-system-title">
            One story.
            <br />
            <span>Many ways in.</span>
          </h2>
          <p>
            A shoot can be planned with more than one destination in mind. A
            longer piece, short edits and social cutdowns may all come from the
            same idea, depending on your footage, scope and goals.
          </p>
          <Link className="button button-gold" to="/contact?service=Monthly%20content%20support">
            Plan my content <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </div>
        <div aria-label="Illustrative example of a content idea adapted into formats" className="studio-format-map">
          <div className="studio-format-origin">
            <Clapperboard aria-hidden="true" />
            <span>ONE IDEA</span>
            <small>Illustrative content map</small>
          </div>
          {[
            ["01", "Long-form video", "A full story"],
            ["02", "Short-form edits", "Moments worth sharing"],
            ["03", "Social posts", "A reason to return"],
          ].map(([number, label, note]) => (
            <div className="studio-format-branch" key={label}>
              <span>{number}</span>
              <div>
                <strong>{label}</strong>
                <small>{note}</small>
              </div>
              <ArrowRight aria-hidden="true" size={17} />
            </div>
          ))}
          <p>
            Example only. Deliverables depend on the project brief and agreed
            scope.
          </p>
        </div>
      </section>

      <section aria-labelledby="studio-monthly-title" className="studio-monthly studio-route-stop" data-route-stop="Ongoing support">
        <div>
          <p className="studio-location">ONGOING CONTENT SUPPORT</p>
          <h2 id="studio-monthly-title">
            Your content team,
            <br />
            <span>without building one in-house.</span>
          </h2>
          <p>
            Recurring support can combine social planning, production and
            publishing around the rhythm your business needs. The mix and
            frequency are agreed in the project scope.
          </p>
        </div>
        <div className="studio-monthly-options">
          {[
            ["01", "Plan & publish", "A considered social presence."],
            ["02", "Shoot & edit", "Video content from brief to final cut."],
            ["03", "Connected support", "A mix of services shaped to your needs."],
          ].map(([number, title, detail]) => (
            <div className="studio-monthly-option" key={title}>
              <span>{number}</span>
              <div><strong>{title}</strong><small>{detail}</small></div>
            </div>
          ))}
          <p>Scope and quote are confirmed after a conversation—no fixed pricing is published.</p>
          <Link className="studio-text-link" to="/contact?service=Monthly%20content%20support">
            Request monthly support <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
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
          These are illustrative studies made with stock imagery—not client
          commissions, testimonials or performance results.
        </p>
        <div className="studio-work-grid">
          {projects.slice(0, 3).map((project, index) => (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              key={project.slug}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <ProjectCard index={index} project={project} />
            </motion.div>
          ))}
        </div>
      </section>

      <section aria-labelledby="studio-audience-title" className="studio-audience studio-route-stop" data-route-stop="Audience">
        <div className="studio-section-heading studio-section-heading-light">
          <h2 id="studio-audience-title">
            Built for people
            <br />
            <span>with a story.</span>
          </h2>
          <p>
            From a first shoot to a steady social presence, the right format
            starts with what you need to say.
          </p>
        </div>
        <div className="studio-audience-list">
          {[
            ["01", "Businesses", "Make the offer easier to understand."],
            ["02", "Creators & founders", "Give your point of view a consistent frame."],
            ["03", "Professionals & educators", "Make expertise clear, human and watchable."],
            ["04", "Brands & agencies", "Bring a campaign idea into production."],
          ].map(([number, audience, need]) => (
            <div className="studio-audience-row" key={audience}>
              <span>{number}</span>
              <h3>{audience}</h3>
              <p>{need}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="studio-process-title" className="studio-process studio-route-stop" data-route-stop="Process">
        <div className="studio-section-heading">
          <h2 id="studio-process-title">
            From idea
            <br />
            <span>to final video.</span>
          </h2>
          <p>
            A straightforward path that keeps the brief, review and final
            delivery connected.
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
        <p className="studio-process-note">
          Project timing, review stages and revisions are confirmed in the
          agreed scope.
        </p>
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
              See the concept work <Play aria-hidden="true" size={15} />
            </Link>
          </div>
        </div>
        <ArrowDown aria-hidden="true" className="studio-closing-arrow" size={38} />
      </section>
    </div>
  );
}
