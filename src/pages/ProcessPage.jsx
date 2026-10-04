import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProcessTimeline from "../components/ProcessTimeline.jsx";

export default function ProcessPage() {
  return (
    <section className="studio-page vip-process-page">
      <header className="studio-page-intro">
        <p className="studio-location">A CLEAR BRIEF-TO-DELIVERY PROCESS</p>
        <h1>
          From first idea
          <br />
          <span>to what comes next.</span>
        </h1>
        <p>
          Whether you need one video edited or ongoing content support, the
          project starts with the brief. Scope, deliverables and review stages
          are agreed before production begins.
        </p>
      </header>
      <ProcessTimeline />
      <p className="studio-quote-note">
        Publishing, account management and performance review are included only
        when they are part of the agreed scope. Specific outcomes are not
        guaranteed.
      </p>
      <div className="studio-end-card">
        <div>
          <h2>Have a project in mind?</h2>
          <p>Share the goal, format and timing you have in mind.</p>
        </div>
        <Link className="button button-gold" to="/contact">
          Start a project <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </section>
  );
}
