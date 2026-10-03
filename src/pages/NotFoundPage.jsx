import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="not-found page-gutter">
      <h1>This frame<br /><span>is missing.</span></h1>
      <p className="page-code">404 / OUT OF FRAME</p>
      <p>The page may have moved. Head back to the work and find another way in.</p>
      <Link className="button button-gold" to="/work">Explore the work</Link>
    </section>
  );
}
