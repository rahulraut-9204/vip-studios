import { ArrowUpRight, MessageCircle, Instagram, Youtube, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { contactConfig, getWhatsAppHref } from "../data/contact.js";
import { serviceOfferings } from "../data/services.js";
import Brand from "./Brand.jsx";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Our Work", to: "/work" },
  { label: "About", to: "/about" },
  { label: "Process", to: "/process" },
  { label: "Contact", to: "/contact" },
];

export default function SiteFooter() {
  const whatsAppHref = getWhatsAppHref(
    "Hi VIP StudioS, I'm reaching out from your website footer to discuss social media management for my brand."
  );

  return (
    <footer className="site-footer bg-[#0A0A0A] border-t border-[#1E1E1E] text-white">
      {/* Top Tagline & CTA Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 border-b border-[#1E1E1E]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Brand />
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FFD21C] block">
                VIP STUDIOS // SOCIAL MEDIA &amp; CONTENT AGENCY
              </span>
              <p className="text-xl sm:text-2xl font-black text-white m-0 tracking-tight font-display">
                VISION → IDENTITY → PERFORMANCE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/contact" className="button button-gold">
              Let&apos;s Work Together <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
            {whatsAppHref && (
              <a
                className="button button-outline inline-flex items-center gap-1.5"
                href={whatsAppHref}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="footer-main max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3 font-display">
            Building digital presence through <br />
            <span className="text-[#FFD21C]">strategic social media &amp; content.</span>
          </h2>
          <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-md mb-6 font-sans">
            VIP StudioS helps businesses, brands, professionals, and creators build their digital presence through social media management, strategic content creation, professional video production, and creative communication.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3 text-[#A1A1AA]">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube channel"
              className="w-10 h-10 rounded-xl bg-[#141414] border border-[#222222] hover:border-[#FFD21C] hover:text-[#FFD21C] flex items-center justify-center transition-colors"
            >
              <Youtube size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram profile"
              className="w-10 h-10 rounded-xl bg-[#141414] border border-[#222222] hover:border-[#FFD21C] hover:text-[#FFD21C] flex items-center justify-center transition-colors"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="w-10 h-10 rounded-xl bg-[#141414] border border-[#222222] hover:border-[#FFD21C] hover:text-[#FFD21C] flex items-center justify-center transition-colors"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X / Twitter profile"
              className="w-10 h-10 rounded-xl bg-[#141414] border border-[#222222] hover:border-[#FFD21C] hover:text-[#FFD21C] flex items-center justify-center transition-colors"
            >
              <Twitter size={18} />
            </a>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFD21C] mb-4">
            Navigation
          </h3>
          <nav aria-label="Footer navigation" className="flex flex-col gap-2.5 text-sm font-sans">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-[#A1A1AA] hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFD21C] mb-4">
            Core Services
          </h3>
          <ul className="flex flex-col gap-2.5 list-none p-0 m-0 text-sm font-sans">
            {serviceOfferings.slice(0, 8).map((service) => (
              <li key={service.slug}>
                <Link
                  className="text-[#A1A1AA] hover:text-white transition-colors"
                  to={`/services/${service.slug}`}
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-3 text-sm font-sans">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFD21C] mb-1">
            Studio Desk
          </h3>
          <a
            className="text-[#A1A1AA] hover:text-[#FFD21C] transition-colors break-all"
            href={`mailto:${contactConfig.email || "mr.rohit8530@gmail.com"}`}
          >
            {contactConfig.email || "mr.rohit8530@gmail.com"}
          </a>
          <a
            className="text-[#A1A1AA] hover:text-white transition-colors"
            href="tel:+918530541815"
          >
            +91 85305 41815
          </a>
          {whatsAppHref && (
            <a
              className="text-[#FFD21C] font-mono text-xs uppercase tracking-wider inline-flex items-center gap-1 hover:underline"
              href={whatsAppHref}
              rel="noreferrer"
              target="_blank"
            >
              WhatsApp Studio Chat <ArrowUpRight size={13} />
            </a>
          )}
          <span className="text-xs font-mono text-[#71717A] mt-2 leading-relaxed">
            Location: Pune, Maharashtra, India.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-[#1E1E1E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#71717A]">
        <span>© {new Date().getFullYear()} VIP StudioS. All rights reserved.</span>
        <span className="text-[#FFD21C] font-bold">VISION → IDENTITY → PERFORMANCE</span>
        <Link className="hover:text-white transition-colors inline-flex items-center gap-1" to="/contact">
          Start a project <ArrowUpRight size={13} />
        </Link>
      </div>
    </footer>
  );
}
