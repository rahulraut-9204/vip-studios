import { useEffect, useState } from "react";

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-[#FFD21C] via-[#FFF2A6] to-[#FFD21C] transition-[width] duration-75 shadow-[0_0_10px_#FFD21C]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
