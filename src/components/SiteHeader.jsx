import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Brand from "./Brand.jsx";

const links = [
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "Process", to: "/process" },
  { label: "About", to: "/about" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCondensed, setIsCondensed] = useState(false);
  const toggleRef = useRef(null);
  const navRef = useRef(null);
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    const update = () => setIsCondensed(window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    navRef.current?.querySelector("a")?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className={`new-header${isCondensed ? " is-condensed" : ""}`}>
      <div className="new-header-inner">
        <Brand onNavigate={() => setMenuOpen(false)} />
        <span className="new-header-divider" aria-hidden="true" />
        <span className="new-header-label">Creative studio / India</span>
        <button ref={toggleRef} aria-controls="primary-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"} className="new-menu-toggle" onClick={() => setMenuOpen((open) => !open)} type="button">
          {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
        <nav ref={navRef} aria-label="Main navigation" className={`new-navigation${menuOpen ? " is-open" : ""}`} id="primary-navigation">
          {links.map((link) => <NavLink className={({ isActive }) => `new-nav-link${isActive ? " is-active" : ""}`} end={link.to === "/"} key={link.to} onClick={() => setMenuOpen(false)} to={link.to}>{link.label}</NavLink>)}
          <Link className="new-nav-cta" onClick={() => setMenuOpen(false)} to="/contact">Start a brief <ArrowUpRight aria-hidden="true" size={15} /></Link>
        </nav>
      </div>
    </header>
  );
}
