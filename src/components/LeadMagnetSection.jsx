import { useState } from "react";
import { Download, Sparkles, CheckCircle2 } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabase.js";
import { trackEvent } from "../data/analytics.js";

export default function LeadMagnetSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDownload(e) {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("enquiries").insert({
          name: "Lead Magnet Subscriber",
          email,
          service: "Lead Magnet / 2026 Hook Checklist",
          requirements: "Requested free 2026 Viral Hook & Retention Checklist PDF",
          status: "lead_magnet",
        });
      }
      trackEvent("lead_magnet_downloaded", { email });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-[#0E0E0E] to-[#0A0A0A] border-t border-[#1E1E1E] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#161616] via-[#141414] to-[#111111] border border-[#FFD21C]/30 shadow-[0_0_50px_rgba(255,210,28,0.08)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD21C]/10 border border-[#FFD21C]/25 text-[#FFD21C] text-[11px] font-mono font-bold uppercase tracking-wider mb-4">
              <Sparkles size={13} /> FREE CREATOR &amp; BRAND PLAYBOOK
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight leading-tight mb-3">
              The 2026 Viral Retention <br />
              <span className="text-[#FFD21C]">Hook &amp; Editing Checklist.</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] font-sans leading-relaxed m-0 mb-4">
              The exact 15-point editing audit we use on every client video to stop drop-off within the first 3 seconds and double average watch time.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-[#CCCCCC]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#FFD21C]" /> 50+ Tested Hooks
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#FFD21C]" /> DaVinci Scope Settings
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#FFD21C]" /> Instant 1-Click PDF
              </span>
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0 min-w-[280px] sm:min-w-[340px]">
            {submitted ? (
              <div className="p-6 rounded-2xl bg-[#1C1C1C] border border-[#FFD21C]/40 text-center">
                <CheckCircle2 size={36} className="text-[#FFD21C] mx-auto mb-2" />
                <h4 className="text-base font-bold text-white font-display mb-1">Checklist Unlocked!</h4>
                <p className="text-xs text-[#A1A1AA] mb-4">
                  We have sent the PDF download link to <strong>{email}</strong>.
                </p>
                <a
                  href="#contact"
                  className="button button-gold button-small font-mono text-xs uppercase font-bold w-full"
                >
                  Book Free Strategy Call
                </a>
              </div>
            ) : (
              <form onSubmit={handleDownload} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#2E2E2E] focus:border-[#FFD21C] rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-mono"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="button button-gold w-full py-4 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-lg inline-flex items-center justify-center gap-2"
                >
                  <Download size={15} />
                  <span>{loading ? "Generating Access…" : "Get Free Checklist PDF"}</span>
                </button>
                <span className="text-[10px] font-mono text-center text-[#71717A]">
                  🔒 100% Free · No spam ever · Unsubscribe anytime
                </span>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
