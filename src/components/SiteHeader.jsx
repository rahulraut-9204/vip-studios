import { ArrowUpRight, ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { getWhatsAppHref } from "../data/contact.js";
import Brand from "./Brand.jsx";

const links = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Work", to: "/work" },
  { label: "Process", to: "/process" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCondensed, setIsCondensed] = useState(false);
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const menuToggleRef = useRef(null);
  const islandToggleRef = useRef(null);
  const location = useLocation();
  const whatsAppHref = getWhatsAppHref();
  const currentPage =
    [...links]
      .reverse()
      .find(
        (link) =>
          location.pathname === link.to ||
          (link.to !== "/" && location.pathname.startsWith(`${link.to}/`)),
      )?.label ?? "Studio";

  useEffect(() => {
    setMenuOpen(false);
    setIsPinnedOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let frame = 0;
    function updateScrollState() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setIsCondensed(window.scrollY > 72);
        frame = 0;
      });
    }
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScrollState);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen && !isPinnedOpen) return undefined;
    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setIsPinnedOpen(false);
        (menuOpen ? menuToggleRef : islandToggleRef).current?.focus();
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen, isPinnedOpen]);

  function closeNavigation() {
    setMenuOpen(false);
    setIsPinnedOpen(false);
  }

  return (
    <header
      className={`site-header${isCondensed ? " is-condensed" : ""}${isPinnedOpen ? " is-pinned-open" : ""}`}
    >
      <div className="header-inner">
        <Brand onNavigate={closeNavigation} />
        <span aria-hidden="true" className="header-current-page">{currentPage}</span>
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
          aria-expanded={isPinnedOpen}
          aria-label={isPinnedOpen ? "Collapse navigation" : "Keep navigation expanded"}
          className="header-island-toggle"
          onClick={() => setIsPinnedOpen((open) => !open)}
          ref={islandToggleRef}
          type="button"
        >
          <ChevronDown aria-hidden="true" size={17} />
        </button>
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
              onClick={closeNavigation}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            className="button button-small button-gold header-cta"
            onClick={closeNavigation}
            to="/contact"
          >
            Let&apos;s grow your brand <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
