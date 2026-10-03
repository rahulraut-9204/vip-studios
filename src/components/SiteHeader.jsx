import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Brand from "./Brand.jsx";

const links = [
  { label: "What we do", to: "/services" },
  { label: "Concepts", to: "/work" },
  { label: "Studio", to: "/about" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand onNavigate={() => setMenuOpen(false)} />
        <button
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
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
            Let&apos;s talk <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
