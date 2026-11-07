import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import studioImage from "../assets/studies/studio-process.webp";
import { studioReasons } from "../data/services.js";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <section className="studio-page vip-about-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <header className="studio-page-intro mb-12">
          <p className="studio-location font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
            ABOUT VIP STUDIOS
          </p>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none mb-4 font-display">
            Content, creativity
            <br />
            <span className="text-[#FFD21C]">and digital growth.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1AA] max-w-2xl leading-relaxed font-sans">
            VIP STUDIOS is a digital growth partner helping brands,
            creators, and modern businesses build a stronger presence through thoughtful
            storytelling, high-precision editing, and consistent digital execution.
          </p>
        </header>

        {/* Studio Metrics Grid */}
        <div className="mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 sm:p-8 rounded-2xl bg-[#141414] border border-[#222222] shadow-xl">
            <div className="p-4">
              <span className="block font-display text-4xl sm:text-5xl font-black text-[#FFD21C] tracking-tight leading-none mb-2">
                6+
              </span>
              <strong className="block text-white text-base font-display font-bold mb-1">
                Years of Experience
              </strong>
              <span className="text-xs text-[#A1A1AA] font-sans">
                Hands-on video editing, post-production &amp; brand positioning.
              </span>
            </div>
            <div className="p-4">
              <span className="block font-display text-4xl sm:text-5xl font-black text-[#FFD21C] tracking-tight leading-none mb-2">
                10+
              </span>
              <strong className="block text-white text-base font-display font-bold mb-1">
                Team Members
              </strong>
              <span className="text-xs text-[#A1A1AA] font-sans">
                Specialized editors, colorists, sound designers &amp; strategists.
              </span>
            </div>
            <div className="p-4">
              <span className="block font-display text-4xl sm:text-5xl font-black text-[#FFD21C] tracking-tight leading-none mb-2">
                12+
              </span>
              <strong className="block text-white text-base font-display font-bold mb-1">
                Active Clients
              </strong>
              <span className="text-xs text-[#A1A1AA] font-sans">
                Long-term retained creators, corporate leaders &amp; growth partners.
              </span>
            </div>
            <div className="p-4">
              <span className="block font-display text-4xl sm:text-5xl font-black text-[#FFD21C] tracking-tight leading-none mb-2">
                1,000+
              </span>
              <strong className="block text-white text-base font-display font-bold mb-1">
                Projects Delivered
              </strong>
              <span className="text-xs text-[#A1A1AA] font-sans">
                Commercial masters, high-retention reels &amp; episodic cuts.
              </span>
            </div>
          </div>
        </div>

        {/* Visual Storytelling Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
          <figure className="lg:col-span-6 m-0 rounded-2xl overflow-hidden border border-[#222222] shadow-2xl bg-[#141414]">
            <img
              alt="VIP Studios editing suite and production workspace"
              className="w-full h-auto object-cover"
              height="1000"
              loading="lazy"
              src={studioImage}
              width="1200"
            />
            <figcaption className="p-3 text-center text-xs font-mono text-[#71717A] bg-[#121212] border-t border-[#222222]">
              VIP StudioS · Editing suite &amp; creative workflow workspace
            </figcaption>
          </figure>
          <div className="lg:col-span-6">
            <p className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold mb-2">
              CREATIVE DIRECTION &amp; EDITING
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4 font-display">
              Guiding brands with
              <br />
              <span className="text-[#FFD21C]">visual authority.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed mb-4 font-sans">
              We guide businesses through the full content and digital growth journey: Strategy → Content → Shoot → Edit → Publish → Manage → Analyse → Grow.
            </p>
            <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed mb-6 font-sans">
              From the initial creative brief to color grading, sound design, and multi-platform packaging,
              every cut is made with deliberate artistic intention and data-backed retention psychology.
            </p>
            <Link className="button button-gold font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2" to="/contact">
              Work with the studio <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>

        {/* Studio Principles */}
        <section aria-labelledby="about-reasons-title" className="mb-16">
          <div className="mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold mb-2">STUDIO PRINCIPLES</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display" id="about-reasons-title">
              One partner for <span className="text-[#FFD21C]">the whole picture.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1AA] mt-2 max-w-xl font-sans">
              A practical mix of creative vision, technical discipline, and dependable
              delivery across the digital content journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studioReasons.map((reason, index) => (
              <article className="p-6 rounded-xl bg-[#141414] border border-[#222222] hover:border-[#FFD21C]/40 transition-colors" key={reason.title}>
                <span className="font-mono text-xl font-black text-[#FFD21C] block mb-2">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="text-lg font-bold text-white mb-2 font-display">{reason.title}</h3>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed m-0 font-sans">{reason.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
