import { useEffect, useRef, useState } from "react";
import { Award, Users, Briefcase } from "lucide-react";

function CounterItem({ endValue, label, suffix = "", prefix = "", duration = 1600, icon: Icon, subtext }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.25 }
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime = null;
    let animationFrame;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * endValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    }

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, endValue, duration]);

  return (
    <div
      ref={elementRef}
      className="p-6 sm:p-8 rounded-2xl bg-[#141414]/90 backdrop-blur-md border border-[#222222] hover:border-[#FFD21C]/50 transition-all duration-300 shadow-xl group relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="w-12 h-12 rounded-xl bg-[#1C1C1C] border border-white/5 text-[#FFD21C] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FFD21C] group-hover:text-[#0A0A0A] transition-all">
          <Icon size={22} />
        </span>
        <span className="w-2 h-2 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]" />
      </div>

      <div className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight leading-none mb-2">
        <span className="text-[#FFD21C]">{prefix}</span>
        {count.toLocaleString()}
        <span className="text-[#FFD21C]">{suffix}</span>
      </div>

      <strong className="block text-white text-base font-display font-bold mb-1">
        {label}
      </strong>
      <p className="text-xs text-[#A1A1AA] m-0 font-sans leading-relaxed">
        {subtext}
      </p>
    </div>
  );
}

export default function StatsCounter() {
  const stats = [
    {
      endValue: 6,
      suffix: "+",
      label: "Years of Experience",
      subtext: "Hands-on social media management, brand positioning, and content production.",
      icon: Award,
    },
    {
      endValue: 10,
      suffix: "+",
      label: "Team Members",
      subtext: "Specialized creative directors, editors, graphic designers, and social strategists.",
      icon: Users,
    },
    {
      endValue: 12,
      suffix: "+",
      label: "Active or Managed Clients",
      subtext: "Retained brands, clinics, creators, and businesses across Pune and India.",
      icon: Briefcase,
    },
  ];

  return (
    <section
      aria-label="Trust and Experience"
      className="py-16 bg-[#0E0E0E] border-y border-[#1E1E1E] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21C] font-bold block mb-2">
            TRUST &amp; EXPERIENCE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-display m-0">
            Proven track record. <span className="text-[#FFD21C]">Authentic execution.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <CounterItem key={i} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
