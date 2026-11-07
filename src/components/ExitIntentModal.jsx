import { useState, useEffect } from "react";
import { X, Gift, CheckCircle2, ArrowRight } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabase.js";
import { trackEvent } from "../data/analytics.js";

export default function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    if (sessionStorage.getItem("vip_exit_dismissed")) return;

    function handleMouseLeave(e) {
      if (e.clientY <= 12 && !sessionStorage.getItem("vip_exit_dismissed")) {
        setIsOpen(true);
        sessionStorage.setItem("vip_exit_dismissed", "true");
      }
    }

    // Also trigger on 45-second timer as backup
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem("vip_exit_dismissed")) {
        setIsOpen(true);
        sessionStorage.setItem("vip_exit_dismissed", "true");
      }
    }, 45000);

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timer);
    };
  }, []);

  function handleClose() {
    setIsOpen(false);
    sessionStorage.setItem("vip_exit_dismissed", "true");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("enquiries").insert({
          name: "Exit Intent Lead",
          email,
          service: "Free 30-Day Content Calendar & Audit",
          requirements: "Requested free 30-day content calendar blueprint via exit popup.",
          status: "exit_intent",
        });
      }
      trackEvent("exit_intent_lead_captured", { email });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-[#141414] border-2 border-[#FFD21C] rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(255,210,28,0.25)] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          aria-label="Close popup"
          className="absolute top-4 right-4 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-[#FFD21C]/15 border border-[#FFD21C]/40 text-[#FFD21C] flex items-center justify-center mx-auto mb-4">
          <Gift size={28} />
        </div>

        <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold block mb-1">
          WAIT! BEFORE YOU GO…
        </span>
        <h3 id="exit-modal-title" className="text-2xl sm:text-3xl font-black text-white font-display mb-2">
          Claim Your Free 30-Day Content Roadmap
        </h3>
        <p className="text-xs sm:text-sm text-[#A1A1AA] font-sans leading-relaxed mb-6">
          Get 30 viral video ideas, plug-and-play hook scripts, and our high-retention editing formula sent directly to your inbox.
        </p>

        {submitted ? (
          <div className="p-4 rounded-xl bg-[#1C1C1C] border border-[#FFD21C]/40 text-center">
            <CheckCircle2 size={32} className="text-[#FFD21C] mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white font-display mb-1">Check Your Inbox!</h4>
            <p className="text-xs text-[#A1A1AA] m-0">
              The 30-Day Roadmap has been dispatched to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#2E2E2E] focus:border-[#FFD21C] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="button button-gold w-full py-3.5 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-lg inline-flex items-center justify-center gap-2"
            >
              <span>{loading ? "Sending..." : "Send Me The Free Blueprint"}</span>
              <ArrowRight size={14} />
            </button>
            <span className="text-[10px] font-mono text-[#71717A]">
              100% Free · No spam guarantee
            </span>
          </form>
        )}
      </div>
    </div>
  );
}
