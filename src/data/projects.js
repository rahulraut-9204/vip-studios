import cameraImage from "../assets/studies/camera-closeup.webp";
import editingImage from "../assets/studies/editing-timeline.webp";
import productImage from "../assets/studies/product-focus.webp";
import socialImage from "../assets/studies/social-planning.webp";

export const projects = [
  {
    slug: "feed-in-motion",
    title: "Feed in Motion",
    category: "Reels",
    format: "Concept short-form direction",
    year: "Concept",
    image: socialImage,
    imageAlt: "A small team planning content together around a laptop",
    imagePosition: "center 52%",
    accent: "amber",
    platform: "instagram",
    mediaType: "image",
    videoUrl: "",
    clientName: "",
    role: "Concept direction",
    result: "",
    summary:
      "An illustrative social-video concept shaped around shifting light, quick movement, and a city that never quite holds still.",
    approach:
      "This concept study explores how changing crops and a single warm highlight can guide attention through a short-form frame.",
    concept: true,
  },
  {
    slug: "product-in-focus",
    title: "Product in Focus",
    category: "Corporate",
    format: "Concept product shoot",
    year: "Concept",
    image: productImage,
    imageAlt: "A wristwatch used as illustrative concept imagery",
    imagePosition: "center 48%",
    accent: "silver",
    platform: "direct_video",
    mediaType: "image",
    videoUrl: "",
    clientName: "",
    role: "Concept direction",
    result: "",
    summary:
      "An illustrative shoot direction built around precision, material, and the reveal of a considered object.",
    approach:
      "A restrained lighting idea gives shape and surface equal weight without inventing product features or brand claims.",
    concept: true,
  },
  {
    slug: "the-long-take",
    title: "The Long Take",
    category: "Video Editing",
    format: "Concept edit study",
    year: "Concept",
    image: editingImage,
    imageAlt: "A video editing timeline displayed on a monitor",
    imagePosition: "center 57%",
    accent: "gold",
    platform: "youtube",
    mediaType: "image",
    videoUrl: "",
    clientName: "",
    role: "Editing direction",
    result: "",
    summary:
      "An illustrative editing study built around distance, changing weather, and natural light.",
    approach:
      "A sequence moves from wide and open to close and tactile, using pacing and contrast instead of an invented case result.",
    concept: true,
  },
  {
    slug: "behind-the-frame",
    title: "Behind the Frame",
    category: "YouTube",
    format: "Concept shoot treatment",
    year: "Concept",
    image: cameraImage,
    imageAlt: "A close-up of a camera and lenses, used as illustrative shoot imagery",
    imagePosition: "center 44%",
    accent: "white",
    platform: "direct_video",
    mediaType: "image",
    videoUrl: "",
    clientName: "",
    role: "Shoot treatment",
    result: "",
    summary:
      "A speculative look at the moment a rough idea starts to take shape on set.",
    approach:
      "The composition pairs an expressive frame with a clear visual sequence. The stock photograph is illustrative, not VIP StudioS work.",
    concept: true,
  },
];

export const projectCategories = [
  "All",
  "Video Editing",
  "Reels",
  "YouTube",
  "Social Media",
  "Corporate",
  "Other",
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}
