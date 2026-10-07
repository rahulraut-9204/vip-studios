const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com"]);

export function getMediaPlatformLabel(platform) {
  return {
    youtube: "YouTube",
    instagram: "Instagram",
    direct_video: "Direct video",
    image: "Image study",
  }[platform] ?? "Visual study";
}

export function getYouTubeId(value = "") {
  try {
    const url = new URL(value);
    if (!YOUTUBE_HOSTS.has(url.hostname)) return "";
    if (url.hostname === "youtu.be") return url.pathname.slice(1).split("/")[0] ?? "";
    if (url.searchParams.get("v")) return url.searchParams.get("v");
    const embedMatch = url.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/);
    return embedMatch?.[1] ?? "";
  } catch {
    return "";
  }
}

export function getYouTubeThumbnail(value = "") {
  const id = getYouTubeId(value);
  return id ? `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg` : "";
}

export function getSafeExternalUrl(value = "") {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

export function getInstagramUrl(value = "") {
  const url = getSafeExternalUrl(value);
  if (!url) return "";
  try {
    return ["instagram.com", "www.instagram.com"].includes(new URL(url).hostname) ? url : "";
  } catch {
    return "";
  }
}

export function getDirectVideoUrl(value = "") {
  const url = getSafeExternalUrl(value);
  return url && /\.(mp4|webm|mov)(?:[?#].*)?$/i.test(url) ? url : "";
}
