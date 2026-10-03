import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import studioImage from "../assets/studies/studio-process.webp";

export default function AboutPage() {
  return (
    <section className="page-section page-gutter about-page">
      <div className="studio-page-intro">
        <p className="studio-location">PUNE · WORKING ACROSS INDIA</p>
        <h1>Behind every<br /><span>edit is a story.</span></h1>
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
          <figcaption>Illustrative stock image—not a VIP StudioS studio photograph</figcaption>
        </figure>
        <div className="about-copy">
          <h2>Good work starts before the edit.</h2>
          <span className="story-label">ONE CONNECTED CREATIVE PROCESS</span>
          <p>
            VIP StudioS brings social-media management, video shoots, and
            professional editing into one connected offer. Substantial
            hands-on editing experience informs a thoughtful approach to pace,
            detail, and the shape of each story.
          </p>
          <p className="replace-notice">
            Every project starts with the brief: where the story belongs, who
            it needs to reach, and what it needs to say.
          </p>
          <Link className="text-link" to="/contact">
            Start with your brief <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>
      <div className="about-principles studio-about-principles">
        <h2>What good content can do.</h2>
        <div className="principle-line">
          <span>01</span><p>Give the idea a clear direction.</p>
        </div>
        <div className="principle-line">
          <span>02</span><p>Make every frame work for the story.</p>
        </div>
        <div className="principle-line">
          <span>03</span><p>Show up consistently for the audience.</p>
        </div>
      </div>
    </section>
  );
}
