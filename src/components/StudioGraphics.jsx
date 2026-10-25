import React from "react";

/**
 * Camera Viewfinder HUD Corner Crop Marks
 * Gives video thumbnails a film-monitor / camera rig look.
 */
export function ViewfinderCorners({ className = "", color = "currentColor" }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 z-10 p-3 ${className}`}>
      {/* Top Left */}
      <span
        className="absolute left-3 top-3 block h-3 w-3 border-l-2 border-t-2 opacity-85 transition-opacity"
        style={{ borderColor: color }}
      />
      {/* Top Right */}
      <span
        className="absolute right-3 top-3 block h-3 w-3 border-r-2 border-t-2 opacity-85 transition-opacity"
        style={{ borderColor: color }}
      />
      {/* Bottom Left */}
      <span
        className="absolute bottom-3 left-3 block h-3 w-3 border-b-2 border-l-2 opacity-85 transition-opacity"
        style={{ borderColor: color }}
      />
      {/* Bottom Right */}
      <span
        className="absolute bottom-3 right-3 block h-3 w-3 border-b-2 border-r-2 opacity-85 transition-opacity"
        style={{ borderColor: color }}
      />
    </div>
  );
}

/**
 * Animated Audio Equalizer Waveform Indicator
 */
export function AudioEqualizer({ isPlaying = false, className = "" }) {
  return (
    <span aria-hidden="true" className={`inline-flex items-end gap-[2px] h-3.5 ${className}`}>
      <span className={`w-[2px] rounded-full bg-current ${isPlaying ? "animate-audio-1" : "h-1"}`} />
      <span className={`w-[2px] rounded-full bg-current ${isPlaying ? "animate-audio-2" : "h-2.5"}`} />
      <span className={`w-[2px] rounded-full bg-current ${isPlaying ? "animate-audio-3" : "h-3.5"}`} />
      <span className={`w-[2px] rounded-full bg-current ${isPlaying ? "animate-audio-2" : "h-1.5"}`} />
    </span>
  );
}

/**
 * Timecode Badge inspired by NLE timelines (Premiere / DaVinci)
 */
export function TimecodeBadge({ timecode = "00:01:24:18", label = "TC", className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border border-white/20 bg-black/75 text-white backdrop-blur-md shadow-sm ${className}`}>
      <span className="text-[#FF4D2D] text-[9px] font-black">{label}</span>
      <span>{timecode}</span>
    </span>
  );
}

/**
 * Film Format / Aspect Ratio Pill
 */
export function AspectPill({ aspect = "16:9", resolution = "4K", className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-black/75 text-white/95 border border-white/15 backdrop-blur-md shadow-sm ${className}`}>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00E599] shadow-[0_0_8px_#00E599]" />
      <span>{aspect}</span>
      <span className="text-white/40">/</span>
      <span className="text-white/80">{resolution}</span>
    </span>
  );
}

/**
 * Recording Indicator ("REC ●")
 */
export function RecIndicator({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-black/75 text-white border border-white/20 backdrop-blur-md shadow-sm ${className}`}>
      <span className="inline-block w-2 h-2 rounded-full bg-[#FF4D2D] animate-pulse shadow-[0_0_8px_#FF4D2D]" />
      <span>REC</span>
    </span>
  );
}

/**
 * Timeline Razor / Edit Point Icon
 */
export function EditRazorIcon({ size = 16, className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" x2="8.12" y1="4" y2="15.88" />
      <line x1="14.47" x2="20" y1="14.48" y2="20" />
      <line x1="8.12" x2="12" y1="8.12" y2="12" />
    </svg>
  );
}

/**
 * Resolution & Color Depth Badge (4K DCI // 10-BIT // PRORES)
 */
export function ResolutionBadge({ text = "4K DCI // 10-BIT", className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/90 border border-white/10 backdrop-blur-sm ${className}`}>
      {text}
    </span>
  );
}

/**
 * Timeline Mini Scrub Bar
 */
export function TimelineScrubber({ progress = 42, className = "" }) {
  return (
    <div className={`w-full flex items-center gap-2 font-mono text-[10px] text-white/60 ${className}`}>
      <div className="flex-1 h-1 bg-white/15 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-[#FF4D2D] to-[#635BFF] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-[9px] text-[#00E599] font-bold">LOCKED</span>
    </div>
  );
}
