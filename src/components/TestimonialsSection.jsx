import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Dr. Ananya Joshi",
      role: "Managing Director",
      company: "Aura Aesthetic Clinic",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      quote:
        "VIP StudioS completely organized our social media presence. They handle everything from scripting patient education reels to video shooting in our clinic and daily publishing. Our clinic inquiries have seen a marked increase, and our patients regularly compliment our professional videos.",
      rating: 5,
    },
    {
      name: "Rohan Kulkarni",
      role: "Founder & Director",
      company: "Apex Media Group",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      quote:
        "Finding an agency in Pune that truly understands high-retention video editing and brand positioning was tough before meeting VIP StudioS. They are extremely dependable, deliver on time every week, and treat our brand as their own.",
      rating: 5,
    },
    {
      name: "Vikramaditya Shinde",
      role: "Host & Creator",
      company: "Founder Perspectives",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      quote:
        "The team handles our full multi-cam podcast video setup and turns each 45-minute recording into 30+ engaging short clips for Instagram and YouTube Shorts. Their sound design and DaVinci color grading give our show a world-class broadcast look.",
      rating: 5,
    },
    {
      name: "Pooja Deshmukh",
      role: "Co-Founder",
      company: "Kala Collective",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      quote:
        "We used to struggle with inconsistent posting. VIP StudioS gave us a structured monthly content calendar, eye-catching carousels, and high-retention reels. We save 20+ hours every month while maintaining a consistent aesthetic.",
      rating: 5,
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
      aria-labelledby="testimonials-heading"
      className="py-24 bg-[#0E0E0E] border-t border-[#1E1E1E] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold">
                CLIENT FEEDBACK
              </span>
            </div>
            <h2
              id="testimonials-heading"
              className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display m-0"
            >
              What Our <span className="text-[#FFD21C]">Clients Say.</span>
            </h2>
          </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  <span className="text-xs font-mono text-white/60 ml-2 font-bold">Verified Client</span>
                </div>

                <p className="text-base text-white font-sans leading-relaxed mb-8 italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-[#222222] flex items-center gap-4">
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
