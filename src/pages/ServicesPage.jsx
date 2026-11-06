import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { serviceOfferings } from "../data/services.js";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <section className="studio-page vip-services-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        <header className="studio-page-intro mb-12">
          <p className="studio-location font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
            WHAT WE DO · SERVICES &amp; SCOPE
          </p>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none mb-4 font-display">
            Your complete
            <br />
            <span className="text-[#FFD21C]">creative content partner.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1AA] max-w-2xl leading-relaxed font-sans">
            Bring video editing, production shoots, short-form reels, podcast recording,
            and YouTube channel management into one cohesive creative partner.
          </p>
        </header>

        <div className="vip-services-list flex flex-col gap-6 my-12">
          {serviceOfferings.map((service, index) => (
            <article className="vip-service-line p-6 sm:p-8 rounded-2xl bg-[#141414] border border-[#222222] hover:border-[#FFD21C]/50 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6" key={service.slug}>
              <div className="flex items-start gap-5 flex-1">
                <span className="font-mono text-2xl sm:text-3xl font-black text-[#FFD21C] shrink-0 mt-0.5">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-2xl font-black text-white mb-2 font-display">{service.title}</h2>
                  <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-2xl m-0 font-sans">{service.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {service.scope.map((item) => (
                      <span
                        key={item}
                        className="font-mono text-xs text-[#A1A1AA] bg-[#1C1C1C] px-2.5 py-1 rounded border border-white/5"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-3 shrink-0 items-start md:items-end">
                <Link
                  aria-label={`Explore ${service.title}`}
                  className="button button-gold button-small font-mono text-xs font-bold uppercase inline-flex items-center gap-1.5"
                  to={`/services/${service.slug}`}
                >
                  <span>View Details</span>
                  <ArrowUpRight aria-hidden="true" size={14} />
                </Link>
                <Link
                  className="text-xs font-mono font-bold text-[#FFD21C] hover:underline"
                  to={`/contact?service=${encodeURIComponent(service.enquiryValue)}`}
                >
                  Book this service →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="font-mono text-xs text-[#71717A] text-center my-8">
          Deliverables, format requirements, turnaround times, and scope are confirmed
          before production begins. No unexpected surprises or hidden conditions.
        </p>

        <div className="p-8 sm:p-12 rounded-2xl bg-[#141414] border border-[#222222] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl mt-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 font-display">Need a custom scope or multiple deliverables?</h2>
            <p className="text-sm text-[#A1A1AA] max-w-xl m-0 font-sans">
              Tell us about your brand, channels, and timeline. We will recommend the most
              effective creative package for your budget.
            </p>
          </div>
          <Link className="button button-gold shrink-0 py-3.5 px-8 font-mono text-xs font-bold uppercase tracking-wider" to="/contact">
            Start a conversation <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
