export const serviceOfferings = [
  {
    slug: "social-media-management",
    title: "Social Media Management",
    shortDescription: "Strategy, content planning, publishing and account management.",
    description:
      "A connected social-media service covering strategy, content planning, publishing and ongoing account management, shaped around your brand and requirements.",
    scope: [
      "Social media strategy",
      "Content planning",
      "Publishing",
      "Account management",
    ],
    enquiryValue: "Social Media Management",
  },
  {
    slug: "video-shoots",
    title: "Video Production",
    shortDescription: "Professional shoots planned around your content and campaign.",
    description:
      "Professional video shooting for brands, businesses and campaigns. Production requirements and the creative approach are agreed against your brief.",
    scope: ["Production planning", "Video shooting", "Footage handover by agreed scope"],
    enquiryValue: "Video Production",
  },
  {
    slug: "professional-video-editing",
    title: "Video Editing",
    shortDescription: "Professional edits for social, YouTube and branded content.",
    description:
      "Professional editing for footage you already have or content in production, with the final format and deliverables agreed before work begins.",
    scope: ["Footage and brief review", "Professional editing", "Final exports by agreed scope"],
    enquiryValue: "Video Editing",
  },
  {
    slug: "podcast-production",
    title: "Podcast Production",
    shortDescription: "Podcast shooting, editing and social-ready short clips.",
    description:
      "Podcast video production shaped around the format you have in mind, including shooting and editing requirements discussed during the brief.",
    scope: ["Podcast shooting", "Podcast video editing", "Short clips by agreed scope"],
    enquiryValue: "Podcast Production",
  },
  {
    slug: "youtube-channel-management",
    title: "YouTube Channel Management",
    shortDescription: "Channel planning and management alongside video production.",
    description:
      "YouTube channel strategy, content planning, video editing, thumbnails and ongoing management, with responsibilities agreed to fit your channel and brief.",
    scope: ["Channel strategy", "Content planning", "Video editing", "Thumbnails and management by scope"],
    enquiryValue: "YouTube Channel Management",
  },
  {
    slug: "content-creation",
    title: "Content Creation",
    shortDescription: "Reels, short-form videos, campaigns and branded content.",
    description:
      "Creative content production for social platforms, from Reels and short-form video to campaign and branded content.",
    scope: ["Reels and short-form content", "Campaign content", "Branded content"],
    enquiryValue: "Content Creation",
  },
  {
    slug: "digital-growth",
    title: "Digital Growth",
    shortDescription: "Content strategy and digital execution for a stronger presence.",
    description:
      "Content strategy and digital execution intended to strengthen online visibility and brand presence. Outcomes depend on many factors and are not guaranteed.",
    scope: ["Digital content strategy", "Online presence planning", "Execution by agreed scope"],
    enquiryValue: "Digital Growth",
  },
  {
    slug: "brand-content",
    title: "Brand Content",
    shortDescription: "Consistent visual and video communication for your brand.",
    description:
      "Brand-focused visual and video content that supports a more consistent digital identity across the platforms and formats in your brief.",
    scope: ["Creative direction by brief", "Visual and video content", "Digital brand consistency"],
    enquiryValue: "Brand Content",
  },
];

export const studioFacts = [
  { value: "6+", label: "Years of experience" },
  { value: "10+", label: "Creative team members" },
  { value: "12+", label: "Active clients" },
  { value: "1,000+", label: "Content and creative projects" },
];

export const studioReasons = [
  {
    title: "Experience",
    detail:
      "Six-plus years of practical experience across video editing, content and digital media.",
  },
  {
    title: "A complete team",
    detail:
      "More than ten people working across creative, production and digital execution.",
  },
  {
    title: "End-to-end support",
    detail:
      "Bring planning, shooting, editing, publishing and account management into one coordinated brief.",
  },
  {
    title: "Consistency",
    detail:
      "Build a dependable rhythm for professional, on-brand digital communication.",
  },
  {
    title: "Creative with intent",
    detail:
      "Shape content around your brand and business objectives, not just a posting schedule.",
  },
  {
    title: "One partner",
    detail:
      "Coordinate your content needs with one team instead of juggling several vendors.",
  },
];

export const contentJourney = [
  {
    label: "Discover",
    detail: "Understand the brand, audience, goals and current digital presence.",
  },
  {
    label: "Strategy",
    detail: "Agree on the content direction, platforms and practical project scope.",
  },
  {
    label: "Create",
    detail: "Plan and produce the agreed video, social and brand content.",
  },
  {
    label: "Edit",
    detail: "Shape the footage into polished deliverables for the agreed formats.",
  },
  {
    label: "Publish",
    detail: "Publish and manage content when those responsibilities are in scope.",
  },
  {
    label: "Optimize",
    detail:
      "Review available performance information and apply useful learning to future content. Results are not guaranteed.",
  },
];

export function getServiceBySlug(slug) {
  return serviceOfferings.find((service) => service.slug === slug);
}
