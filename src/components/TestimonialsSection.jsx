import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle, Play } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Rohan Kulkarni",
      role: "Founder & CEO",
      company: "Apex Tech Ventures",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      quote:
        "VIP StudioS completely transformed how our tech leadership connects with prospects. We went from struggling to post once a week to putting out 20+ viral reels and high-converting YouTube breakdowns monthly. Our qualified inbound leads tripled in 90 days.",
      result: "+310% Inbound Pipeline",
      rating: 5,
      hasVideo: true,
    },
    {
      name: "Sarah Chen",
      role: "Head of Growth",
      company: "Luminary D2C Brands",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      quote:
        "The editing speed and attention to retention psychology are unmatched. Their micro-hooks and DaVinci color grading made our TikTok and Meta ad creatives 4x more profitable. They truly act like an in-house partner rather than a vendor.",
      result: "4.8x Meta Ad ROAS",
      rating: 5,
      hasVideo: false,
    },
    {
      name: "Marcus Vance",
      role: "Executive Creator & Host",
      company: "The Blueprint Podcast",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      quote:
        "Finding an editing team that understands podcast pacing, dynamic camera switching, and broadcast audio mastering is rare. VIP StudioS turned our studio recordings into a top-charting business show with millions of views on Shorts.",
      result: "125K+ Subscribers in 4 Months",
      rating: 5,
      hasVideo: true,
    },
    {
      name: "Pooja Deshmukh",
      role: "Managing Director",
      company: "Kala Brand Collective",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      quote:
        "Before working with VIP StudioS, we were spending 25+ hours a week trying to edit videos internally with mediocre results. Now, we simply drop our raw footage in Google Drive, and 48 hours later, we have ready-to-publish masterpieces.",
      result: "Saved 20+ Hours Weekly",
      rating: 5,
      hasVideo: false,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  function prevSlide() {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }

  function nextSlide() {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="py-24 bg-[#0A0A0A] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
                CLIENT TESTIMONIALS &amp; PRAISE
              </span>
            </div>
            <h2
              id="testimonials-title"
              className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display m-0"
            >
              Trusted by creators and <br />
              <span className="text-[#FFD21C]">ambitious brands.</span>
            </h2>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="w-12 h-12 rounded-full bg-[#161616] border border-[#2A2A2A] text-white hover:text-[#0A0A0A] hover:bg-[#FFD21C] hover:border-[#FFD21C] transition-all flex items-center justify-center cursor-pointer shadow-md"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="w-12 h-12 rounded-full bg-[#161616] border border-[#2A2A2A] text-white hover:text-[#0A0A0A] hover:bg-[#FFD21C] hover:border-[#FFD21C] transition-all flex items-center justify-center cursor-pointer shadow-md"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Testimonials Carousel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {[
            testimonials[currentIndex],
            testimonials[(currentIndex + 1) % testimonials.length],
          ].map((item, idx) => (
            <article
              key={idx}
              className="p-8 sm:p-10 rounded-2xl bg-[#141414]/90 backdrop-blur-md border border-[#222222] hover:border-[#FFD21C]/50 transition-all duration-300 flex flex-col justify-between shadow-2xl relative group"
            >
              <Quote
                className="absolute top-6 right-6 text-white/5 group-hover:text-[#FFD21C]/15 transition-colors pointer-events-none"
                size={64}
              />

              <div>
                <div className="flex items-center gap-1 text-[#FFD21C] mb-6">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-current text-[#FFD21C]" />
                  ))}
                  <span className="text-xs font-mono text-white/60 ml-2 font-bold">5.0 Star Verified</span>
                </div>

                <p className="text-base sm:text-lg text-white font-sans leading-relaxed mb-8 italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-[#222222] flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#FFD21C]"
                    loading="lazy"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white font-display flex items-center gap-1.5 m-0">
                      <span>{item.name}</span>
                      <CheckCircle size={14} className="text-[#FFD21C]" />
                    </h3>
                    <p className="text-xs font-mono text-[#A1A1AA] m-0">
                      {item.role} · <span className="text-[#FFD21C]">{item.company}</span>
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-[#FFD21C]/10 border border-[#FFD21C]/30 text-[#FFD21C] text-xs font-mono font-bold shrink-0">
                  {item.result}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
