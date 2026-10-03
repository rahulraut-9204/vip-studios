import { ArrowUpRight, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { getWhatsAppHref } from "../data/contact.js";
import Brand from "./Brand.jsx";

const links = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Our Work", to: "/work" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggleRef = useRef(null);
  const location = useLocation();
  const whatsAppHref = getWhatsAppHref();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand onNavigate={() => setMenuOpen(false)} />
        {whatsAppHref && (
          <a
            aria-label="Message VIP StudioS on WhatsApp"
            className="header-whatsapp"
            href={whatsAppHref}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle aria-hidden="true" size={17} />
            <span>WhatsApp</span>
          </a>
        )}
        <button
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          ref={menuToggleRef}
          type="button"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav
          aria-label="Main navigation"
          className={`primary-navigation${menuOpen ? " is-open" : ""}`}
          id="primary-navigation"
        >
          {links.map((link) => (
            <NavLink
              className={({ isActive }) =>
                `nav-link${isActive ? " is-active" : ""}`
              }
              end={link.to === "/"}
              key={link.to}
              onClick={() => setMenuOpen(false)}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            className="button button-small button-gold header-cta"
            onClick={() => setMenuOpen(false)}
            to="/contact"
          >
            Start a project <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
