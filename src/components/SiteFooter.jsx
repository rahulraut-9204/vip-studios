import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { contactConfig } from "../data/contact.js";
import Brand from "./Brand.jsx";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-intro">
          <h2>Got an idea?<br />Let&apos;s give it a life.</h2>
          <Link className="button button-gold" to="/contact">
            Tell us about it <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <div className="footer-details">
          <Brand />
          <p>Social, shot &amp; edited.</p>
          {contactConfig.email ? (
            <a className="footer-contact" href={`mailto:${contactConfig.email}`}>
              {contactConfig.email}
            </a>
          ) : (
            <span className="footer-contact footer-placeholder">
              Public contact details to be added
            </span>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <span>VIP StudioS</span>
        <span>Concept imagery shown · Real work coming soon</span>
        <Link to="/contact">Enquire <ArrowUpRight aria-hidden="true" size={13} /></Link>
      </div>
    </footer>
  );
}
