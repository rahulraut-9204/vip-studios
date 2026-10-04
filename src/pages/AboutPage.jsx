import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import studioImage from "../assets/studies/studio-process.webp";

export default function AboutPage() {
  return (
    <section className="page-section page-gutter about-page">
      <div className="studio-page-intro">
        <h1>Social media<br /><span>&amp; video, together.</span></h1>
        <p>
          VIP StudioS brings social-media management and video creation
          together: strategy, planning, publishing, shoots, and professional
          editing.
        </p>
      </div>
      <div className="about-feature studio-about-feature">
        <figure className="about-image">
          <img
            alt="Illustrative stock image representing video production; not a VIP StudioS studio photograph"
            height="1000"
            loading="lazy"
            src={studioImage}
            width="1200"
          />
          <figcaption>Illustrative stock image—not a photograph of the VIP StudioS workspace</figcaption>
        </figure>
        <div className="about-copy">
          <h2>One studio. Three clear services.</h2>
          <span className="story-label">SOCIAL MEDIA · VIDEO SHOOTS · EDITING</span>
          <p>
            VIP StudioS is a Pune-based studio offering social media strategy,
            content planning, publishing, account management, video shoots and
            professional editing.
          </p>
          <p className="replace-notice">
            Work with a project brief, or combine services when the scope calls
            for it. Requirements and deliverables are agreed before work begins.
          </p>
          <Link className="text-link" to="/contact">
            Start with your brief <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>
      <div className="about-principles studio-about-principles">
        <h2>What the work includes.</h2>
        <div className="principle-line">
          <span>01</span><p>Social media strategy, planning and publishing.</p>
        </div>
        <div className="principle-line">
          <span>02</span><p>Video shoots scoped to the project brief.</p>
        </div>
        <div className="principle-line">
          <span>03</span><p>Professional editing for the agreed deliverables.</p>
        </div>
      </div>
    </section>
  );
}
