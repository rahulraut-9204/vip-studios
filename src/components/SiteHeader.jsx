import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Brand from "./Brand.jsx";

const links = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCondensed, setIsCondensed] = useState(false);
  const menuToggleRef = useRef(null);
  const navigationRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let frame = 0;
    function updateScrollState() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setIsCondensed(window.scrollY > 80);
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
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function manageMenuFocus(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !navigationRef.current) return;
      const focusable = navigationRef.current.querySelectorAll(
        'a[href], button:not([disabled])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", manageMenuFocus);
    navigationRef.current.querySelector("a, button")?.focus();
    return () => {
      window.removeEventListener("keydown", manageMenuFocus);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  function closeNavigation() {
    setMenuOpen(false);
  }

  return (
    <header className={`site-header${isCondensed ? " is-condensed" : ""}`}>
      <div className="header-inner">
        <Brand onNavigate={closeNavigation} />
        <span aria-hidden="true" className="header-wordmark">VIP STUDIOS</span>
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
          ref={navigationRef}
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
            Start a project <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
