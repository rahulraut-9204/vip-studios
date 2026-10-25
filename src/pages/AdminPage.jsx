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

  if (!isSupabaseConfigured) {
    return (
      <main className="min-h-screen bg-[#FCFBF9] flex items-center justify-center p-4 py-16 font-sans">
        <div className="w-full max-w-md bg-white border border-[#E8E4DC] rounded-3xl p-8 sm:p-10 shadow-xl text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D2D]" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF4D2D] font-bold">
              VIP STUDIOS · STUDIO CMS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#12101E] tracking-tight mb-2">CMS Setup Needed</h1>
          <p className="text-xs text-[#5C586B] mb-6 leading-relaxed font-sans">
            Add your Supabase project credentials as
            <code className="text-[#635BFF] bg-[#F5F3FF] px-1.5 py-0.5 rounded font-mono ml-1">VITE_SUPABASE_URL</code> and{" "}
            <code className="text-[#635BFF] bg-[#F5F3FF] px-1.5 py-0.5 rounded font-mono">VITE_SUPABASE_ANON_KEY</code>.
          </p>
          <Link className="button button-gold w-full text-center block text-xs font-mono font-bold uppercase tracking-wider py-3.5 shadow-sm" to="/">
            Back to Public Website
          </Link>
        </div>
      </main>
    );
  }

  if (authLoading) {
    return (
      <main aria-live="polite" className="min-h-screen bg-[#FCFBF9] flex flex-col items-center justify-center gap-3 text-[#5C586B] font-mono text-xs">
        <div className="w-8 h-8 rounded-full border-2 border-[#12101E] border-t-transparent animate-spin" />
        <span>Checking studio session…</span>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-[#FCFBF9] flex items-center justify-center p-4 py-16 font-sans">
        <div className="w-full max-w-md bg-white border border-[#E8E4DC] rounded-3xl p-8 sm:p-10 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E8E4DC]">
            <Link className="inline-flex items-center gap-1.5 text-xs font-mono text-[#5C586B] hover:text-[#12101E] transition-colors" to="/">
              <ArrowLeft size={14} /> Public Website
            </Link>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF4D2D] animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF4D2D] font-bold">STUDIO CMS</span>
            </div>
          </div>

          <div className="mb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#635BFF] font-bold block mb-1.5">
              VIP STUDIOS // CMS PORTAL
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#12101E] tracking-tight m-0 mb-2 font-display">
              Studio Sign In
            </h1>
            <p className="text-xs text-[#5C586B] m-0 leading-relaxed font-sans">
              Enter your authorized administrator credentials to manage portfolio cuts, publishing workflows, and client enquiries.
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={signIn}>
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#12101E] mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8A9E] pointer-events-none" size={16} />
                <input
                  autoComplete="username"
                  className="w-full bg-white border border-[#E8E4DC] focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/15 rounded-xl pl-10 pr-4 py-3 text-sm text-[#12101E] placeholder-[#8E8A9E] focus:outline-none transition-all font-mono"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@example.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#12101E] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8A9E] pointer-events-none" size={16} />
                <input
                  autoComplete="current-password"
                  className="w-full bg-white border border-[#E8E4DC] focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/15 rounded-xl pl-10 pr-11 py-3 text-sm text-[#12101E] placeholder-[#8E8A9E] focus:outline-none transition-all font-mono"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E8A9E] hover:text-[#12101E] transition-colors cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                  type="button"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {feedback && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono" role="alert">
                {feedback}
              </div>
            )}

            <button
              className="button button-gold w-full py-3.5 text-sm font-mono font-bold uppercase tracking-wider mt-2 shadow-sm cursor-pointer disabled:opacity-50"
              disabled={isSigningIn}
              type="submit"
            >
              {isSigningIn ? "Signing in to Studio Desk…" : "Sign In to Studio Desk"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E8E4DC] text-center text-[11px] font-mono text-[#8E8A9E]">
            Protected studio administration console · Authorized access only
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="studio-page studio-admin-page bg-[#FCFBF9] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Studio Header */}
        <header className="mb-8 pb-8 border-b border-[#E8E4DC] flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D2D] shadow-[0_0_8px_#FF4D2D]" />
              <p className="m-0 font-mono text-xs uppercase tracking-widest text-[#FF4D2D] font-bold">
                VIP STUDIOS · STUDIO CMS CONSOLE
              </p>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#12101E] m-0 mb-2 font-display">
              Project Library &amp; <span className="text-[#FF4D2D]">Studio Desk.</span>
            </h1>
            <p className="text-base text-[#5C586B] max-w-2xl leading-relaxed m-0 font-sans">
              Manage portfolio cuts, instant video link ingests, and incoming client briefs in one central cutting room.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="button button-outline text-xs font-mono font-bold inline-flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Public Website
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#057A4E] text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00E599]" />
              {session.user?.email || "Admin"}
            </div>
            <button
              onClick={signOut}
              type="button"
              className="button button-outline text-xs font-mono font-bold text-red-600 hover:border-red-300 hover:bg-red-50 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </header>

        {/* 5 Clean Editorial Key Metric Cards */}
        <section aria-label="Project library summary" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {/* Card 1: Total Cuts */}
          <div className="bg-white border border-[#E8E4DC] border-t-4 border-t-[#635BFF] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#635BFF]">MEDIA VAULT</span>
              <Film className="text-[#635BFF]" size={16} />
            </div>
            <strong className="block text-3xl sm:text-4xl font-black text-[#12101E] font-mono leading-none mb-1">
              {String(projects.length).padStart(2, "0")}
            </strong>
            <span className="text-xs font-mono text-[#5C586B] font-bold uppercase">Total Cuts</span>
          </div>

          {/* Card 2: Published */}
          <div className="bg-white border border-[#E8E4DC] border-t-4 border-t-[#00E599] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#057A4E]">LIVE ON WEB</span>
              <Check className="text-[#057A4E]" size={16} />
            </div>
            <strong className="block text-3xl sm:text-4xl font-black text-[#12101E] font-mono leading-none mb-1">
              {String(projects.filter((p) => p.status === "published").length).padStart(2, "0")}
            </strong>
            <span className="text-xs font-mono text-[#5C586B] font-bold uppercase">Published</span>
          </div>

          {/* Card 3: Drafts */}
          <div className="bg-white border border-[#E8E4DC] border-t-4 border-t-[#FFB800] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#B45309]">TIMELINE</span>
              <EyeOff className="text-[#B45309]" size={16} />
            </div>
            <strong className="block text-3xl sm:text-4xl font-black text-[#12101E] font-mono leading-none mb-1">
              {String(projects.filter((p) => p.status === "draft").length).padStart(2, "0")}
            </strong>
            <span className="text-xs font-mono text-[#5C586B] font-bold uppercase">Drafts</span>
          </div>

          {/* Card 4: Featured */}
          <div className="bg-white border border-[#E8E4DC] border-t-4 border-t-[#FF4D2D] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF4D2D]">HERO CUTS</span>
              <Sparkles className="text-[#FF4D2D]" size={16} />
            </div>
            <strong className="block text-3xl sm:text-4xl font-black text-[#12101E] font-mono leading-none mb-1">
              {String(projects.filter((p) => p.featured).length).padStart(2, "0")}
            </strong>
            <span className="text-xs font-mono text-[#5C586B] font-bold uppercase">Featured</span>
          </div>

          {/* Card 5: New Enquiries */}
          <div className="bg-white border border-[#E8E4DC] border-t-4 border-t-[#FF2E93] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#BE185D]">CLIENT BRIEFS</span>
              <Inbox className="text-[#BE185D]" size={16} />
            </div>
            <div className="flex items-baseline gap-2">
              <strong className="block text-3xl sm:text-4xl font-black text-[#12101E] font-mono leading-none mb-1">
                {String(enquiries.filter((e) => e.status === "new").length).padStart(2, "0")}
              </strong>
              {enquiries.filter((e) => e.status === "new").length > 0 && (
                <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded bg-[#FF2E93] text-white animate-pulse">
                  NEW
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-[#5C586B] font-bold uppercase">New Briefs</span>
          </div>
        </section>

        {/* Navigation Tabs Styled Identical to WorkPage Filter Pills */}
        <div className="flex items-center gap-3 border-b border-[#E8E4DC] pb-6 mb-8 font-mono text-xs uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("projects")}
            type="button"
            className={`px-5 py-2.5 rounded-full border transition-all cursor-pointer font-bold flex items-center gap-2 ${
              activeTab === "projects"
                ? "bg-[#12101E] text-white border-[#12101E] shadow-sm scale-105"
                : "bg-white text-[#5C586B] border-[#E8E4DC] hover:border-[#12101E] hover:text-[#12101E]"
            }`}
          >
            <Film size={15} />
            <span>Cuts &amp; Projects</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === "projects" ? "bg-white/20 text-white" : "bg-black/5 text-[#5C586B]"
            }`}>
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("enquiries")}
            type="button"
            className={`px-5 py-2.5 rounded-full border transition-all cursor-pointer font-bold flex items-center gap-2 ${
              activeTab === "enquiries"
                ? "bg-[#FF4D2D] text-white border-[#FF4D2D] shadow-sm scale-105"
                : "bg-white text-[#5C586B] border-[#E8E4DC] hover:border-[#12101E] hover:text-[#12101E]"
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
                activeTab === "enquiries" ? "bg-white/20 text-white" : "bg-black/5 text-[#5C586B]"
              }`}>
                {enquiries.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Project Library & Editor */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cuts Library */}
            <aside aria-label="Saved projects" className="lg:col-span-5 bg-white border border-[#E8E4DC] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E4DC]">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-[#12101E] m-0 font-display">Project Cuts</h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#F5F3FF] text-[#635BFF] text-xs font-mono font-bold">
                    {filteredProjects.length}
                  </span>
                </div>
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
                    className="button button-small button-dark inline-flex items-center gap-1 text-xs font-mono font-bold"
                    onClick={() => startNewProject(true)}
                    type="button"
                  >
                    <Plus size={16} /> New Cut
                  </button>
                </div>
              </div>

              {/* Category Filter Pills (Same as WorkPage) */}
              <div className="flex flex-wrap gap-1.5 mb-4 pb-4 border-b border-[#E8E4DC]">
                {["All", ...CATEGORIES].map((cat) => {
                  const isActive = categoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`text-[10px] font-mono uppercase px-3 py-1 rounded-full border transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#12101E] text-white border-[#12101E] font-bold shadow-sm"
                          : "bg-white text-[#5C586B] border-[#E8E4DC] hover:border-[#12101E] hover:text-[#12101E]"
                      }`}
                    >
                      {cat === "All" ? "ALL" : cat}
                    </button>
                  );
                })}
              </div>

              {projectsLoading && (
                <div className="py-8 text-center text-xs font-mono text-[#5C586B]">
                  <span className="inline-block animate-spin mr-2">●</span> Loading studio cuts…
                </div>
              )}
              {!projectsLoading && filteredProjects.length === 0 && (
                <div className="py-8 text-center text-xs text-[#5C586B]">
                  <p className="font-semibold text-[#12101E] mb-1">No {categoryFilter !== "All" ? categoryFilter : ""} cuts found.</p>
                  <button
                    onClick={restoreDefaultCuts}
                    type="button"
                    className="mt-2 text-xs text-[#FF4D2D] hover:underline font-mono"
                  >
                    Restore default cuts
                  </button>
                </div>
              )}
              <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
                {filteredProjects.map((project) => {
                  const isEditing = editingId === project.id;
                  const isPub = project.status === "published";
                  return (
                    <button
                      aria-current={isEditing ? "true" : undefined}
                      className={`p-3.5 rounded-2xl border transition-all text-left w-full cursor-pointer ${
                        isEditing
                          ? "bg-[#FFF8F6] border-[#FF4D2D] border-l-4 shadow-sm"
                          : "bg-[#FCFBF9] border-[#E8E4DC] hover:bg-white hover:border-[#12101E]"
                      }`}
                      key={project.id}
                      onClick={() => editProject(project)}
                      type="button"
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-bold text-[#12101E] text-sm line-clamp-1">{project.title}</span>
                        {project.featured && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-orange-50 text-[#FF4D2D] border border-orange-200">
                            ★ FEATURED
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                          isPub
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {project.status}
                        </span>
                        <span className="text-[#8E8A9E]">·</span>
                        <span className="text-[#5C586B] truncate">{project.category}</span>
                        {project.format && (
                          <>
                            <span className="text-[#8E8A9E]">·</span>
                            <span className="text-[#8E8A9E] truncate">{project.format.split(" ")[0]}</span>
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Right Column: Smart Add / Edit Cut Form */}
            <form className="lg:col-span-7 bg-white border border-[#E8E4DC] rounded-3xl p-6 sm:p-8 shadow-sm" onSubmit={saveProject}>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E8E4DC]">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF4D2D] m-0">
                    {editingId ? "EDITING PROJECT" : "NEW VIDEO CUT"}
                  </p>
                  <h2 className="text-xl sm:text-2xl font-black text-[#12101E] tracking-tight m-0 mt-0.5 font-display">
                    {editingId ? form.title : "Add New Cut from Link"}
                  </h2>
                </div>
                {editingId && (
                  <button aria-label="Close project editor" className="studio-admin-icon-button" onClick={startNewProject} type="button">
                    <X aria-hidden="true" size={18} />
                  </button>
                )}
              </div>

              {/* Direct Video Link Ingest Section */}
              <div className="p-5 rounded-2xl bg-[#F6F4FE] border border-[#635BFF]/25 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#635BFF] m-0 flex items-center gap-1.5">
                    <Sparkles size={15} /> Paste Video Link (YouTube, Shorts, or Instagram Reel)
                  </label>
                  {detectedVideo && (
                    <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#12101E] text-[#00E599] border border-[#00E599]/30 flex items-center gap-1">
                      ✓ {detectedVideo.platform === "youtube" ? (detectedVideo.isVertical ? "YouTube Short (9:16)" : "YouTube 4K Master") : "Instagram Reel (9:16)"}
                    </span>
                  )}
                </div>

                <input
                  className="w-full bg-white border border-[#E8E4DC] focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/15 rounded-xl px-4 py-3 text-sm font-mono text-[#12101E] placeholder-[#8E8A9E] focus:outline-none shadow-sm transition-all"
                  maxLength={500}
                  onChange={(event) => handleVideoLinkChange(event.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
                  type="url"
                  value={form.video_url}
                />
                <p className="text-[11px] font-sans text-[#5C586B] mt-2 mb-0">
                  Pastes from YouTube and Instagram automatically detect aspect ratio (16:9 or 9:16) and extract high-resolution posters.
                </p>

                {/* Live Detected Poster Preview */}
                {(form.image_url || detectedVideo?.thumbnail) && (
                  <div className="mt-3.5 pt-3.5 border-t border-[#635BFF]/15 flex items-center gap-3.5">
                    <div className="relative rounded-lg overflow-hidden border border-[#E8E4DC] shadow-sm bg-black">
                      <img
                        alt="Detected thumbnail"
                        className="w-24 h-16 object-cover"
                        src={form.image_url || detectedVideo?.thumbnail}
                      />
                      <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] font-mono text-white px-1 py-0.5 rounded">
                        {form.format?.includes("9:16") ? "9:16" : "16:9"}
                      </span>
                    </div>
                    <div className="text-xs">
                      <strong className="block text-[#12101E] font-mono font-bold">Auto-detected Video Poster &amp; Aspect</strong>
                      <span className="text-[#5C586B] text-[11px]">{form.format} · {form.category}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Client Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#12101E] mb-1.5">
                    Project Title / Cut Name <span className="text-[#FF4D2D]">*</span>
                  </label>
                  <input
                    className="w-full bg-white border border-[#E8E4DC] focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/15 rounded-xl px-4 py-3 text-sm text-[#12101E] focus:outline-none transition-all font-sans"
                    maxLength={120}
                    onChange={(event) => updateTitle(event.target.value)}
                    placeholder="e.g. Apex Velocity Campaign"
                    required
                    value={form.title}
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#12101E] mb-1.5">
                    Client / Brand Name (Optional)
                  </label>
                  <input
                    className="w-full bg-white border border-[#E8E4DC] focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/15 rounded-xl px-4 py-3 text-sm text-[#12101E] focus:outline-none transition-all font-sans"
                    maxLength={120}
                    onChange={(event) => updateField("client_name", event.target.value)}
                    placeholder="e.g. CineWave, Nike, or Handle"
                    value={form.client_name}
                  />
                </div>
              </div>

              {/* Category & Publication State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#12101E] mb-1.5">
                    Category
                  </label>
                  <select
                    className="w-full bg-white border border-[#E8E4DC] focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/15 rounded-xl px-4 py-3 text-sm text-[#12101E] focus:outline-none transition-all font-sans cursor-pointer"
                    onChange={(event) => updateField("category", event.target.value)}
                    value={form.category}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#12101E] mb-1.5">
                    Publication State
                  </label>
                  <select
                    className="w-full bg-white border border-[#E8E4DC] focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/15 rounded-xl px-4 py-3 text-sm text-[#12101E] focus:outline-none transition-all font-sans cursor-pointer"
                    onChange={(event) => updateField("status", event.target.value)}
                    value={form.status}
                  >
                    <option value="published">Published — Live on Public Site</option>
                    <option value="draft">Draft — Hidden In Studio Desk</option>
                  </select>
                </div>
              </div>

              {/* Feature Checkbox */}
              <div className="p-3.5 rounded-xl bg-[#FCFBF9] border border-[#E8E4DC] mb-5">
                <label className="flex items-center gap-2.5 cursor-pointer text-sm font-sans text-[#12101E] font-medium m-0">
                  <input
                    checked={form.featured}
                    className="w-4 h-4 accent-[#FF4D2D] rounded cursor-pointer"
                    onChange={(event) => updateField("featured", event.target.checked)}
                    type="checkbox"
                  />
                  <span>Feature in Homepage Showcase</span>
                </label>
              </div>

              {/* Advanced Accordion Toggle */}
              <div className="border border-[#E8E4DC] rounded-2xl overflow-hidden mb-6 bg-[#FCFBF9]">
                <button
                  className="w-full px-5 py-3.5 bg-white text-xs font-mono font-bold text-[#5C586B] hover:text-[#12101E] flex items-center justify-between cursor-pointer border-b border-[#E8E4DC] transition-colors"
                  onClick={() => setShowAdvanced((prev) => !prev)}
                  type="button"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#635BFF]" />
                    Advanced Settings, Image Upload &amp; Slugs
                  </span>
                  {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showAdvanced && (
                  <div className="p-5 sm:p-6 bg-white flex flex-col gap-4">
                    <label className="studio-admin-upload">
                      <span>
                        <ImagePlus aria-hidden="true" size={18} className="text-[#635BFF]" />{" "}
                        {selectedFile ? selectedFile.name : form.image_url ? "Replace project thumbnail image" : "Upload custom project image"}
                      </span>
                      <input accept="image/jpeg,image/png,image/webp" onChange={(event) => chooseImage(event.target.files?.[0] ?? null)} type="file" />
                    </label>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#12101E] mb-1.5">
                        URL Slug
                      </label>
                      <input
                        className="w-full bg-white border border-[#E8E4DC] focus:border-[#635BFF] rounded-xl px-4 py-3 text-sm font-mono text-[#12101E]"
                        maxLength={140}
                        onChange={(event) => updateField("slug", slugify(event.target.value))}
                        value={form.slug}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#12101E] mb-1.5">
                        Project Summary
                      </label>
                      <textarea
                        className="w-full bg-white border border-[#E8E4DC] focus:border-[#635BFF] rounded-xl px-4 py-3 text-sm text-[#12101E] font-sans"
                        maxLength={3000}
                        onChange={(event) => updateField("summary", event.target.value)}
                        rows={2}
                        value={form.summary}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#12101E] mb-1.5">
                        Director&apos;s Cut Approach
                      </label>
                      <textarea
                        className="w-full bg-white border border-[#E8E4DC] focus:border-[#635BFF] rounded-xl px-4 py-3 text-sm text-[#12101E] font-sans"
                        maxLength={3000}
                        onChange={(event) => updateField("approach", event.target.value)}
                        rows={2}
                        value={form.approach}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#12101E] mb-1.5">
                          Year / Season
                        </label>
                        <input
                          className="w-full bg-white border border-[#E8E4DC] focus:border-[#635BFF] rounded-xl px-4 py-3 text-sm font-mono text-[#12101E]"
                          maxLength={32}
                          onChange={(event) => updateField("year_label", event.target.value)}
                          placeholder="2026"
                          value={form.year_label}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#12101E] mb-1.5">
                          Display Order
                        </label>
                        <input
                          className="w-full bg-white border border-[#E8E4DC] focus:border-[#635BFF] rounded-xl px-4 py-3 text-sm font-mono text-[#12101E]"
                          min="0"
                          onChange={(event) => updateField("sort_order", event.target.value)}
                          type="number"
                          value={form.sort_order}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {feedback && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-mono mb-4" role="status">
                  {feedback}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#E8E4DC]">
                <button
                  className="button button-gold inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider shadow-sm cursor-pointer disabled:opacity-50"
                  disabled={saving}
                  type="submit"
                >
                  <Save aria-hidden="true" size={16} /> {saving ? "Saving…" : form.status === "published" ? "Save & Publish Cut" : "Save Draft"}
                </button>
                <button
                  className="button button-outline inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                  onClick={() => setShowPreviewModal(true)}
                  type="button"
                >
                  <Eye aria-hidden="true" size={16} /> Preview Cut
                </button>
                {editingId && (
                  <button className="button button-outline text-xs font-mono text-[#5C586B]" onClick={startNewProject} type="button">
                    Cancel Editing
                  </button>
                )}
                {editingId && (
                  <button
                    className="button bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-full px-5 py-2.5 text-xs font-bold font-mono ml-auto cursor-pointer"
                    disabled={saving}
                    onClick={deleteProject}
                    type="button"
                  >
                    Delete Cut
                  </button>
                )}
              </div>
            </form>

            {/* Live Cut Preview Modal */}
            {showPreviewModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-[#FCFBF9] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E4DC] relative max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8E4DC]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D2D]" />
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#12101E]">
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

                  <div className="mt-4 pt-4 border-t border-[#E8E4DC] flex justify-between items-center text-xs font-mono text-[#5C586B]">
                    <span>Slug: /work/{form.slug || "new-slug"}</span>
                    <button
                      className="button button-small button-dark"
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

        {/* Tab 2: Enquiries Screen */}
        {activeTab === "enquiries" && (
          <section aria-labelledby="enquiries-title" className="bg-white border border-[#E8E4DC] rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#E8E4DC] gap-4">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF4D2D] m-0">CLIENT BRIEFS INBOX</p>
                <h2 id="enquiries-title" className="text-2xl font-black text-[#12101E] tracking-tight m-0 mt-0.5 font-display">
                  Project Enquiries <span className="text-[#635BFF] font-mono text-lg">({filteredEnquiries.length})</span>
                </h2>
              </div>

              {/* Status filter buttons matching WorkPage filter style */}
              <div className="flex flex-wrap gap-2">
                {["all", "new", "contacted", "closed"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setEnquiryStatusFilter(st)}
                    className={`font-mono text-xs uppercase px-4 py-1.5 rounded-full border transition-all cursor-pointer ${
                      enquiryStatusFilter === st
                        ? "bg-[#12101E] text-white border-[#12101E] font-bold shadow-sm scale-105"
                        : "bg-white text-[#5C586B] border-[#E8E4DC] hover:border-[#12101E] hover:text-[#12101E]"
                    }`}
                  >
                    {st === "all" ? `ALL (${enquiries.length})` : `${st.toUpperCase()} (${enquiries.filter((e) => e.status === st).length})`}
                  </button>
                ))}
              </div>
            </div>

            {enquiriesLoading && (
              <div className="py-12 text-center text-xs font-mono text-[#5C586B]">
                <span className="inline-block animate-spin mr-2">●</span> Loading briefs…
              </div>
            )}
            {!enquiriesLoading && filteredEnquiries.length === 0 && (
              <div className="py-16 text-center text-[#5C586B]">
                <Inbox size={36} className="mx-auto text-[#8E8A9E] mb-3" />
                <p className="text-base font-bold text-[#12101E] mb-1">No enquiries found in this view.</p>
                <p className="text-xs font-sans text-[#5C586B]">Client briefs submitted on the website contact form land directly here.</p>
              </div>
            )}
            {!enquiriesLoading && filteredEnquiries.length > 0 && (
              <div className="flex flex-col gap-4">
                {filteredEnquiries.map((enquiry) => {
                  const cleanPhone = String(enquiry.phone || "").replace(/[^0-9]/g, "");
                  const whatsAppReplyUrl = cleanPhone
                    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                        `Hi ${enquiry.name}, thank you for contacting VIP STUDIOS regarding your ${enquiry.service} project! We reviewed your brief:`
                      )}`
                    : null;

                  return (
                    <article className="p-6 rounded-2xl bg-[#FCFBF9] border border-[#E8E4DC] hover:border-[#12101E] transition-all shadow-sm" key={enquiry.id}>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2.5 mb-2">
                          <strong className="text-lg font-bold text-[#12101E]">{enquiry.name}</strong>
                          {enquiry.company && (
                            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#F6F4FE] text-[#635BFF] border border-[#635BFF]/25 font-bold">
                              {enquiry.company}
                            </span>
                          )}
                          <span className="text-xs text-[#8E8A9E] font-mono ml-auto">
                            {new Date(enquiry.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs font-mono font-bold text-[#FF4D2D] mb-2 flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded bg-red-50 text-[#FF4D2D] border border-red-200">
                            Service: {enquiry.service}
                          </span>
                          {enquiry.deadline && (
                            <span className="px-2.5 py-0.5 rounded bg-amber-50 text-[#B45309] border border-amber-200">
                              Timeline: {enquiry.deadline}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#4E4A5C] leading-relaxed bg-white p-4 rounded-xl border border-[#E8E4DC] my-3 font-sans">
                          {enquiry.requirements}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 pt-3.5 border-t border-[#E8E4DC] w-full">
                        {whatsAppReplyUrl && (
                          <a
                            className="button button-small bg-[#25D366] hover:bg-[#20ba59] text-white font-mono font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm"
                            href={whatsAppReplyUrl}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <MessageCircle size={15} /> Reply on WhatsApp
                          </a>
                        )}
                        {enquiry.email && (
                          <a
                            className="button button-small button-outline text-xs font-mono font-bold inline-flex items-center gap-1.5"
                            href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`[VIP STUDIOS] Your Project Brief: ${enquiry.service}`)}`}
                          >
                            <Mail size={15} /> Send Email
                          </a>
                        )}
                        <select
                          aria-label={`Status for ${enquiry.name}`}
                          className="font-mono text-xs px-3 py-1.5 rounded-xl border border-[#E8E4DC] bg-white text-[#12101E] ml-auto focus:border-[#635BFF] focus:outline-none"
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
