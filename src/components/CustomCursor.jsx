import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    // Only enable on precise pointing devices (mouse) and if reduced motion is false
    const fineMatch = window.matchMedia("(pointer: fine)");
    const motionMatch = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!fineMatch.matches || motionMatch.matches) return;
    setIsFinePointer(true);

    function onMouseMove(e) {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    }

    function onMouseLeave() {
      setIsVisible(false);
    }

    function checkHover(e) {
      const target = e.target;
      if (
        target?.closest?.("a, button, input, textarea, select, [role='button'], .cursor-pointer")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseover", checkHover, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", checkHover);
    };
  }, [isVisible]);

  if (!isFinePointer || !isVisible) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Glow Ring */}
      <div
        className={`fixed -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FFD21C]/60 transition-transform duration-150 ease-out will-change-transform ${
          isHovering
            ? "w-10 h-10 bg-[#FFD21C]/15 scale-125 border-[#FFD21C] shadow-[0_0_15px_rgba(255,210,28,0.4)]"
            : "w-7 h-7 bg-transparent scale-100"
        }`}
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      />
      {/* Inner Dot */}
      <div
        className="fixed w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFD21C] shadow-[0_0_8px_#FFD21C]"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      />
    </div>
  );
}
