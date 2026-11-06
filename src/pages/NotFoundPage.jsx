import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
      <section className="not-found page-gutter text-center py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold mb-3">404 // OUT OF FRAME</p>
        <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 font-display">
          This frame<br /><span className="text-[#FFD21C]">is missing.</span>
        </h1>
        <p className="text-base text-[#A1A1AA] max-w-md mx-auto mb-8 font-sans">
          The page may have moved or does not exist. Head back to our curated work archive.
        </p>
        <Link className="button button-gold font-mono text-xs font-bold uppercase tracking-wider" to="/work">
          Explore the work
        </Link>
      </section>
    </div>
  );
}
