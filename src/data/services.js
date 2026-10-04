export const serviceAreas = [
  {
    id: "social",
    label: "Social media",
    enquiryValue: "Social strategy, planning & account management",
    title: "Social, with a plan.",
    description:
      "Social media strategy, content planning, publishing and account management, scoped around your brand and requirements.",
    deliverables: [
      "Social media strategy",
      "Content planning",
      "Publishing",
      "Account management",
    ],
  },
  {
    id: "shoot",
    label: "Video shoots",
    enquiryValue: "Video shoots",
    title: "Make it on camera.",
    description:
      "Video shoots planned around the brief, the message and the footage you need.",
    deliverables: ["Video shoots", "Production planning by brief"],
  },
  {
    id: "edit",
    label: "Professional editing",
    enquiryValue: "Professional editing",
    title: "Bring the footage together.",
    description:
      "Professional video editing shaped around your source footage and the agreed final format.",
    deliverables: ["Professional editing", "Final exports by agreed scope"],
  },
];

export const contentJourney = [
  { label: "Brief", detail: "Share the project, priorities and requirements." },
  { label: "Plan", detail: "Confirm the creative approach and agreed scope." },
  { label: "Create", detail: "Complete the shoot, edit or social work in scope." },
  { label: "Deliver", detail: "Review and receive the agreed final deliverables." },
];

export const serviceOfferings = [
  {
    slug: "social-media-management",
    title: "Social Media Management",
    shortDescription: "Strategy, planning, publishing and account management.",
    description:
      "Social media strategy, content planning, publishing and account management for your brand. Platforms and scope are confirmed against your brief.",
    scope: [
      "Social media strategy",
      "Content planning",
      "Publishing",
      "Account management",
    ],
    enquiryValue: "Social strategy, planning & account management",
  },
  {
    slug: "video-shoots",
    title: "Video Shoots",
    shortDescription: "Video production shaped around your brief.",
    description:
      "Video shoots for brands, businesses and creators. Production requirements and the approach for each shoot are discussed before the project begins.",
    scope: ["Project brief", "Shoot requirements", "Video capture"],
    enquiryValue: "Video shoots",
  },
  {
    slug: "professional-video-editing",
    title: "Professional Video Editing",
    shortDescription: "Editing for footage you already have or content in production.",
    description:
      "Professional video editing shaped around your footage, message and agreed final format. Share the material and requirements to confirm the scope.",
    scope: ["Footage and brief review", "Video editing", "Final exports by brief"],
    enquiryValue: "Professional editing",
  },
];

export function getServiceBySlug(slug) {
  return serviceOfferings.find((service) => service.slug === slug);
}
