import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { serviceOfferings } from "../data/services.js";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <section className="studio-page vip-services-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <header className="studio-page-intro mb-12">
          <p className="studio-location font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
            SERVICES &amp; SOLUTIONS
          </p>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none mb-4 font-display">
            High-Performance
            <br />
            <span className="text-[#FFD21C]">Content Solutions.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1AA] max-w-2xl leading-relaxed font-sans">
            From single commercial films to complete end-to-end digital growth suites, our studio delivers precision editing, intentional storytelling, and compounding brand authority.
          </p>
        </header>

        {/* Modern Responsive Container Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
          {serviceOfferings.map((service, index) => (
            <article
              className="p-8 rounded-2xl bg-[#141414] border border-[#222222] hover:border-[#FFD21C]/50 transition-all flex flex-col justify-between group shadow-lg"
              key={service.slug}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm font-black text-[#FFD21C] bg-[#FFD21C]/10 px-3 py-1 rounded-full border border-[#FFD21C]/20">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Link
                    aria-label={`View ${service.title}`}
                    className="text-[#71717A] group-hover:text-[#FFD21C] transition-colors"
                    to={`/services/${service.slug}`}
                  >
                    <ArrowUpRight size={20} />
                  </Link>
                </div>

                <h2 className="text-2xl font-black text-white mb-3 font-display group-hover:text-[#FFD21C] transition-colors">
                  {service.title}
                </h2>
                <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6 font-sans">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {service.scope.map((item) => (
                    <span
                      key={item}
                      className="font-mono text-xs text-[#A1A1AA] bg-[#1C1C1C] px-3 py-1 rounded-md border border-white/5"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#222222]/80">
                <Link
                  className="button button-gold button-small font-mono text-xs font-bold uppercase inline-flex items-center gap-1.5"
                  to={`/services/${service.slug}`}
                >
                  <span>Learn More</span>
                  <ArrowUpRight aria-hidden="true" size={14} />
                </Link>
                <Link
                  className="text-xs font-mono font-bold text-[#FFD21C] hover:underline"
                  to={`/contact?service=${encodeURIComponent(service.enquiryValue)}`}
                >
                  Start Project →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Container */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#141414] border border-[#222222] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl mt-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 font-display">
              Need a custom scope or multiple deliverables?
            </h2>
            <p className="text-sm text-[#A1A1AA] max-w-xl m-0 font-sans">
              Tell us about your brand, channels, and timeline. We will recommend the most
              effective creative package for your requirements.
            </p>
          </div>
          <Link
            className="button button-gold shrink-0 py-3.5 px-8 font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
            to="/contact"
          >
            Start a Conversation <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
