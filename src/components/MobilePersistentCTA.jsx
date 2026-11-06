import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { getWhatsAppHref } from "../data/contact.js";

export default function MobilePersistentCTA() {
  const location = useLocation();
  const whatsAppHref = getWhatsAppHref(
    "Hi VIP StudioS, I'm interested in discussing a video editing or content project."
  );

  // Hide on contact page itself or admin page
  if (location.pathname === "/contact" || location.pathname.startsWith("/admin") || location.pathname.startsWith("/studio/admin")) {
    return null;
  }

  return (
    <aside
      aria-label="Quick mobile contact actions"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/95 border-t border-[#1E1E1E] backdrop-blur-md px-4 py-2.5 flex items-center justify-between gap-3 shadow-[0_-8px_24px_rgba(0,0,0,0.7)]"
    >
      <Link
        className="button button-gold flex-1 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
        to="/contact"
      >
        <span>Start a Project</span>
        <ArrowUpRight size={14} />
      </Link>

      {whatsAppHref && (
        <a
          aria-label="Instant WhatsApp Chat with VIP StudioS"
          className="p-3 rounded-full bg-[#25D366] text-white hover:bg-[#1EBE5D] transition-colors shrink-0 shadow-md flex items-center justify-center"
          href={whatsAppHref}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle size={18} />
        </a>
      )}
    </aside>
  );
}
