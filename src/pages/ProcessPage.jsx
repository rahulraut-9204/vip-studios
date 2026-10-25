import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { contentJourney } from "../data/services.js";

const clientExpectations = [
  {
    step: "01 · Brief & Discovery",
    title: "Discovery & Alignment",
    whatYouProvide: "Raw footage, brand guidelines, reference links, and target audience goals.",
    whatWeDeliver: "A structured scope document, agreed deliverable format list, and project calendar.",
  },
  {
    step: "02 · Creative Strategy",
    title: "Creative Direction & Planning",
    whatYouProvide: "Script outlines, key messaging requirements, and priority review feedback.",
    whatWeDeliver: "Pacing direction, sound/music styling references, and storyboard outlines.",
  },
  {
    step: "03 · Production & Assembly",
    title: "Rough Cut & Assembly",
    whatYouProvide: "Timely review of the initial cut via frame-accurate review links.",
    whatWeDeliver: "First assembly cut focusing on narrative flow, rhythm, and core structure.",
  },
  {
    step: "04 · Fine Cut & Polish",
    title: "Editing, Color & Sound",
    whatYouProvide: "Consolidated, single-round feedback on pacing and sound balance.",
    whatWeDeliver: "Color-graded picture, audio cleanup, dynamic motion graphics, and captions.",
  },
  {
    step: "05 · Final Handover",
    title: "Master Export & Delivery",
    whatYouProvide: "Final sign-off on delivered masters.",
    whatWeDeliver: "Full-resolution master files optimized for YouTube, Instagram Reels, and direct broadcast.",
  },
];

export default function ProcessPage() {
  return (
    <section className="studio-page vip-process-page">
      <header className="studio-page-intro">
        <p className="studio-location">A CLEAR BRIEF-TO-DELIVERY WORKFLOW</p>
        <h1>
          From first idea
          <br />
          <span>to final delivery.</span>
        </h1>
        <p>
          Whether you need a single edit or ongoing multi-channel content support, every
          project begins with a clear creative brief. Deliverables, revision rounds, and
          milestones are locked before production begins.
        </p>
      </header>

      {/* Process Flow Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBlock: "3rem" }}>
        {clientExpectations.map((stage) => (
          <article
            key={stage.step}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "2.25rem",
              boxShadow: "var(--shadow-card)",
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 1fr",
              gap: "2rem",
              alignItems: "flex-start",
            }}
          >
            <div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", fontWeight: 700, color: "var(--color-coral)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {stage.step}
              </span>
              <h2 style={{ fontSize: "1.6rem", margin: "0.4rem 0 0.8rem" }}>{stage.title}</h2>
              <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.95rem" }}>
                A structured checkpoint designed to ensure your goals are achieved without ambiguity.
              </p>
            </div>
            <div style={{ background: "var(--bg-secondary)", padding: "1.25rem", borderRadius: "var(--radius-sm)" }}>
              <strong style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-periwinkle)", marginBottom: "0.4rem" }}>
                What you supply
              </strong>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-primary)" }}>{stage.whatYouProvide}</p>
            </div>
            <div style={{ background: "var(--bg-surface-raised)", padding: "1.25rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <strong style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                What the studio delivers
              </strong>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)" }}>{stage.whatWeDeliver}</p>
            </div>
          </article>
        ))}
      </div>

      <div style={{ background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", padding: "2.5rem", marginBlock: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
        <div>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Clear Revisions</h3>
          <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.92rem" }}>
            We work with structured review rounds using frame-by-frame timestamps to make giving and executing feedback effortless.
          </p>
        </div>
        <div>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Broadcast Polish</h3>
          <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.92rem" }}>
            Every deliverable includes calibrated audio leveling, dialogue cleanup, and color grading tailored to the target platform.
          </p>
        </div>
        <div>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Direct Studio Comms</h3>
          <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.92rem" }}>
            You work directly with our lead editors and creative team—no bureaucratic agency account managers in between.
          </p>
        </div>
      </div>

      <p className="studio-quote-note">
        Publishing, ongoing channel management, and analytics reviews are included only
        when they are part of the agreed contract scope.
      </p>

      <div className="studio-end-card">
        <div>
          <h2>Have a project in mind?</h2>
          <p>Share your target timeline, footage format, and creative vision. We can begin with a clear first cut.</p>
        </div>
        <Link className="button button-gold" to="/contact">
          Start a project <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </section>
  );
}
