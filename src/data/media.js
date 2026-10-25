const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com"]);
const INSTAGRAM_HOSTS = new Set(["instagram.com", "www.instagram.com", "m.instagram.com"]);

export function getMediaPlatformLabel(platform) {
  return {
    youtube: "YouTube",
    instagram: "Instagram Reel",
    direct_video: "Direct Video",
    image: "Visual Frame",
  }[platform] ?? "Video Cut";
}

export function getSafeExternalUrl(value = "") {
  try {
    const url = new URL(String(value).trim());
    return ["https:", "http:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

export function getYouTubeId(value = "") {
  try {
    const url = new URL(String(value).trim());
    if (!YOUTUBE_HOSTS.has(url.hostname)) return "";
    if (url.hostname === "youtu.be") return url.pathname.slice(1).split("/")[0] ?? "";
    if (url.searchParams.get("v")) return url.searchParams.get("v") ?? "";
    const embedMatch = url.pathname.match(/\/(?:embed|shorts|live)\/([^/?#]+)/);
    return embedMatch?.[1] ?? "";
  } catch {
    return "";
  }
}

export function isYouTubeShort(value = "") {
  try {
    const url = new URL(String(value).trim());
    return YOUTUBE_HOSTS.has(url.hostname) && url.pathname.includes("/shorts/");
  } catch {
    return false;
  }
}

export function getYouTubeThumbnail(value = "", quality = "maxres") {
  const id = getYouTubeId(value);
  if (!id) return "";
  return quality === "maxres"
    ? `https://img.youtube.com/vi/${encodeURIComponent(id)}/maxresdefault.jpg`
    : `https://img.youtube.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;
}

export function getInstagramReelId(value = "") {
  try {
    const url = new URL(String(value).trim());
    if (!INSTAGRAM_HOSTS.has(url.hostname)) return "";
    const match = url.pathname.match(/\/(?:reel|reels|p|tv)\/([^/?#]+)/);
    return match?.[1] ?? "";
  } catch {
    return "";
  }
}

export function getInstagramEmbedUrl(value = "") {
  const reelId = getInstagramReelId(value);
  if (!reelId) return "";
  return `https://www.instagram.com/reel/${encodeURIComponent(reelId)}/embed/`;
}

export function getInstagramUrl(value = "") {
  const url = getSafeExternalUrl(value);
  if (!url) return "";
  try {
    return INSTAGRAM_HOSTS.has(new URL(url).hostname) ? url : "";
  } catch {
    return "";
  }
}

export function getDirectVideoUrl(value = "") {
  const url = getSafeExternalUrl(value);
  return url && /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(url) ? url : "";
}

/**
 * Automatically inspects any video URL and extracts platform, format,
 * aspect ratio, thumbnail, and embed settings.
 */
export function analyzeVideoUrl(rawUrl = "") {
  const url = String(rawUrl).trim();
  if (!url) return null;

  const ytId = getYouTubeId(url);
  const ytShort = isYouTubeShort(url);
  const igId = getInstagramReelId(url);
  const direct = getDirectVideoUrl(url);

  if (ytId) {
    const isVertical = ytShort;
    return {
      platform: "youtube",
      media_type: "video",
      isVertical,
      category: isVertical ? "Reels & Short-form" : "Video Editing",
      format: isVertical ? "9:16 Vertical Storytelling" : "16:9 4K Commercial Master",
      thumbnail: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
      fallbackThumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`,
      id: ytId,
    };
  }

  if (igId) {
    return {
      platform: "instagram",
      media_type: "video",
      isVertical: true,
      category: "Reels & Short-form",
      format: "9:16 Vertical Storytelling",
      thumbnail: "",
      embedUrl: `https://www.instagram.com/reel/${igId}/embed/`,
      id: igId,
    };
  }

  if (direct) {
    return {
      platform: "direct_video",
      media_type: "video",
      isVertical: false,
      category: "Video Editing",
      format: "Commercial Video Cut",
      thumbnail: "",
      embedUrl: direct,
      id: "",
    };
  }

  return null;
}
