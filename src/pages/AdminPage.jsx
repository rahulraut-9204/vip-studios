import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  EyeOff,
  Film,
  ImagePlus,
  Inbox,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../config/site.js";
import { isSupabaseConfigured, supabase } from "../lib/supabase.js";
import ProjectCard from "../components/ProjectCard.jsx";
import { DEFAULT_STUDIO_CUTS } from "../data/defaultCuts.js";
import {
  analyzeVideoUrl,
  getInstagramEmbedUrl,
  getInstagramReelId,
  getYouTubeId,
  getYouTubeThumbnail,
} from "../data/media.js";

const EMPTY_FORM = {
  title: "",
  slug: "",
  category: CATEGORIES[0],
  format: "16:9 4K Commercial Master",
  platform: "youtube",
  media_type: "video",
  video_url: "",
  client_name: "",
  role: "Lead Editor & Colorist",
  result: "",
  year_label: "2026",
  image_alt: "",
  image_url: "",
  image_position: "center",
  accent: "gold",
  summary: "",
  approach: "",
  status: "published",
  is_concept: false,
  featured: false,
  sort_order: 0,
};

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function slugify(value) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function getUploadedObjectPath(imageUrl) {
  const marker = "/storage/v1/object/public/vip-studios-projects/";
  const markerIndex = imageUrl.indexOf(marker);
  if (markerIndex < 0) return null;

  try {
    return decodeURIComponent(imageUrl.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

async function makeOptimizedImage(file) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Choose a JPEG, PNG, or WebP image.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Choose an image smaller than 8 MB.");
  }

  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    let width = Math.max(1, Math.round(bitmap.width * scale));
    let height = Math.max(1, Math.round(bitmap.height * scale));

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("This browser could not prepare the image.");
      context.drawImage(bitmap, 0, 0, width, height);

      const image = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("The image could not be optimized in this browser."));
          },
          "image/webp",
          0.78,
        );
      });
      if (image.size <= 2 * 1024 * 1024) return image;
      width = Math.round(width * 0.82);
      height = Math.round(height * 0.82);
    }

    throw new Error("This image is too detailed to fit the 2 MB upload limit.");
  } finally {
    bitmap.close();
  }
}

function projectToForm(project) {
  return {
    title: project.title,
    slug: project.slug,
    category: project.category,
    format: project.format,
    platform: project.platform ?? "youtube",
    media_type: project.media_type ?? "video",
    video_url: project.video_url ?? "",
    client_name: project.client_name ?? "",
    role: project.role ?? "",
    result: project.result ?? "",
    year_label: project.year_label ?? "2026",
    image_alt: project.image_alt || project.title,
    image_url: project.image_url,
    image_position: project.image_position ?? "center",
    accent: project.accent ?? "gold",
    summary: project.summary,
    approach: project.approach,
    status: project.status,
    is_concept: false,
    featured: project.featured,
    sort_order: project.sort_order,
  };
}

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState("all");
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    const robotsMeta = document.querySelector('meta[name="robots"]');
    document.title = "Project library — VIP StudioS";
    robotsMeta?.setAttribute("content", "noindex, nofollow");

    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return undefined;
    }

    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return undefined;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  useEffect(() => {
    if (!supabase || !session) {
      setProjects([]);
      return undefined;
    }

    let active = true;
    setProjectsLoading(true);
    supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setFeedback(`Could not load projects. Check admin permissions: ${error.message}`);
        } else {
          setProjects(data ?? []);
          setFeedback("");
        }
        setProjectsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [session]);

  useEffect(() => {
    if (!supabase || !session) {
      setEnquiries([]);
      return undefined;
    }

    let active = true;
    setEnquiriesLoading(true);
    supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setFeedback(`Projects loaded, but enquiries could not be loaded: ${error.message}`);
        } else {
          setEnquiries(data ?? []);
        }
        setEnquiriesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [session]);

  function startNewProject(clearFeedback = true) {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSelectedFile(null);
    if (clearFeedback) setFeedback("");
    setPreviewError("");
    setShowAdvanced(false);
  }

  function editProject(project) {
    setEditingId(project.id);
    setForm(projectToForm(project));
    setSelectedFile(null);
    setFeedback("");
    setPreviewError("");
    setShowAdvanced(false);
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateTitle(title) {
    setForm((current) => ({
      ...current,
      title,
      slug: !current.title || current.slug === slugify(current.title)
        ? slugify(title)
        : current.slug,
    }));
  }

  function handleVideoLinkChange(url) {
    updateField("video_url", url);
    const detected = analyzeVideoUrl(url);
    if (detected) {
      updateField("platform", detected.platform);
      updateField("media_type", detected.media_type);
      updateField("category", detected.category);
      updateField("format", detected.format);
      if (detected.thumbnail && !selectedFile) {
        updateField("image_url", detected.thumbnail);
      }
      if (!form.summary) {
        updateField("summary", "Commercial video edit crafted by VIP STUDIOS.");
      }
      if (!form.approach) {
        updateField("approach", "Engineered with dynamic pacing, custom sound design, and cinema color grading.");
      }
    }
  }

  function chooseImage(file) {
    setSelectedFile(file);
    setPreviewError("");

    if (file && (!ALLOWED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_BYTES)) {
      setPreviewError("Use a JPEG, PNG, or WebP image smaller than 8 MB.");
    }
  }

  async function saveProject(event) {
    event.preventDefault();
    setFeedback("");
    setSaving(true);
    let uploadedImage = false;
    let uploadedObjectPath = null;

    try {
      const title = form.title.trim() || "Untitled Project";
      let slug = form.slug.trim() || slugify(title);
      if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        slug = `${slugify(title) || "cut"}-${Date.now().toString().slice(-4)}`;
      }

      let imageUrl = form.image_url;
      if (selectedFile) {
        const optimizedImage = await makeOptimizedImage(selectedFile);
        const objectPath = `${session.user.id}/${crypto.randomUUID()}.webp`;
        const { error: uploadError } = await supabase.storage
          .from("vip-studios-projects")
          .upload(objectPath, optimizedImage, {
            cacheControl: "31536000",
            contentType: "image/webp",
            upsert: false,
          });
        if (uploadError) throw uploadError;
        uploadedObjectPath = objectPath;
        imageUrl = supabase.storage
          .from("vip-studios-projects")
          .getPublicUrl(objectPath).data.publicUrl;
        uploadedImage = true;
      } else if (!imageUrl && form.video_url) {
        const detected = analyzeVideoUrl(form.video_url);
        if (detected?.thumbnail) {
          imageUrl = detected.thumbnail;
        } else {
          imageUrl = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1400&q=80";
        }
      } else if (!imageUrl) {
        imageUrl = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1400&q=80";
      }

      const payload = {
        ...form,
        title,
        slug,
        image_url: imageUrl,
        image_alt: form.image_alt || `${title} video cut`,
        format: form.format || (form.category === "Reels & Short-form" ? "9:16 Vertical Storytelling" : "16:9 4K Commercial Master"),
        summary: form.summary || "A commercial video project produced and edited by VIP STUDIOS.",
        approach: form.approach || "Crafted with high retention pacing, custom sound design, and cinema-grade color.",
        year_label: form.year_label.trim() || "2026",
        sort_order: Number(form.sort_order) || 0,
        status: form.status || "published",
        is_concept: false,
      };

      const query = editingId
        ? supabase.from("projects").update(payload).eq("id", editingId)
        : supabase.from("projects").insert(payload);
      const { error } = await query;
      if (error) {
        throw new Error(
          `${error.message}${uploadedImage ? " The new image is already uploaded and may need cleanup in Storage." : ""}`,
        );
      }

      const { data, error: reloadError } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (reloadError) {
        throw new Error(`Project saved, but the list could not refresh: ${reloadError.message}`);
      }
      setProjects(data ?? []);

      let cleanupWarning = "";
      const previousProject = projects.find((project) => project.id === editingId);
      const previousObjectPath = uploadedObjectPath
        ? getUploadedObjectPath(previousProject?.image_url ?? "")
        : null;
      if (previousObjectPath) {
        const { error: cleanupError } = await supabase.storage
          .from("vip-studios-projects")
          .remove([previousObjectPath]);
        if (cleanupError) {
          cleanupWarning = ` Project saved, but its previous image could not be removed: ${cleanupError.message}`;
        }
      }

      startNewProject(false);
      setFeedback(`✓ "${title}" successfully published to live website!${cleanupWarning}`);
    } catch (error) {
      const message = errorMessage(error);
      setFeedback(message.startsWith("Project saved,")
        ? message
        : `Could not save project: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function signIn(event) {
    event.preventDefault();
    setFeedback("");
    setIsSigningIn(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setFeedback(`Sign-in failed: ${error.message}`);
    } catch (err) {
      setFeedback(`Sign-in error: ${err.message}`);
    } finally {
      setIsSigningIn(false);
      setPassword("");
    }
  }

  async function signOut() {
    setFeedback("");
    const { error } = await supabase.auth.signOut();
    if (error) setFeedback(`Sign-out failed: ${error.message}`);
  }

  async function updateEnquiryStatus(id, status) {
    const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
    if (error) {
      setFeedback(`Could not update enquiry: ${error.message}`);
      return;
    }
    setEnquiries((current) =>
      current.map((enquiry) => (enquiry.id === id ? { ...enquiry, status } : enquiry)),
    );
  }

  async function restoreDefaultCuts() {
    if (!window.confirm("Restore the 5 curated studio showcase cuts? Any missing cuts will be recreated in your library.")) {
      return;
    }
    setSaving(true);
    setFeedback("");
    try {
      for (const cut of DEFAULT_STUDIO_CUTS) {
        const { error } = await supabase.from("projects").upsert(cut, { onConflict: "slug" });
        if (error) throw error;
      }
      const { data, error: reloadError } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (reloadError) throw reloadError;
      setProjects(data ?? []);
      setFeedback("All 5 default studio cuts have been restored and published.");
    } catch (error) {
      setFeedback(`Could not restore cuts: ${errorMessage(error)}`);
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject() {
    if (!editingId || !window.confirm(`Delete "${form.title}" permanently? This cannot be undone.`)) {
      return;
    }

    setFeedback("");
    setSaving(true);
    const project = projects.find((item) => item.id === editingId);

    try {
      const { error } = await supabase.from("projects").delete().eq("id", editingId);
      if (error) throw error;

      let storageWarning = "";
      const imageUrl = project?.image_url ?? "";
      const objectPath = getUploadedObjectPath(imageUrl);
      if (objectPath) {
        const { error: storageError } = await supabase.storage
          .from("vip-studios-projects")
          .remove([objectPath]);
        if (storageError) storageWarning = ` Project deleted, but its uploaded image could not be removed: ${storageError.message}`;
      }

      setProjects((current) => current.filter((item) => item.id !== editingId));
      startNewProject(false);
      setFeedback(storageWarning || "Project deleted.");
    } catch (error) {
      setFeedback(`Could not delete project: ${errorMessage(error)}`);
    } finally {
      setSaving(false);
    }
  }

  const filteredProjects = projects.filter((project) =>
    categoryFilter === "All" ? true : project.category === categoryFilter
  );

  const filteredEnquiries = enquiries.filter((enquiry) =>
    enquiryStatusFilter === "all" ? true : enquiry.status === enquiryStatusFilter
  );

  const detectedVideo = analyzeVideoUrl(form.video_url);

  const CATEGORY_COLORS = {
    All: "bg-[#635BFF] text-white border-[#635BFF] shadow-[0_0_12px_rgba(99,91,255,0.4)]",
    "Video Editing": "bg-[#FF4D2D] text-white border-[#FF4D2D] shadow-[0_0_12px_rgba(255,77,45,0.4)]",
    "Reels & Short-form": "bg-[#00E599] text-[#0E0C18] border-[#00E599] font-black shadow-[0_0_12px_rgba(0,229,153,0.4)]",
    YouTube: "bg-[#FF0033] text-white border-[#FF0033] shadow-[0_0_12px_rgba(255,0,51,0.4)]",
    "Social Media": "bg-[#FF2E93] text-white border-[#FF2E93] shadow-[0_0_12px_rgba(255,46,147,0.4)]",
    Corporate: "bg-[#00D2FF] text-[#0E0C18] border-[#00D2FF] font-black shadow-[0_0_12px_rgba(0,210,255,0.4)]",
    Other: "bg-[#FFB800] text-[#0E0C18] border-[#FFB800] font-black shadow-[0_0_12px_rgba(255,184,0,0.4)]",
  };

  if (!isSupabaseConfigured) {
    return (
      <main className="min-h-screen bg-[#0B0914] flex items-center justify-center p-4 py-12 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#635BFF]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF4D2D]/12 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-[#141122]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#FF4D2D] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF4D2D] font-bold">VIP STUDIOS · STUDIO CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">CMS Setup Needed</h1>
          <p className="text-xs text-white/60 mb-6 leading-relaxed font-mono">
            Add your Supabase project URL and anon key as
            <code className="text-[#635BFF] bg-[#635BFF]/10 px-1.5 py-0.5 rounded ml-1">VITE_SUPABASE_URL</code> and <code className="text-[#635BFF] bg-[#635BFF]/10 px-1.5 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code>.
          </p>
          <Link className="inline-block text-center w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#FF4D2D] to-[#FF2E93] shadow-[0_0_20px_rgba(255,77,45,0.4)]" to="/">
            Back to Public Website
          </Link>
        </div>
      </main>
    );
  }

  if (authLoading) {
    return (
      <main aria-live="polite" className="min-h-screen bg-[#0B0914] flex flex-col items-center justify-center gap-3 text-[#A59FFF] font-mono text-xs">
        <div className="w-8 h-8 rounded-full border-2 border-[#635BFF] border-t-transparent animate-spin" />
        <span>Authenticating studio console session…</span>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-[#0B0914] flex items-center justify-center p-4 py-12 relative overflow-hidden">
        {/* Ambient Studio Lighting Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#635BFF]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF4D2D]/12 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00E599]/05 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-[#141122]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <Link className="inline-flex items-center gap-1.5 text-xs font-mono text-white/60 hover:text-white transition-colors" to="/">
              <ArrowLeft size={14} /> Public Website
            </Link>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF4D2D] animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF4D2D] font-bold">STUDIO CMS</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#635BFF]/15 border border-[#635BFF]/30 text-[#A59FFF] font-mono text-[11px] font-bold uppercase tracking-widest mb-2">
              VIP STUDIOS // CMS PORTAL
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight m-0 mb-2">
              Studio Sign In
            </h1>
            <p className="text-xs text-white/60 m-0 leading-relaxed font-sans">
              Enter your authorized administrator credentials to manage portfolio cuts, publishing workflows, and client enquiries.
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={signIn}>
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#E2DFED] mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" size={16} />
                <input
                  autoComplete="username"
                  className="w-full bg-[#0E0C18] border border-white/15 focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/30 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-all font-mono"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@example.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#E2DFED] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" size={16} />
                <input
                  autoComplete="current-password"
                  className="w-full bg-[#0E0C18] border border-white/15 focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/30 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-all font-mono"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                  type="button"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {feedback && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-700/60 text-red-200 text-xs font-mono" role="alert">
                {feedback}
              </div>
            )}

            <button
              className="w-full py-3.5 text-sm font-mono font-bold uppercase tracking-wider mt-2 rounded-xl text-white bg-gradient-to-r from-[#FF4D2D] to-[#FF2E93] hover:from-[#FF3D18] hover:to-[#E62080] shadow-[0_0_25px_rgba(255,77,45,0.45)] hover:shadow-[0_0_35px_rgba(255,77,45,0.6)] transition-all cursor-pointer disabled:opacity-50"
              disabled={isSigningIn}
              type="submit"
            >
              {isSigningIn ? "Signing in to Studio Desk…" : "Sign In to Studio Desk"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center text-[11px] font-mono text-white/40">
            Protected studio administration console · All activities monitored
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="studio-admin">
      <div className="studio-admin-wrap">
        {/* Modern Studio Glass Header */}
        <header className="bg-[#141122]/90 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <Link
                className="inline-flex items-center gap-1.5 text-xs font-mono text-white/70 hover:text-white px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[#635BFF]/50 transition-all"
                to="/"
              >
                <ArrowLeft size={13} /> Public Website
              </Link>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF4D2D]/15 border border-[#FF4D2D]/35 text-[#FF4D2D] text-[10px] font-mono font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D2D] animate-pulse" />
                CMS LIVE
              </span>
              <span className="text-[10px] font-mono text-[#A59FFF] px-2.5 py-0.5 rounded-full bg-[#635BFF]/15 border border-[#635BFF]/35 font-bold uppercase tracking-wider">
                VIP STUDIOS // CMS DESK
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight m-0">
              Project Library &amp; Studio Desk
            </h1>
            <p className="text-xs font-mono text-white/50 m-0 mt-1">
              Direct Link Ingest · Dynamic Video Players · Instant Client Inquiries
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">STUDIO OPERATOR</span>
              <span className="text-xs font-mono text-[#00E599] font-bold flex items-center justify-end gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E599]" /> {session.user?.email || "Admin Master"}
              </span>
            </div>
            <button
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-white/80 hover:text-white hover:bg-red-500/20 hover:border-red-500/40 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 transition-all cursor-pointer"
              onClick={signOut}
              type="button"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </header>

        {/* 5 Distinct Colorful Key Metrics Cards */}
        <section aria-label="Project library summary" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
          {/* Card 1: Total Cuts (Violet) */}
          <div className="bg-gradient-to-br from-[#635BFF]/15 via-[#141122] to-transparent border border-[#635BFF]/35 hover:border-[#635BFF] rounded-2xl p-4 sm:p-5 shadow-lg transition-all hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#A59FFF]">MEDIA VAULT</span>
              <Film className="text-[#635BFF]" size={16} />
            </div>
            <strong className="block text-3xl sm:text-4xl font-black text-white font-mono leading-none mb-1">
              {String(projects.length).padStart(2, "0")}
            </strong>
            <span className="text-xs font-mono text-[#A59FFF] font-semibold uppercase">Total Cuts</span>
          </div>

          {/* Card 2: Published Cuts (Mint) */}
          <div className="bg-gradient-to-br from-[#00E599]/15 via-[#141122] to-transparent border border-[#00E599]/35 hover:border-[#00E599] rounded-2xl p-4 sm:p-5 shadow-lg transition-all hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00E599]">LIVE ON WEB</span>
              <Check className="text-[#00E599]" size={16} />
            </div>
            <strong className="block text-3xl sm:text-4xl font-black text-white font-mono leading-none mb-1">
              {String(projects.filter((p) => p.status === "published").length).padStart(2, "0")}
            </strong>
            <span className="text-xs font-mono text-[#00E599] font-semibold uppercase">Published</span>
          </div>

          {/* Card 3: Draft Cuts (Amber) */}
          <div className="bg-gradient-to-br from-[#FFB800]/15 via-[#141122] to-transparent border border-[#FFB800]/35 hover:border-[#FFB800] rounded-2xl p-4 sm:p-5 shadow-lg transition-all hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFD266]">TIMELINE</span>
              <EyeOff className="text-[#FFB800]" size={16} />
            </div>
            <strong className="block text-3xl sm:text-4xl font-black text-white font-mono leading-none mb-1">
              {String(projects.filter((p) => p.status === "draft").length).padStart(2, "0")}
            </strong>
            <span className="text-xs font-mono text-[#FFD266] font-semibold uppercase">Drafts</span>
          </div>

          {/* Card 4: Featured Showcase (Coral) */}
          <div className="bg-gradient-to-br from-[#FF4D2D]/15 via-[#141122] to-transparent border border-[#FF4D2D]/35 hover:border-[#FF4D2D] rounded-2xl p-4 sm:p-5 shadow-lg transition-all hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF7E66]">HERO CUT</span>
              <Sparkles className="text-[#FF4D2D]" size={16} />
            </div>
            <strong className="block text-3xl sm:text-4xl font-black text-white font-mono leading-none mb-1">
              {String(projects.filter((p) => p.featured).length).padStart(2, "0")}
            </strong>
            <span className="text-xs font-mono text-[#FF7E66] font-semibold uppercase">Featured</span>
          </div>

          {/* Card 5: New Enquiries (Neon Pink) */}
          <div className="bg-gradient-to-br from-[#FF2E93]/15 via-[#141122] to-transparent border border-[#FF2E93]/35 hover:border-[#FF2E93] rounded-2xl p-4 sm:p-5 shadow-lg transition-all hover:-translate-y-0.5 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF66B3]">CLIENT BRIEFS</span>
              <Inbox className="text-[#FF2E93]" size={16} />
            </div>
            <div className="flex items-baseline gap-2">
              <strong className="block text-3xl sm:text-4xl font-black text-white font-mono leading-none mb-1">
                {String(enquiries.filter((e) => e.status === "new").length).padStart(2, "0")}
              </strong>
              {enquiries.filter((e) => e.status === "new").length > 0 && (
                <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded bg-[#FF2E93] text-white animate-pulse">
                  NEW
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-[#FF66B3] font-semibold uppercase">New Briefs</span>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-8 font-mono text-xs uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("projects")}
            type="button"
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "projects"
                ? "bg-[#635BFF] text-white shadow-[0_0_20px_rgba(99,91,255,0.45)] border border-[#635BFF]"
                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            <Film size={15} />
            <span>Cuts &amp; Projects</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === "projects" ? "bg-white/20 text-white" : "bg-white/10 text-white/70"
            }`}>
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("enquiries")}
            type="button"
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "enquiries"
                ? "bg-[#FF4D2D] text-white shadow-[0_0_20px_rgba(255,77,45,0.45)] border border-[#FF4D2D]"
                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            <Inbox size={15} />
            <span>Client Enquiries</span>
            {enquiries.filter((e) => e.status === "new").length > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-white text-[#FF4D2D] text-[10px] font-black animate-pulse">
                {enquiries.filter((e) => e.status === "new").length} NEW
              </span>
            ) : (
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === "enquiries" ? "bg-white/20 text-white" : "bg-white/10 text-white/70"
              }`}>
                {enquiries.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === "projects" && (
          <div className="studio-admin-layout">
            <aside aria-label="Saved projects" className="studio-admin-list">
              <div className="studio-admin-list-heading">
                <h2>Project Cuts <span>({filteredProjects.length})</span></h2>
                <div className="flex items-center gap-1.5">
                  <button
                    aria-label="Restore default cuts"
                    title="Restore default studio showcase cuts"
                    className="studio-admin-icon-button"
                    onClick={restoreDefaultCuts}
                    disabled={saving}
                    type="button"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    aria-label="Create a project"
                    title="Add new cut"
                    className="studio-admin-icon-button"
                    onClick={() => startNewProject(true)}
                    type="button"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Colorful Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 mb-4 pb-4 border-b border-white/10">
                {["All", ...CATEGORIES].map((cat) => {
                  const isActive = categoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        isActive
                          ? CATEGORY_COLORS[cat] || "bg-white text-[#0E0C18] border-white font-bold"
                          : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:border-white/25"
                      }`}
                    >
                      {cat === "All" ? "ALL" : cat}
                    </button>
                  );
                })}
              </div>

              {projectsLoading && <p aria-live="polite" className="text-[#A59FFF] font-mono text-xs">Loading cuts…</p>}
              {!projectsLoading && filteredProjects.length === 0 && (
                <div className="py-8 text-center text-xs text-white/50">
                  <p>No {categoryFilter !== "All" ? categoryFilter : ""} cuts found.</p>
                  <button
                    onClick={restoreDefaultCuts}
                    type="button"
                    className="mt-2 text-xs text-[#FF4D2D] hover:underline font-mono"
                  >
                    Restore default cuts
                  </button>
                </div>
              )}
              {filteredProjects.map((project) => {
                const isEditing = editingId === project.id;
                const isPub = project.status === "published";
                return (
                  <button
                    aria-current={isEditing ? "true" : undefined}
                    className={`studio-admin-project${isEditing ? " is-active" : ""}`}
                    key={project.id}
                    onClick={() => editProject(project)}
                    type="button"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-bold text-white text-sm line-clamp-1">{project.title}</span>
                      {project.featured && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FF4D2D]/20 text-[#FF4D2D] border border-[#FF4D2D]/40">
                          ★ FEATURED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                        isPub
                          ? "bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/40"
                          : "bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40"
                      }`}>
                        {project.status}
                      </span>
                      <span className="text-white/40">·</span>
                      <span className="text-[#A59FFF] truncate">{project.category}</span>
                      {project.format && (
                        <>
                          <span className="text-white/40">·</span>
                          <span className="text-white/40 truncate">{project.format.split(" ")[0]}</span>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </aside>

            {/* Smart Add / Edit Project Form */}
            <form className="studio-admin-form" onSubmit={saveProject}>
              <div className="studio-admin-list-heading">
                <div>
                  <p className="studio-location text-[#A59FFF] font-mono text-xs">{editingId ? "EDITING CUT" : "NEW VIDEO CUT"}</p>
                  <h2>{editingId ? form.title : "Add New Cut from Link"}</h2>
                </div>
                {editingId && (
                  <button aria-label="Close project editor" className="studio-admin-icon-button" onClick={startNewProject} type="button">
                    <X aria-hidden="true" size={18} />
                  </button>
                )}
              </div>

              {/* Direct Video Link Ingest Section with Vivid Gradient */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#635BFF]/15 via-[#181428] to-[#FF4D2D]/10 border border-[#635BFF]/40 mb-6 shadow-xl">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#A59FFF] m-0 flex items-center gap-2">
                    <Sparkles className="text-[#FFB800]" size={15} /> Instant Video Ingest (YouTube, Shorts, or Instagram Reel)
                  </label>
                  {detectedVideo && (
                    <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/40 flex items-center gap-1">
                      ✓ {detectedVideo.platform === "youtube" ? (detectedVideo.isVertical ? "YouTube Short (9:16)" : "YouTube 4K Master") : "Instagram Reel (9:16)"}
                    </span>
                  )}
                </div>

                <input
                  className="w-full bg-[#0E0C18] border border-white/20 focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/30 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-white/30 focus:outline-none transition-all shadow-inner"
                  maxLength={500}
                  onChange={(event) => handleVideoLinkChange(event.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
                  type="url"
                  value={form.video_url}
                />
                <p className="text-[11px] font-mono text-white/50 mt-2 mb-0">
                  Paste any YouTube video/Short or Instagram Reel. Aspect ratio, platform, and posters will be detected automatically.
                </p>

                {/* Live Detected Poster Preview */}
                {(form.image_url || detectedVideo?.thumbnail) && (
                  <div className="mt-3.5 pt-3.5 border-t border-white/10 flex items-center gap-3.5">
                    <div className="relative rounded-lg overflow-hidden border border-[#635BFF]/40 shadow-md">
                      <img
                        alt="Detected thumbnail"
                        className="w-24 h-16 object-cover bg-black"
                        src={form.image_url || detectedVideo?.thumbnail}
                      />
                      <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] font-mono text-white px-1 py-0.5 rounded">
                        {form.format?.includes("9:16") ? "9:16" : "16:9"}
                      </span>
                    </div>
                    <div className="text-xs">
                      <strong className="block text-white font-mono font-bold">Auto-detected Video Poster &amp; Scopes</strong>
                      <span className="text-[#A59FFF] font-mono text-[11px]">{form.format} · {form.category}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Client Inputs */}
              <div className="studio-admin-field-pair">
                <label>
                  <span>Project Title / Cut Name <span className="text-[#FF4D2D]">*</span></span>
                  <input
                    maxLength={120}
                    onChange={(event) => updateTitle(event.target.value)}
                    placeholder="e.g. Apex Velocity Campaign"
                    required
                    value={form.title}
                  />
                </label>
                <label>
                  <span>Client / Brand Name (Optional)</span>
                  <input
                    maxLength={120}
                    onChange={(event) => updateField("client_name", event.target.value)}
                    placeholder="e.g. CineWave, Nike, or Creator Handle"
                    value={form.client_name}
                  />
                </label>
              </div>

              <div className="studio-admin-field-pair">
                <label>
                  <span>Category</span>
                  <select onChange={(event) => updateField("category", event.target.value)} value={form.category}>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Publication State</span>
                  <select onChange={(event) => updateField("status", event.target.value)} value={form.status}>
                    <option value="published">Published — Live on Public Site</option>
                    <option value="draft">Draft — Hidden In Studio Desk</option>
                  </select>
                </label>
              </div>

              <div className="studio-admin-checks mb-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-mono text-white/90">
                  <input
                    checked={form.featured}
                    className="w-4 h-4 accent-[#FF4D2D] rounded"
                    onChange={(event) => updateField("featured", event.target.checked)}
                    type="checkbox"
                  />
                  <span className="text-[#FFB800] font-bold">★ Feature in Top Homepage Showcase</span>
                </label>
              </div>

              {/* Advanced Accordion Toggle */}
              <div className="border border-white/10 rounded-2xl overflow-hidden mb-6 bg-[#161324]">
                <button
                  className="w-full px-5 py-3.5 bg-white/5 text-xs font-mono font-bold text-white/70 hover:text-white flex items-center justify-between cursor-pointer transition-colors"
                  onClick={() => setShowAdvanced((prev) => !prev)}
                  type="button"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#635BFF]" />
                    Advanced Settings, Direct Image Upload &amp; Slugs
                  </span>
                  {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showAdvanced && (
                  <div className="p-5 sm:p-6 bg-[#0E0C18]/80 border-t border-white/10 flex flex-col gap-4">
                    <label className="studio-admin-upload">
                      <span>
                        <ImagePlus aria-hidden="true" size={18} className="text-[#635BFF]" />{" "}
                        {selectedFile ? selectedFile.name : form.image_url ? "Replace project thumbnail image" : "Upload custom project image"}
                      </span>
                      <input accept="image/jpeg,image/png,image/webp" onChange={(event) => chooseImage(event.target.files?.[0] ?? null)} type="file" />
                    </label>

                    <label>
                      <span>URL Slug</span>
                      <input maxLength={140} onChange={(event) => updateField("slug", slugify(event.target.value))} value={form.slug} />
                    </label>

                    <label>
                      <span>Project Summary</span>
                      <textarea maxLength={3000} onChange={(event) => updateField("summary", event.target.value)} rows={2} value={form.summary} />
                    </label>

                    <label>
                      <span>Director&apos;s Cut Approach</span>
                      <textarea maxLength={3000} onChange={(event) => updateField("approach", event.target.value)} rows={2} value={form.approach} />
                    </label>

                    <div className="studio-admin-field-pair">
                      <label>
                        <span>Year / Season</span>
                        <input maxLength={32} onChange={(event) => updateField("year_label", event.target.value)} placeholder="2026" value={form.year_label} />
                      </label>
                      <label>
                        <span>Display Order</span>
                        <input min="0" onChange={(event) => updateField("sort_order", event.target.value)} type="number" value={form.sort_order} />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {feedback && <p aria-live="polite" className="studio-admin-feedback" role="status">{feedback}</p>}

              <div className="studio-admin-actions flex flex-wrap items-center gap-3 pt-2">
                <button
                  className="px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#FF4D2D] to-[#FF2E93] hover:from-[#FF3D18] hover:to-[#E62080] shadow-[0_0_25px_rgba(255,77,45,0.45)] hover:shadow-[0_0_35px_rgba(255,77,45,0.6)] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  disabled={saving}
                  type="submit"
                >
                  <Save aria-hidden="true" size={16} /> {saving ? "Saving…" : form.status === "published" ? "Save & Publish Cut" : "Save Draft"}
                </button>
                <button
                  className="px-5 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-[#00E599] bg-[#00E599]/10 border border-[#00E599]/40 hover:bg-[#00E599]/20 hover:border-[#00E599] flex items-center gap-2 transition-all cursor-pointer"
                  onClick={() => setShowPreviewModal(true)}
                  type="button"
                >
                  <Eye aria-hidden="true" size={16} /> Preview Cut
                </button>
                {editingId && (
                  <button className="studio-admin-cancel" onClick={startNewProject} type="button">
                    Cancel Editing
                  </button>
                )}
                {editingId && (
                  <button className="studio-admin-delete" disabled={saving} onClick={deleteProject} type="button">
                    Delete Cut
                  </button>
                )}
              </div>
            </form>

            {/* Live Cut Preview Modal */}
            {showPreviewModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className="bg-[#141122] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/20 relative max-h-[90vh] overflow-y-auto text-white">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D2D] animate-pulse" />
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                        PREVIEW // {form.status.toUpperCase()}
                      </span>
                    </div>
                    <button
                      className="studio-admin-icon-button"
                      onClick={() => setShowPreviewModal(false)}
                      type="button"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <ProjectCard
                    project={{
                      title: form.title || "Untitled Project",
                      slug: form.slug || "preview-slug",
                      category: form.category,
                      format: form.format || "Commercial Cut",
                      image: previewUrl || form.image_url || "/assets/studies/camera-closeup.webp",
                      imageAlt: form.image_alt || form.title,
                      imagePosition: form.image_position,
                      accent: form.accent,
                      platform: form.platform,
                      videoUrl: form.video_url,
                      clientName: form.client_name,
                      featured: form.featured,
                      concept: false,
                    }}
                  />

                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs font-mono text-white/50">
                    <span>Slug: /work/{form.slug || "new-slug"}</span>
                    <button
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-colors"
                      onClick={() => setShowPreviewModal(false)}
                      type="button"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enquiries Screen with 1-Click WhatsApp & Email */}
        {activeTab === "enquiries" && (
          <section aria-labelledby="enquiries-title" className="studio-admin-enquiries">
            <div className="studio-admin-list-heading">
              <div>
                <p className="studio-location text-[#FF2E93] font-bold font-mono text-xs tracking-wider">CLIENT BRIEFS INBOX</p>
                <h2 id="enquiries-title" className="text-2xl font-black text-white">
                  Project Enquiries <span className="text-[#A59FFF] font-mono">({filteredEnquiries.length})</span>
                </h2>
              </div>

              {/* Status filter buttons */}
              <div className="flex flex-wrap gap-2">
                {["all", "new", "contacted", "closed"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setEnquiryStatusFilter(st)}
                    className={`font-mono text-xs uppercase px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                      enquiryStatusFilter === st
                        ? st === "new"
                          ? "bg-[#FF2E93] text-white border-[#FF2E93] font-black shadow-[0_0_15px_rgba(255,46,147,0.4)]"
                          : st === "contacted"
                          ? "bg-[#00D2FF] text-[#0E0C18] border-[#00D2FF] font-black shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                          : st === "closed"
                          ? "bg-white/20 text-white border-white/30 font-bold"
                          : "bg-[#635BFF] text-white border-[#635BFF] font-black shadow-[0_0_15px_rgba(99,91,255,0.4)]"
                        : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:border-white/25"
                    }`}
                  >
                    {st === "all" ? `ALL (${enquiries.length})` : `${st.toUpperCase()} (${enquiries.filter((e) => e.status === st).length})`}
                  </button>
                ))}
              </div>
            </div>

            {enquiriesLoading && <p aria-live="polite" className="text-[#A59FFF] font-mono text-xs">Loading enquiries…</p>}
            {!enquiriesLoading && filteredEnquiries.length === 0 && (
              <div className="py-16 text-center text-white/50 bg-[#181428] rounded-2xl border border-white/10">
                <Inbox size={32} className="mx-auto text-white/20 mb-3" />
                <p className="text-base font-bold text-white mb-1">No enquiries found in this view.</p>
                <p className="text-xs font-mono text-white/40">Client briefs submitted on the website contact form land directly here.</p>
              </div>
            )}
            {!enquiriesLoading && filteredEnquiries.length > 0 && (
              <div className="studio-admin-enquiry-list">
                {filteredEnquiries.map((enquiry) => {
                  const cleanPhone = String(enquiry.phone || "").replace(/[^0-9]/g, "");
                  const whatsAppReplyUrl = cleanPhone
                    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                        `Hi ${enquiry.name}, thank you for contacting VIP STUDIOS regarding your ${enquiry.service} project! We reviewed your brief:`
                      )}`
                    : null;

                  return (
                    <article className="studio-admin-enquiry p-6 rounded-2xl bg-[#181428] border border-white/10 hover:border-white/20 shadow-xl mb-4 transition-all" key={enquiry.id}>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2.5 mb-2">
                          <strong className="text-lg font-bold text-white">{enquiry.name}</strong>
                          {enquiry.company && (
                            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#635BFF]/20 text-[#A59FFF] border border-[#635BFF]/40 font-bold">
                              {enquiry.company}
                            </span>
                          )}
                          <span className="text-xs text-white/40 font-mono ml-auto">
                            {new Date(enquiry.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs font-mono font-bold text-[#FF4D2D] mb-2 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#FF4D2D]/15 border border-[#FF4D2D]/30">
                            Service: {enquiry.service}
                          </span>
                          {enquiry.deadline && (
                            <span className="px-2 py-0.5 rounded bg-[#FFB800]/15 text-[#FFD266] border border-[#FFB800]/30">
                              Timeline: {enquiry.deadline}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed bg-[#0E0C18] p-4 rounded-xl border border-white/10 my-3 font-sans">
                          {enquiry.requirements}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 pt-3.5 border-t border-white/10 w-full">
                        {whatsAppReplyUrl && (
                          <a
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-[#0E0C18] font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(37,211,102,0.35)] transition-all"
                            href={whatsAppReplyUrl}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <MessageCircle size={15} /> Reply on WhatsApp
                          </a>
                        )}
                        {enquiry.email && (
                          <a
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#635BFF] hover:bg-[#5249e0] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(99,91,255,0.35)] transition-all"
                            href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`[VIP STUDIOS] Your Project Brief: ${enquiry.service}`)}`}
                          >
                            <Mail size={15} /> Send Email
                          </a>
                        )}
                        <select
                          aria-label={`Status for ${enquiry.name}`}
                          className="font-mono text-xs px-3 py-2 rounded-xl border border-white/20 bg-[#0E0C18] text-white ml-auto focus:border-[#635BFF] focus:outline-none"
                          onChange={(event) => updateEnquiryStatus(enquiry.id, event.target.value)}
                          value={enquiry.status}
                        >
                          <option value="new">Status: New</option>
                          <option value="contacted">Status: Contacted</option>
                          <option value="closed">Status: Closed</option>
                        </select>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
