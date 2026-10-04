import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import studioImage from "../assets/studies/studio-process.webp";
import { studioFacts, studioReasons } from "../data/services.js";

export default function AboutPage() {
  return (
    <section className="studio-page vip-about-page">
      <header className="studio-page-intro">
        <p className="studio-location">ABOUT VIP STUDIOS</p>
        <h1>
          Content, creativity
          <br />
          <span>and a bigger picture.</span>
        </h1>
        <p>
          VIP StudioS is a content and digital growth partner for businesses
          looking to build a stronger online presence through thoughtful
          strategy, professional production and consistent execution.
        </p>
      </header>

      <div className="vip-about-feature">
        <figure className="vip-about-image">
          <img
            alt="Illustrative stock image of a video-production workspace, not a VIP StudioS team photograph"
            height="1000"
            loading="lazy"
            src={studioImage}
            width="1200"
          />
          <figcaption>Illustrative stock image · not a VIP StudioS team photograph</figcaption>
        </figure>
        <div className="vip-about-copy">
          <p className="vip-eyebrow">The work, connected</p>
          <h2>
            We&apos;re not just
            <br />
            <span>content creators.</span>
          </h2>
          <p>
            We help businesses bring social media, video production, podcasts,
            YouTube and brand content into one coordinated digital presence.
            From the first strategy conversation to publishing and management,
            the scope is built around the work you need.
          </p>
          <p>
            The team has worked across multiple industries and business
            categories, bringing creative production and digital execution
            together under one brief.
          </p>
          <p>
            The figures below are business details supplied by VIP StudioS.
            Portfolio visuals are separately labeled as illustrative concepts
            unless commissioned work is identified.
          </p>
          <Link className="vip-inline-link" to="/contact">
            Work with the studio <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>

      <dl aria-label="VIP StudioS business details" className="vip-about-stats">
        {studioFacts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="about-reasons-title" className="vip-about-reasons">
        <div className="vip-section-heading">
          <div>
            <p className="vip-eyebrow">How we work</p>
            <h2 id="about-reasons-title">
              One partner for
              <br />
              <span>the whole picture.</span>
            </h2>
          </div>
          <p>
            A practical mix of experience, creative capability and clear
            coordination across the content journey.
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
      </section>
    </section>
  );
}
