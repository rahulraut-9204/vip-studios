import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { contactConfig, getWhatsAppHref } from "../data/contact.js";
import { serviceOfferings } from "../data/services.js";
import Brand from "./Brand.jsx";

const footerLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Work", to: "/work" },
  { label: "Process", to: "/process" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function SiteFooter() {
  const whatsAppHref = getWhatsAppHref();

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-intro">
          <h2>Content.<br />Creativity.<br />Growth.</h2>
          <Link className="button button-gold" to="/contact">
            Let&apos;s grow your brand <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
          <p>One partner for your digital content journey.</p>
          <p className="footer-service-area">Working across India</p>
        </div>
        <div className="footer-group">
          <h3>Explore</h3>
          <nav aria-label="Footer navigation" className="footer-link-list">
            {footerLinks.map((link) => (
              <Link key={link.to} to={link.to}>{link.label}</Link>
            ))}
          </nav>
        </div>
        <div className="footer-group">
          <h3>Services</h3>
          <ul className="footer-link-list">
            {serviceOfferings.map((service) => (
              <li key={service.slug}>
                <Link to={`/services/${service.slug}`}>{service.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-details">
          <Brand />
          {contactConfig.email ? (
            <a className="footer-contact" href={`mailto:${contactConfig.email}`}>
              {contactConfig.email}
            </a>
          ) : (
            <span className="footer-contact footer-placeholder">
              Email contact unavailable
            </span>
          )}
          {contactConfig.phoneNumber && (
            <a className="footer-contact" href={`tel:+${contactConfig.phoneNumber}`}>
              {contactConfig.phoneDisplay}
            </a>
          )}
          {whatsAppHref && (
            <a className="footer-contact" href={whatsAppHref} rel="noreferrer" target="_blank">
              WhatsApp <ArrowUpRight aria-hidden="true" size={13} />
            </a>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} VIP StudioS</span>
        <span>Our work includes illustrative concept studies, not commissioned projects.</span>
        <Link to="/contact">Start a project <ArrowUpRight aria-hidden="true" size={13} /></Link>
      </div>
    </footer>
  );
}
