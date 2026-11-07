import { ArrowUpRight, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Brand from "./Brand.jsx";
import { getWhatsAppHref } from "../data/contact.js";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Our Work", to: "/work" },
  { label: "About", to: "/about" },
  { label: "Process", to: "/process" },
  { label: "Contact", to: "/contact" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuToggleRef = useRef(null);
  const location = useLocation();
  const whatsAppHref = getWhatsAppHref(
    "Hi VIP StudioS, I'm interested in social media management and content creation for my business."
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let frame = 0;
    function updateScrollState() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 25);
        frame = 0;
      });
    }
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScrollState);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#222222] py-3.5 shadow-2xl"
          : "bg-[#0A0A0A]/60 backdrop-blur-sm border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-3">
          <Brand onNavigate={() => setMenuOpen(false)} />
          <Link
            to="/"
            className="font-display font-black text-lg sm:text-xl tracking-tight text-white hover:text-[#FFD21C] transition-colors"
          >
            VIP <span className="text-[#FFD21C]">StudioS</span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-7 font-mono text-xs uppercase tracking-wider"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `transition-colors font-bold ${
                  isActive ? "text-[#FFD21C]" : "text-[#CCCCCC] hover:text-[#FFD21C]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/contact"
            className="button button-gold button-small font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,210,28,0.3)] hover:scale-105 transition-all"
          >
            <span>Let&apos;s Work Together</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          ref={menuToggleRef}
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="lg:hidden p-2 rounded-lg bg-[#161616] border border-[#2A2A2A] text-white hover:text-[#FFD21C] transition-colors"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#222222] px-6 py-8 animate-fade-in">
          <div className="flex flex-col gap-4 font-mono text-sm uppercase tracking-wider mb-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `py-2 border-b border-white/5 font-bold transition-colors ${
                    isActive ? "text-[#FFD21C]" : "text-white hover:text-[#FFD21C]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="button button-gold w-full py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-center"
            >
              Let&apos;s Work Together →
            </Link>
            {whatsAppHref && (
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noreferrer"
                className="button button-outline w-full py-3 text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} className="text-[#25D366]" /> Chat on WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
