const publicEmail = import.meta.env.VITE_PUBLIC_EMAIL || "";
const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || "";

export const CATEGORIES = [
  "Video Editing",
  "Reels & Short-form",
  "YouTube",
  "Social Media",
  "Corporate",
  "Other",
];

const site = {
  studioName: "VIP StudioS",
  tagline: "Crafting visual stories that move.",
  domain: import.meta.env.VITE_SITE_URL || "https://vip-studios.pages.dev",
  email: publicEmail,
  phone: whatsapp,
  whatsapp,
  instagram: import.meta.env.VITE_INSTAGRAM_URL || "",
  youtube: import.meta.env.VITE_YOUTUBE_URL || "",
  location: "",
  timezone: "",
  social: {
    instagram: import.meta.env.VITE_INSTAGRAM_URL || "",
    youtube: import.meta.env.VITE_YOUTUBE_URL || "",
    whatsapp,
  },
};

export default site;
