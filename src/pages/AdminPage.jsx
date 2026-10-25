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
      <main className="studio-admin">
        <div className="studio-admin-card">
          <p className="studio-location">VIP STUDIOS · STUDIO CMS</p>
          <h1>CMS setup needed.</h1>
          <p>
            Add the public Supabase project URL and anon key as
            <code> VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
          </p>
          <Link className="button button-gold" to="/">Back to the website</Link>
        </div>
      </main>
    );
  }

  if (authLoading) {
    return <main aria-live="polite" className="studio-admin-loading">Checking admin session…</main>;
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-[#0E0C18] flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-[#161324] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <Link className="inline-flex items-center gap-1.5 text-xs font-mono text-white/60 hover:text-white transition-colors" to="/">
              <ArrowLeft size={14} /> Public Website
            </Link>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF4D2D] animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF4D2D] font-bold">STUDIO CMS</span>
            </div>
          </div>

          <div className="mb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#635BFF] font-bold block mb-1">
              VIP STUDIOS // CMS PORTAL
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight m-0 mb-2">
              Studio Sign In
            </h1>
            <p className="text-xs text-white/60 m-0 leading-relaxed">
              Enter your authorized administrator credentials to manage portfolio projects, publishing status, and client enquiries.
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={signIn}>
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" size={16} />
                <input
                  autoComplete="username"
                  className="w-full bg-[#0E0C18] border border-white/15 focus:border-[#635BFF] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-mono"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@example.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" size={16} />
                <input
                  autoComplete="current-password"
                  className="w-full bg-[#0E0C18] border border-white/15 focus:border-[#635BFF] rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-mono"
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
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs font-mono" role="alert">
                {feedback}
              </div>
            )}

            <button
              className="button button-gold w-full py-3.5 text-sm font-mono font-bold uppercase tracking-wider mt-2 shadow-[0_0_20px_rgba(255,77,45,0.4)] cursor-pointer"
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
        <header className="studio-admin-header">
          <div>
            <Link className="studio-admin-back" to="/"><ArrowLeft aria-hidden="true" size={16} /> Public website</Link>
            <p className="studio-location">VIP STUDIOS · STUDIO CMS</p>
            <h1>Project Library &amp; Studio Desk</h1>
          </div>
          <button className="studio-admin-signout" onClick={signOut} type="button"><LogOut aria-hidden="true" size={16} /> Sign out</button>
        </header>

        <section aria-label="Project library summary" className="studio-admin-stats">
          {[
            ["Total projects", projects.length],
            ["Published", projects.filter((project) => project.status === "published").length],
            ["Drafts", projects.filter((project) => project.status === "draft").length],
            ["Featured", projects.filter((project) => project.featured).length],
            ["New enquiries", enquiries.filter((enquiry) => enquiry.status === "new").length],
          ].map(([label, value]) => (
            <div key={label}>
              <strong>{String(value).padStart(2, "0")}</strong>
              <span>{label}</span>
            </div>
          ))}
        </section>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E8E4DC] mb-8 gap-4 font-mono text-xs uppercase tracking-wider">
          <button
            onClick={() => setActiveTab("projects")}
            type="button"
            className={`pb-3 px-2.5 flex items-center gap-2 border-b-2 font-bold transition-all ${
              activeTab === "projects"
                ? "border-[#12101E] text-[#12101E]"
                : "border-transparent text-[#5C586B] hover:text-[#12101E]"
            }`}
          >
            <Film size={16} />
            <span>Cuts &amp; Projects</span>
            <span className="px-2 py-0.5 rounded-full bg-[#12101E]/10 text-[10px]">
              {projects.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("enquiries")}
            type="button"
            className={`pb-3 px-2.5 flex items-center gap-2 border-b-2 font-bold transition-all ${
              activeTab === "enquiries"
                ? "border-[#FF4D2D] text-[#FF4D2D]"
                : "border-transparent text-[#5C586B] hover:text-[#12101E]"
            }`}
          >
            <Inbox size={16} />
            <span>Enquiries Inbox</span>
            {enquiries.filter((e) => e.status === "new").length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#FF4D2D] text-white text-[10px] animate-pulse">
                {enquiries.filter((e) => e.status === "new").length} NEW
              </span>
            )}
          </button>
        </div>

        {activeTab === "projects" && (
          <div className="studio-admin-layout">
            <aside aria-label="Saved projects" className="studio-admin-list">
              <div className="studio-admin-list-heading">
                <h2>Projects <span>{filteredProjects.length}</span></h2>
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

              {/* Category filter pills in sidebar */}
              <div className="flex flex-wrap gap-1 mb-3 pb-3 border-b border-[#E8E4DC]">
                {["All", ...CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border transition-all ${
                      categoryFilter === cat
                        ? "bg-[#12101E] text-white border-[#12101E] font-bold"
                        : "bg-white text-[#5C586B] border-[#E8E4DC] hover:border-[#12101E]"
                    }`}
                  >
                    {cat === "All" ? "ALL" : cat}
                  </button>
                ))}
              </div>

              {projectsLoading && <p aria-live="polite">Loading projects…</p>}
              {!projectsLoading && filteredProjects.length === 0 && (
                <div className="py-6 text-center text-xs text-[#5C586B]">
                  <p>No {categoryFilter !== "All" ? categoryFilter : ""} projects found.</p>
                  <button
                    onClick={restoreDefaultCuts}
                    type="button"
                    className="mt-2 text-xs text-[#FF4D2D] underline font-mono"
                  >
                    Restore default cuts
                  </button>
                </div>
              )}
              {filteredProjects.map((project) => (
                <button
                  aria-current={editingId === project.id ? "true" : undefined}
                  className={`studio-admin-project${editingId === project.id ? " is-active" : ""}`}
                  key={project.id}
                  onClick={() => editProject(project)}
                  type="button"
                >
                  <span>{project.title}</span>
                  <small>{project.status} · {project.category}</small>
                </button>
              ))}
            </aside>

            {/* Smart Add / Edit Project Form */}
            <form className="studio-admin-form" onSubmit={saveProject}>
              <div className="studio-admin-form-heading">
                <div>
                  <p className="studio-location">{editingId ? "EDIT PROJECT" : "NEW VIDEO CUT"}</p>
                  <h2>{editingId ? form.title : "Add New Cut from Link"}</h2>
                </div>
                {editingId && (
                  <button aria-label="Close project editor" className="studio-admin-icon-button" onClick={startNewProject} type="button">
                    <X aria-hidden="true" size={18} />
                  </button>
                )}
              </div>

              {/* Direct Video Link Ingest Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F5F3FF] border border-[#635BFF]/25 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#635BFF] m-0 flex items-center gap-1.5">
                    <Sparkles size={14} /> Paste Video Link (YouTube, Shorts, or Instagram Reel)
                  </label>
                  {detectedVideo && (
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#12101E] text-[#00E599] border border-[#00E599]/30">
                      ✓ {detectedVideo.platform === "youtube" ? (detectedVideo.isVertical ? "YouTube Short (9:16)" : "YouTube 4K Video") : "Instagram Reel (9:16)"}
                    </span>
                  )}
                </div>

                <input
                  className="w-full bg-white border border-[#E8E4DC] focus:border-[#635BFF] rounded-xl px-4 py-3 text-sm font-mono text-[#12101E] placeholder-[#8E8A9E] focus:outline-none shadow-sm"
                  maxLength={500}
                  onChange={(event) => handleVideoLinkChange(event.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
                  type="url"
                  value={form.video_url}
                />
                <p className="text-[11px] text-[#5C586B] mt-2 mb-0">
                  Pastes from YouTube and Instagram automatically detect format, aspect ratio, and pull video posters.
                </p>

                {/* Live Detected Poster Preview */}
                {(form.image_url || detectedVideo?.thumbnail) && (
                  <div className="mt-3 pt-3 border-t border-[#635BFF]/15 flex items-center gap-3">
                    <img
                      alt="Detected thumbnail"
                      className="w-20 h-14 object-cover rounded-lg border border-[#E8E4DC] shadow-sm bg-black"
                      src={form.image_url || detectedVideo?.thumbnail}
                    />
                    <div className="text-xs">
                      <strong className="block text-[#12101E] font-mono">Auto-detected Video Poster</strong>
                      <span className="text-[#5C586B] text-[11px]">{form.format} · {form.category}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Client Inputs */}
              <div className="studio-admin-field-pair">
                <label>
                  Project Title / Cut Name <span className="text-[#FF4D2D]">*</span>
                  <input
                    maxLength={120}
                    onChange={(event) => updateTitle(event.target.value)}
                    placeholder="e.g. Apex Velocity Campaign"
                    required
                    value={form.title}
                  />
                </label>
                <label>
                  Client / Brand Name (Optional)
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
                  Category
                  <select onChange={(event) => updateField("category", event.target.value)} value={form.category}>
                    {CATEGORIES.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Publication State
                  <select onChange={(event) => updateField("status", event.target.value)} value={form.status}>
                    <option value="published">Published — live on website</option>
                    <option value="draft">Draft — hidden</option>
                  </select>
                </label>
              </div>

              <div className="studio-admin-checks mb-4">
                <label>
                  <input checked={form.featured} onChange={(event) => updateField("featured", event.target.checked)} type="checkbox" />
                  Feature on homepage showcase
                </label>
              </div>

              {/* Advanced Accordion Toggle */}
              <div className="border border-[#E8E4DC] rounded-2xl overflow-hidden mb-6">
                <button
                  className="w-full px-4 py-3 bg-[#FCFBF8] text-xs font-mono font-bold text-[#5C586B] hover:text-[#12101E] flex items-center justify-between cursor-pointer"
                  onClick={() => setShowAdvanced((prev) => !prev)}
                  type="button"
                >
                  <span>Advanced Settings &amp; Custom Upload (Optional)</span>
                  {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showAdvanced && (
                  <div className="p-4 sm:p-6 bg-white border-t border-[#E8E4DC] flex flex-col gap-4">
                    <label className="studio-admin-upload">
                      <span>
                        <ImagePlus aria-hidden="true" size={18} />{" "}
                        {selectedFile ? selectedFile.name : form.image_url ? "Replace project thumbnail image" : "Upload custom project image"}
                      </span>
                      <input accept="image/jpeg,image/png,image/webp" onChange={(event) => chooseImage(event.target.files?.[0] ?? null)} type="file" />
                    </label>

                    <label>
                      URL Slug
                      <input maxLength={140} onChange={(event) => updateField("slug", slugify(event.target.value))} value={form.slug} />
                    </label>

                    <label>
                      Project Summary
                      <textarea maxLength={3000} onChange={(event) => updateField("summary", event.target.value)} rows={2} value={form.summary} />
                    </label>

                    <label>
                      Director&apos;s Cut Approach
                      <textarea maxLength={3000} onChange={(event) => updateField("approach", event.target.value)} rows={2} value={form.approach} />
                    </label>

                    <div className="studio-admin-field-pair">
                      <label>
                        Year / Season
                        <input maxLength={32} onChange={(event) => updateField("year_label", event.target.value)} placeholder="2026" value={form.year_label} />
                      </label>
                      <label>
                        Display Order
                        <input min="0" onChange={(event) => updateField("sort_order", event.target.value)} type="number" value={form.sort_order} />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {feedback && <p aria-live="polite" className="studio-admin-feedback" role="status">{feedback}</p>}

              <div className="studio-admin-actions">
                <button className="button button-gold" disabled={saving} type="submit">
                  <Save aria-hidden="true" size={17} /> {saving ? "Saving…" : form.status === "published" ? "Save & Publish Cut" : "Save Draft"}
                </button>
                <button className="button button-outline" onClick={() => setShowPreviewModal(true)} type="button">
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
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#FCFBF8] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E4DC] relative max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8E4DC]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF4D2D]" />
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

        {/* Enquiries Screen with 1-Click WhatsApp & Email */}
        {activeTab === "enquiries" && (
          <section aria-labelledby="enquiries-title" className="studio-admin-enquiries">
            <div className="studio-admin-list-heading">
              <div>
                <p className="studio-location">CLIENT BRIEFS INBOX</p>
                <h2 id="enquiries-title">Project Enquiries <span>{filteredEnquiries.length}</span></h2>
              </div>

              {/* Status filter buttons */}
              <div className="flex flex-wrap gap-2">
                {["all", "new", "contacted", "closed"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setEnquiryStatusFilter(st)}
                    className={`font-mono text-xs uppercase px-3 py-1 rounded-full border transition-all ${
                      enquiryStatusFilter === st
                        ? "bg-[#12101E] text-white border-[#12101E] font-bold"
                        : "bg-white text-[#5C586B] border-[#E8E4DC] hover:border-[#12101E]"
                    }`}
                  >
                    {st === "all" ? `ALL (${enquiries.length})` : `${st.toUpperCase()} (${enquiries.filter((e) => e.status === st).length})`}
                  </button>
                ))}
              </div>
            </div>

            {enquiriesLoading && <p aria-live="polite">Loading enquiries…</p>}
            {!enquiriesLoading && filteredEnquiries.length === 0 && (
              <div className="py-12 text-center text-[#5C586B]">
                <p className="text-base font-semibold mb-1">No enquiries found in this view.</p>
                <p className="text-sm">Client briefs submitted on the website will land directly here.</p>
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
                    <article className="studio-admin-enquiry p-6 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm mb-4" key={enquiry.id}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <strong className="text-lg text-[#12101E]">{enquiry.name}</strong>
                          {enquiry.company && (
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F5F3FF] text-[#635BFF]">
                              {enquiry.company}
                            </span>
                          )}
                          <span className="text-xs text-[#8E8A9E] font-mono">
                            {new Date(enquiry.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs font-mono font-bold text-[#FF4D2D] mb-2">
                          Service: {enquiry.service} {enquiry.deadline ? `· Timeline: ${enquiry.deadline}` : ""}
                        </div>
                        <p className="text-sm text-[#5C586B] leading-relaxed bg-[#FCFBF8] p-3 rounded-xl border border-[#E8E4DC] my-3">
                          {enquiry.requirements}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#E8E4DC]">
                        {whatsAppReplyUrl && (
                          <a
                            className="button button-small button-gold text-xs font-mono inline-flex items-center gap-1.5"
                            href={whatsAppReplyUrl}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <MessageCircle size={14} /> Reply on WhatsApp
                          </a>
                        )}
                        {enquiry.email && (
                          <a
                            className="button button-small button-outline text-xs font-mono inline-flex items-center gap-1.5"
                            href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`[VIP STUDIOS] Your Project Brief: ${enquiry.service}`)}`}
                          >
                            <Mail size={14} /> Email
                          </a>
                        )}
                        <select
                          aria-label={`Status for ${enquiry.name}`}
                          className="font-mono text-xs px-2.5 py-1.5 rounded-lg border border-[#E8E4DC] bg-white text-[#12101E] ml-auto"
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
