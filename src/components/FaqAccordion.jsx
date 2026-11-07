import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How much does it cost, and how are retainers structured?",
      a: "Our dedicated monthly retainers start at $1,450/month for active short-form sprints and $2,850/month for our full Growth Engine (which includes daily reels, long-form YouTube masters, and channel management). All prices are flat monthly rates with zero hidden fees.",
    },
    {
      q: "What is your typical turnaround time?",
      a: "Vertical reels and short-form cuts are delivered within 24 to 48 business hours. Long-form YouTube edits and podcast episodes are typically delivered in 3 to 4 business days. Need something faster? Rush same-day turnaround is available on priority packages.",
    },
    {
      q: "What is your revision policy if I need changes?",
      a: "We offer unlimited revisions until you are 100% satisfied with the cut. We utilize collaborative timecoded review links (Frame.io style) so you can pause at any second, leave precise feedback, and our editors turn around revisions within 12-24 hours.",
    },
    {
      q: "Which platforms do you optimize video content for?",
      a: "We engineer content natively for YouTube (16:9 4K and Shorts), Instagram (Reels & Feed), TikTok (9:16), LinkedIn (square/vertical executive video), and paid social ads (Meta & TikTok Ads). Every cut is formatted with platform-specific safe zones and aspect ratios.",
    },
    {
      q: "Are there long-term contracts or lock-ins?",
      a: "No. All our retainers operate on a flexible month-to-month basis. You can pause or cancel anytime with a simple 30-day notice. We earn your partnership every single month through measurable retention and view growth.",
    },
    {
      q: "How do we hand over raw footage and brand assets?",
      a: "We provide an automated cloud workspace via Google Drive, Dropbox, or Frame.io. You simply upload your raw camera clips, voice recordings, or b-roll, and our studio ingest engine immediately queues them for cutting.",
    },
  ];

  function toggleFaq(index) {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="py-24 bg-[#0A0A0A] relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD21C]/10 border border-[#FFD21C]/25 text-[#FFD21C] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <HelpCircle size={14} /> CLARITY &amp; ANSWERS
          </div>
          <h2
            id="faq-title"
            className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display m-0 mb-4"
          >
            Frequently Asked <span className="text-[#FFD21C]">Questions.</span>
          </h2>
          <p className="text-base text-[#A1A1AA] m-0 font-sans leading-relaxed">
            Everything you need to know about working with VIP StudioS before our kickoff call.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-[#141414] border-[#FFD21C]/50 shadow-lg"
                    : "bg-[#141414]/70 border-[#222222] hover:border-[#333333]"
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-bold text-base sm:text-lg text-white">
                    {faq.q}
                  </span>
                  <span
                    className={`w-8 h-8 rounded-full bg-[#1C1C1C] text-[#FFD21C] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#FFD21C] text-[#0A0A0A]" : ""
                    }`}
                  >
                    <ChevronDown size={18} />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#A1A1AA] font-sans leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
