import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import studioImage from "../assets/studies/studio-process.webp";

export default function AboutPage() {
  return (
    <section className="page-section page-gutter about-page">
      <div className="page-intro">
        <h1>Good ideas<br />need <span>follow-through.</span></h1>
        <p className="page-lede">
          VIP StudioS brings social-media management and video creation
          together: strategy, planning, publishing, shoots, and professional
          editing.
        </p>
      </div>
      <div className="about-feature">
        <figure className="about-image">
          <img
            alt="Illustrative stock image representing video production; not a VIP StudioS studio photograph"
            height="1000"
            loading="lazy"
            src={studioImage}
            width="1200"
          />
          <figcaption>Illustrative concept image / replace with approved studio photography</figcaption>
        </figure>
        <div className="about-copy">
          <h2>Make good work. Keep showing up.</h2>
          <span className="story-label">THE STUDIO STORY IS STILL TO COME</span>
          <p>
            The people behind VIP StudioS, the studio&apos;s location, and its
            day-to-day working approach have not yet been supplied. This page
            is ready for those real details.
          </p>
          <p className="replace-notice">
            No team biographies, client names, awards, or results are invented
            in this preview.
          </p>
          <Link className="text-link" to="/contact">
            Start with your brief <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>
      <div className="about-principles">
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
