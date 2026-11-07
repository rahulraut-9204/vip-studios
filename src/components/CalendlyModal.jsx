import { X, Calendar, Clock, Video, CheckCircle2 } from "lucide-react";

export default function CalendlyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendly-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div
        className="relative w-full max-w-lg bg-[#141414] border border-[#FFD21C]/40 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close scheduling modal"
          className="absolute top-5 right-5 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
            1-ON-1 STRATEGY SESSION
          </span>
        </div>

        <h3
          id="calendly-modal-title"
          className="text-2xl sm:text-3xl font-black text-white font-display mb-2"
        >
          Book a 15-Min Growth Call
        </h3>
        <p className="text-xs sm:text-sm text-[#A1A1AA] font-sans leading-relaxed mb-6">
          Meet directly with our Creative Director to audit your current retention, discover video content gaps, and get a custom sprint quote.
        </p>

        <div className="space-y-3 mb-6 p-4 rounded-xl bg-[#1C1C1C] border border-[#2A2A2A] text-xs font-mono text-[#CCCCCC]">
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-[#FFD21C]" /> 15-Minute Zoom / Google Meet Call
          </div>
          <div className="flex items-center gap-2.5">
            <Video size={16} className="text-[#FFD21C]" /> Live Channel &amp; Retention Audit Included
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={16} className="text-[#FFD21C]" /> Zero Sales Pressure / Actionable Takeaways
          </div>
        </div>

        <div className="space-y-3">
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="button button-gold w-full py-4 text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,210,28,0.3)]"
          >
            <Calendar size={16} /> Open Calendly Calendar →
          </a>

          <a
            href="https://wa.me/918530541815?text=Hi%20VIP%20StudioS,%20I'd%20like%20to%20schedule%20a%2015-minute%20free%20strategy%20call."
            target="_blank"
            rel="noopener noreferrer"
            className="button button-outline w-full py-3 text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2"
          >
            Or Chat on WhatsApp Directly
          </a>
        </div>
      </div>
    </div>
  );
}
