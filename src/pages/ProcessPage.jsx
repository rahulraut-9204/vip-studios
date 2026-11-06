import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const clientExpectations = [
  {
    step: "01 · Brief & Discovery",
    title: "Discovery & Alignment",
    whatYouProvide: "Raw footage, brand guidelines, reference links, and target audience goals.",
    whatWeDeliver: "A structured scope document, agreed deliverable format list, and project calendar.",
  },
  {
    step: "02 · Creative Strategy",
    title: "Creative Direction & Planning",
    whatYouProvide: "Script outlines, key messaging requirements, and priority review feedback.",
    whatWeDeliver: "Pacing direction, sound/music styling references, and storyboard outlines.",
  },
  {
    step: "03 · Production & Assembly",
    title: "Rough Cut & Assembly",
    whatYouProvide: "Timely review of the initial cut via frame-accurate review links.",
    whatWeDeliver: "First assembly cut focusing on narrative flow, rhythm, and core structure.",
  },
  {
    step: "04 · Fine Cut & Polish",
    title: "Editing, Color & Sound",
    whatYouProvide: "Consolidated, single-round feedback on pacing and sound balance.",
    whatWeDeliver: "Color-graded picture, audio cleanup, dynamic motion graphics, and captions.",
  },
  {
    step: "05 · Final Handover",
    title: "Master Export & Delivery",
    whatYouProvide: "Final sign-off on delivered masters.",
    whatWeDeliver: "Full-resolution master files optimized for YouTube 4K, 9:16 Instagram Reels, and direct broadcast.",
  },
];

export default function ProcessPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <section className="studio-page vip-process-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        <header className="studio-page-intro mb-12">
          <p className="studio-location font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
            A CLEAR BRIEF-TO-DELIVERY WORKFLOW
          </p>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none mb-4 font-display">
            From first idea
            <br />
            <span className="text-[#FFD21C]">to final delivery.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1AA] max-w-2xl leading-relaxed font-sans">
            Whether you need a single edit or ongoing multi-channel content support, every
            project begins with a clear creative brief. Deliverables, revision rounds, and
            milestones are locked before production begins.
          </p>
        </header>

        {/* Process Flow Cards */}
        <div className="flex flex-col gap-6 my-12">
          {clientExpectations.map((stage) => (
            <article
              key={stage.step}
              className="p-6 sm:p-8 rounded-2xl bg-[#141414] border border-[#222222] shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
            >
              <div className="md:col-span-5">
                <span className="font-mono text-xs font-bold text-[#FFD21C] uppercase tracking-wider block mb-1">
                  {stage.step}
                </span>
                <h2 className="text-2xl font-black text-white mb-2 font-display">{stage.title}</h2>
                <p className="text-sm text-[#A1A1AA] m-0 font-sans leading-relaxed">
                  A structured checkpoint designed to ensure your goals are achieved without ambiguity.
                </p>
              </div>
              <div className="md:col-span-3 p-4 rounded-xl bg-[#181818] border border-[#262626]">
                <strong className="block font-mono text-xs text-[#FFD21C] uppercase tracking-wider mb-1">
                  What you supply
                </strong>
                <p className="text-xs sm:text-sm text-white/90 m-0 font-sans">{stage.whatYouProvide}</p>
              </div>
              <div className="md:col-span-4 p-4 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E]">
                <strong className="block font-mono text-xs text-white uppercase tracking-wider mb-1">
                  What the studio delivers
                </strong>
                <p className="text-xs sm:text-sm text-[#A1A1AA] m-0 font-sans">{stage.whatWeDeliver}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 rounded-2xl bg-[#141414] border border-[#222222] my-12">
          <div>
            <h3 className="text-lg font-bold text-white mb-1.5 font-display">Clear Revisions</h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] m-0 font-sans leading-relaxed">
              Consolidated feedback loops using timestamped review links prevent drift and keep delivery dates fixed.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1.5 font-display">Master Delivery Formats</h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] m-0 font-sans leading-relaxed">
              Exported in ProRes 422 HQ, H.265/H.264 masters, with clean split audio tracks for future repurposing.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1.5 font-display">Archived &amp; Scalable</h3>
            <p className="text-xs sm:text-sm text-[#A1A1AA] m-0 font-sans leading-relaxed">
              Your raw project libraries and grading LUTs are kept safely in cold storage for instant recall.
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-12 rounded-2xl bg-[#141414] border border-[#222222] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl mt-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 font-display">Ready to begin your project sprint?</h2>
            <p className="text-sm text-[#A1A1AA] max-w-xl m-0 font-sans">
              Share your brief, timeline, and footage scope with our team.
            </p>
          </div>
          <Link className="button button-gold shrink-0 py-3.5 px-8 font-mono text-xs font-bold uppercase tracking-wider" to="/contact">
            Start a project <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
