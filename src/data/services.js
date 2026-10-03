export const serviceAreas = [
  {
    id: "social",
    label: "Social media",
    enquiryValue: "Social strategy, planning & account management",
    title: "Stay in the conversation.",
    description:
      "A considered social presence, planned and managed from the first idea to the post going live.",
    deliverables: [
      "Social strategy",
      "Content planning",
      "Publishing",
      "Account management",
    ],
  },
  {
    id: "shoot",
    label: "Video shoots",
    enquiryValue: "Video shoots",
    title: "Give the idea a frame.",
    description:
      "Video shoots shaped around what you want to say, who needs to see it, and where it will live.",
    deliverables: [
      "Shoot planning",
      "Video capture",
      "Brand and social footage",
      "Creative direction",
    ],
  },
  {
    id: "edit",
    label: "Professional editing",
    enquiryValue: "Professional editing",
    title: "Make every second count.",
    description:
      "Thoughtful edits that find the pace, finish, and format for your story and its audience.",
    deliverables: [
      "Story and pacing",
      "Color and sound finish",
      "Captions and cutdowns",
      "Social-ready formats",
    ],
  },
];

export const contentJourney = [
  { label: "Discover", detail: "Understand the goal, audience and brief." },
  { label: "Plan", detail: "Set a creative direction and production plan." },
  { label: "Create", detail: "Shoot, edit and produce the agreed content." },
  { label: "Review", detail: "Review the first version together." },
  { label: "Refine", detail: "Apply revisions agreed in the project scope." },
  { label: "Deliver", detail: "Prepare final assets for the agreed platforms." },
];

export const serviceOfferings = [
  {
    slug: "video-editing",
    title: "Video Editing",
    shortDescription: "A considered cut, shaped around your story.",
    description:
      "Professional editing for footage that needs a clearer story, considered pacing and a finish suited to where it will be watched.",
    scope: ["Story and pacing", "Edit and finishing", "Platform-ready exports"],
    enquiryValue: "Professional editing",
  },
  {
    slug: "reels",
    title: "Reels & Short-Form",
    shortDescription: "Short edits for vertical-first viewing.",
    description:
      "Short-form video editing for social platforms, shaped around the source footage, message and intended audience.",
    scope: ["Short-form editing", "Captions and cutdowns by brief", "Vertical format delivery"],
    enquiryValue: "Reels and short-form content",
  },
  {
    slug: "youtube-video-editing",
    title: "YouTube Video Editing",
    shortDescription: "Long-form edits that hold a clear thread.",
    description:
      "Editing support for YouTube videos, from organizing the story to preparing the agreed final version for upload.",
    scope: ["Long-form edit", "Pacing and story structure", "Supporting cutdowns by brief"],
    enquiryValue: "YouTube video editing",
  },
  {
    slug: "video-production",
    title: "Video Production & Shooting",
    shortDescription: "A shoot planned around what you need to say.",
    description:
      "Video shoots and production support for businesses, brands and creators. Requirements and production approach are confirmed against each brief.",
    scope: ["Shoot planning", "Video capture", "Creative direction"],
    enquiryValue: "Video production and shooting",
  },
  {
    slug: "podcast-video",
    title: "Podcast Video",
    shortDescription: "Video production and edits for conversations.",
    description:
      "Podcast video production and editing can be scoped around your recording, format and the content you want to share.",
    scope: ["Production requirements by brief", "Video editing", "Social cutdowns by brief"],
    enquiryValue: "Podcast video production",
  },
  {
    slug: "social-media-content",
    title: "Social Media Content",
    shortDescription: "Planning and production for a cared-for presence.",
    description:
      "Social-media strategy, content planning, publishing and account management—connected to video and creative production where useful.",
    scope: ["Social strategy", "Content planning", "Publishing and account management"],
    enquiryValue: "Social media content and management",
  },
  {
    slug: "corporate-brand-video",
    title: "Corporate & Brand Video",
    shortDescription: "Give your brand story a clear visual shape.",
    description:
      "Video production and editing for corporate communication and brand stories, with the creative approach agreed from your project brief.",
    scope: ["Brief-led creative direction", "Video shoot or footage editing", "Final assets by agreed scope"],
    enquiryValue: "Corporate and brand video",
  },
  {
    slug: "creative-design",
    title: "Creative Design",
    shortDescription: "Supporting visuals for a connected content system.",
    description:
      "Creative design for content and social communication, planned to work with the message, video and platform requirements in your brief.",
    scope: ["Content-led visual direction", "Social creative by brief", "Campaign assets by agreed scope"],
    enquiryValue: "Creative design",
  },
  {
    slug: "monthly-content",
    title: "Monthly Content",
    shortDescription: "Recurring social and production support.",
    description:
      "Discuss ongoing support for content planning, social publishing, video shoots and professional editing. Monthly deliverables and pricing are quoted to fit the agreed scope.",
    scope: ["Recurring content planning", "Production and editing by brief", "Publishing or account support"],
    enquiryValue: "Monthly content support",
  },
];

export function getServiceBySlug(slug) {
  return serviceOfferings.find((service) => service.slug === slug);
}
