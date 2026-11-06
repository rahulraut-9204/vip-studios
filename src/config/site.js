const publicEmail = import.meta.env.VITE_PUBLIC_EMAIL || "mr.rohit8530@gmail.com";
const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || "+91 8530541815";

export const CATEGORIES = [
  "Social Media",
  "Video",
  "Reels",
  "Podcast",
  "YouTube",
  "Branding",
];

export const BRAND_JOURNEY = [
  "Strategy",
  "Content",
  "Shoot",
  "Edit",
  "Publish",
  "Manage",
  "Analyse",
  "Grow",
];

const site = {
  studioName: "VIP StudioS",
  tagline: "WE BUILD BRANDS. GROW BUSINESSES...",
  footerTagline: "VISION → IDENTITY → PERFORMANCE",
  domain: import.meta.env.VITE_SITE_URL || "https://vip-studios.pages.dev",
  email: publicEmail,
  phone: whatsapp,
  whatsapp,
  instagram: import.meta.env.VITE_INSTAGRAM_URL || "",
  youtube: import.meta.env.VITE_YOUTUBE_URL || "",
  location: "Global & On-Set Production",
  timezone: "IST / Global",
  social: {
    instagram: import.meta.env.VITE_INSTAGRAM_URL || "",
    youtube: import.meta.env.VITE_YOUTUBE_URL || "",
    whatsapp,
  },
};

export default site;
