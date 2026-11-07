import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What social media services do you provide?",
      a: "VIP StudioS provides end-to-end social media solutions: comprehensive account management, content strategy, monthly editorial planning, Reels and short-form creation, professional video shooting and editing, multi-camera podcast production, YouTube channel management, custom carousels and graphic design, content publishing, and monthly performance analysis.",
    },
    {
      q: "Which platforms do you manage?",
      a: "We actively manage Instagram accounts, Facebook pages, YouTube channels, and LinkedIn company profiles. Every platform has unique algorithms and audience expectations, so we tailor aspect ratios, copy, and posting times accordingly.",
    },
    {
      q: "Do you create monthly content calendars?",
      a: "Yes. Every month starts with a dedicated content calendar detailing post themes, hook concepts, format types (Reels, carousels, single graphics), and target publishing dates. Content is produced and scheduled in advance upon your review.",
    },
    {
      q: "Do you provide video shooting?",
      a: "Yes. We offer on-location video shooting in Pune and across Maharashtra. Our team arrives with professional cinema cameras, directional lighting, and wireless audio equipment to film batches of interviews, patient testimonials, property walkthroughs, or brand films.",
    },
    {
      q: "Do you create Instagram Reels?",
      a: "Absolutely. Reels creation is one of our flagship capabilities. We handle conceptualization, viral hook writing, footage editing, kinetic typography, trending audio selection, and color grading in DaVinci Resolve.",
    },
    {
      q: "Can you manage our complete Instagram and Facebook pages?",
      a: "Yes. Many of our clients delegate their complete page operations to us. We manage creative design, caption copywriting, hashtag strategy, daily/weekly publishing, story updates, and basic community inquiry routing.",
    },
    {
      q: "Do you provide YouTube management?",
      a: "Yes. We handle end-to-end YouTube channel management including long-form episodic video editing, clickable high-CTR custom thumbnails, SEO titles and descriptions, chaptering, playlist curation, and YouTube Shorts cutdowns.",
    },
    {
      q: "Do you offer monthly packages?",
      a: "Yes. We structure transparent monthly retainers tailored to your required volume of content (e.g., 12, 20, or 30+ posts/reels per month). Monthly packages ensure consistent execution, priority turnaround, and dependable brand growth.",
    },
    {
      q: "How does the onboarding process work?",
      a: "Onboarding is simple: (1) Discovery Call to understand your brand and targets; (2) Account Audit & Content Strategy Blueprint; (3) Asset handover via cloud storage; (4) Monthly content plan review; (5) Production and scheduled rollout.",
    },
    {
      q: "Do you work with businesses outside Pune?",
      a: "Yes. While our physical studio and production crew are based in Pune, we manage social media and video editing for clients across India and internationally. For remote clients, you can upload raw camera clips or smartphone footage to our cloud drive, and our post-production team handles the rest.",
    },
  ];

  function toggleFaq(index) {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-24 bg-[#0E0E0E] border-t border-[#1E1E1E] relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFD21C]/10 border border-[#FFD21C]/25 text-[#FFD21C] text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <HelpCircle size={14} /> CLARITY &amp; ANSWERS
          </div>
          <h2
            id="faq-heading"
            className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display m-0 mb-4"
          >
            Frequently Asked <span className="text-[#FFD21C]">Questions.</span>
          </h2>
          <p className="text-base text-[#A1A1AA] m-0 font-sans leading-relaxed">
            Everything you need to know about our social media management, video production, and retained partnerships.
          </p>
        </div>

        {/* 10 FAQs Accordion */}
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
                  type="button"
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
