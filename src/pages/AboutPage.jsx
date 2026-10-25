import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import studioImage from "../assets/studies/studio-process.webp";
import { studioReasons } from "../data/services.js";

export default function AboutPage() {
  return (
    <section className="studio-page vip-about-page">
      <header className="studio-page-intro">
        <p className="studio-location">ABOUT VIP STUDIOS · CREATIVE STUDIO</p>
        <h1>
          Content, creativity
          <br />
          <span>and a bigger picture.</span>
        </h1>
        <p>
          VIP STUDIOS is a video editing and creative content studio helping brands,
          creators, and modern businesses build a stronger presence through thoughtful
          storytelling, high-precision editing, and consistent digital execution.
        </p>
      </header>

      {/* Studio Metrics Grid */}
      <div style={{ marginBottom: "4rem" }}>
        <div className="studio-stats-grid" style={{ background: "var(--bg-surface)", padding: "2.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
          <div className="studio-stat-item">
            <span className="studio-stat-number">6<span>+</span></span>
            <span className="studio-stat-label">Years Studio Experience</span>
          </div>
          <div className="studio-stat-item">
            <span className="studio-stat-number">1,000<span>+</span></span>
            <span className="studio-stat-label">Projects Completed</span>
          </div>
          <div className="studio-stat-item">
            <span className="studio-stat-number">10<span>+</span></span>
            <span className="studio-stat-label">Creative Team Members</span>
          </div>
          <div className="studio-stat-item">
            <span className="studio-stat-number">12<span>+</span></span>
            <span className="studio-stat-label">Active Studio Clients</span>
          </div>
        </div>
      </div>

      <div className="vip-about-feature vip-about-layout" style={{ marginBottom: "5rem" }}>
        <figure className="vip-about-image">
          <img
            alt="VIP Studios editing suite and production workspace"
            height="1000"
            loading="lazy"
            src={studioImage}
            width="1200"
          />
          <figcaption>VIP Studios · Editing suite &amp; creative workflow workspace</figcaption>
        </figure>
        <div className="vip-about-copy">
          <p className="vip-eyebrow">Creative Direction &amp; Editing</p>
          <h2>
            We&apos;re not just
            <br />
            <span>content creators.</span>
          </h2>
          <p>
            We help businesses bring video editing, social media management, podcasts,
            YouTube channels, and branded campaigns into one coordinated visual standard.
          </p>
          <p>
            From the initial creative brief to color grading, sound design, and publishing,
            every cut is made with deliberate artistic intention and attention to detail.
          </p>
          <Link className="button button-gold" to="/contact" style={{ marginTop: "1rem" }}>
            Work with the studio <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>

      <section aria-labelledby="about-reasons-title" className="vip-about-reasons" style={{ background: "transparent", padding: 0 }}>
        <div className="vip-section-heading">
          <div>
            <p className="vip-eyebrow">Studio Principles</p>
            <h2 id="about-reasons-title">
              One partner for
              <br />
              <span>the whole picture.</span>
            </h2>
          </div>
          <p>
            A practical mix of creative vision, technical discipline, and dependable
            delivery across the digital content journey.
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

      <div className="studio-end-card" style={{ marginTop: "5rem" }}>
        <div>
          <h2>Ready to elevate your visual content?</h2>
          <p>Share your vision and let&apos;s cut something remarkable together.</p>
        </div>
        <Link className="button button-gold" to="/contact">
          Start a project <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </section>
  );
}
