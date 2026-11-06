import cameraCloseup from "../assets/studies/camera-closeup.webp";
import editingTimeline from "../assets/studies/editing-timeline.webp";
import productFocus from "../assets/studies/product-focus.webp";
import socialPlanning from "../assets/studies/social-planning.webp";
import studioProcess from "../assets/studies/studio-process.webp";

export const localFallbackImages = {
  "brand-film-production": cameraCloseup,
  "the-long-take": editingTimeline,
  "feed-in-motion": socialPlanning,
  "behind-the-frame": cameraCloseup,
  "the-dialogue-room": studioProcess,
  "product-in-focus": productFocus,
  "velocity-reel": studioProcess,
  default: editingTimeline,
};

export function getFallbackImage(slug = "") {
  return localFallbackImages[slug] || localFallbackImages.default;
}
