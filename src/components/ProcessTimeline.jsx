import { contentJourney } from "../data/services.js";

export default function ProcessTimeline() {
  return (
    <ol className="vip-process-list">
      {contentJourney.map((step, index) => (
        <li className="vip-process-step" key={step.label}>
          <span className="vip-process-index">{String(index + 1).padStart(2, "0")}</span>
          <h3>{step.label}</h3>
          <p>{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}
