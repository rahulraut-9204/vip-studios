import { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, LogOut, Plus, Save, X } from "lucide-react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../config/site.js";
import { isSupabaseConfigured, supabase } from "../lib/supabase.js";

const EMPTY_FORM = {
  title: "",
  slug: "",
  category: CATEGORIES[0],
  format: "",
  platform: "image",
  media_type: "image",
  video_url: "",
  client_name: "",
  role: "",
  result: "",
  year_label: "",
  image_alt: "",
  image_url: "",
  image_position: "center",
  accent: "gold",
  summary: "",
  approach: "",
  status: "draft",
  is_concept: true,
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
    platform: project.platform ?? "image",
    media_type: project.media_type ?? "image",
    video_url: project.video_url ?? "",
    client_name: project.client_name ?? "",
    role: project.role ?? "",
    result: project.result ?? "",
    year_label: project.year_label ?? "",
    image_alt: project.image_alt,
    image_url: project.image_url,
    image_position: project.image_position ?? "center",
    accent: project.accent ?? "gold",
    summary: project.summary,
    approach: project.approach,
    status: project.status,
    is_concept: project.is_concept,
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
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const previousTitle = document.title;
    const robotsMeta = document.querySelector('meta[name="robots"]');
    const previousRobots = robotsMeta?.getAttribute("content");

    document.title = "Project library — VIP StudioS";
    robotsMeta?.setAttribute("content", "noindex, nofollow");

    return () => {
      document.title = previousTitle;
      if (previousRobots) {
        robotsMeta?.setAttribute("content", previousRobots);
      } else {
        robotsMeta?.removeAttribute("content");
      }
    };
  }, []);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return undefined;
    }

    let active = true;
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) setSession(nextSession);
    });

    supabase.auth.getSession().then(({ data: result, error }) => {
      if (!active) return;
      if (error) setFeedback(`Could not restore the admin session: ${error.message}`);
      setSession(result.session);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
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
          setFeedback(`Could not load projects. Check the admin allowlist and database migration: ${error.message}`);
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

  function startNewProject(clearFeedback = true) {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSelectedFile(null);
    if (clearFeedback) setFeedback("");
    setPreviewError("");
  }

  function editProject(project) {
    setEditingId(project.id);
    setForm(projectToForm(project));
    setSelectedFile(null);
    setFeedback("");
    setPreviewError("");
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
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
        throw new Error("Use a lowercase URL slug with letters, numbers, and single hyphens.");
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
      }

      if (!imageUrl) throw new Error("Add a project image before saving.");

      const payload = {
        ...form,
        image_url: imageUrl,
        year_label: form.year_label.trim() || "Current",
        sort_order: Number(form.sort_order) || 0,
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
      setFeedback(`${form.status === "published" ? "Project published." : "Draft saved."}${cleanupWarning}`);
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setFeedback(`Sign-in failed: ${error.message}`);
    setPassword("");
  }

  async function signOut() {
    setFeedback("");
    const { error } = await supabase.auth.signOut();
    if (error) setFeedback(`Sign-out failed: ${error.message}`);
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

  if (!isSupabaseConfigured) {
    return (
      <main className="studio-admin">
        <div className="studio-admin-card">
          <p className="studio-location">VIP STUDIOS · CONTENT DESK</p>
          <h1>CMS setup needed.</h1>
          <p>
            Add the public Supabase project URL and anon key as
            <code> VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>,
            then apply the migration in <code>supabase/migrations</code>.
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
      <main className="studio-admin">
        <form className="studio-admin-card studio-admin-login" onSubmit={signIn}>
          <Link className="studio-admin-back" to="/"><ArrowLeft aria-hidden="true" size={16} /> Public website</Link>
          <p className="studio-location">VIP STUDIOS · CONTENT DESK</p>
          <h1>Sign in.</h1>
          <p>Admin access is restricted to accounts explicitly approved in the database.</p>
          <label>Email<input autoComplete="username" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></label>
          <label>Password<input autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
          {feedback && <p className="studio-admin-feedback" role="alert">{feedback}</p>}
          <button className="button button-gold" type="submit">Sign in</button>
        </form>
      </main>
    );
  }

  return (
    <main className="studio-admin">
      <div className="studio-admin-wrap">
        <header className="studio-admin-header">
          <div>
            <Link className="studio-admin-back" to="/"><ArrowLeft aria-hidden="true" size={16} /> Public website</Link>
            <p className="studio-location">VIP STUDIOS · CONTENT DESK</p>
            <h1>Project library.</h1>
          </div>
          <button className="studio-admin-signout" onClick={signOut} type="button"><LogOut aria-hidden="true" size={16} /> Sign out</button>
        </header>

        <section aria-label="Project library summary" className="studio-admin-stats">
          {[
            ["Total projects", projects.length],
            ["Published", projects.filter((project) => project.status === "published").length],
            ["Drafts", projects.filter((project) => project.status === "draft").length],
            ["Featured", projects.filter((project) => project.featured).length],
          ].map(([label, value]) => (
            <div key={label}>
              <strong>{String(value).padStart(2, "0")}</strong>
              <span>{label}</span>
            </div>
          ))}
        </section>

        <div className="studio-admin-layout">
          <aside aria-label="Saved projects" className="studio-admin-list">
            <div className="studio-admin-list-heading">
              <h2>Projects <span>{projects.length}</span></h2>
              <button aria-label="Create a project" className="studio-admin-icon-button" onClick={startNewProject} type="button"><Plus aria-hidden="true" size={18} /></button>
            </div>
            {projectsLoading && <p aria-live="polite">Loading projects…</p>}
            {!projectsLoading && projects.length === 0 && <p>No projects yet. Add a draft to start the library.</p>}
            {projects.map((project) => (
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

          <form className="studio-admin-form" onSubmit={saveProject}>
            <div className="studio-admin-form-heading">
              <div>
                <p className="studio-location">{editingId ? "EDIT PROJECT" : "NEW PROJECT"}</p>
                <h2>{editingId ? form.title : "Add a project"}</h2>
              </div>
              {editingId && <button aria-label="Close project editor" className="studio-admin-icon-button" onClick={startNewProject} type="button"><X aria-hidden="true" size={18} /></button>}
            </div>

            <div className="studio-admin-field-pair">
              <label>Project title<input maxLength={120} onChange={(event) => updateTitle(event.target.value)} required value={form.title} /></label>
              <label>URL slug<input maxLength={140} onChange={(event) => updateField("slug", slugify(event.target.value))} required value={form.slug} /></label>
            </div>

            <div className="studio-admin-field-pair">
              <label>Category<select onChange={(event) => updateField("category", event.target.value)} value={form.category}>
                {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
              </select></label>
              <label>Format<input maxLength={140} onChange={(event) => updateField("format", event.target.value)} required value={form.format} /></label>
            </div>

            <div className="studio-admin-field-pair">
              <label>Media platform<select onChange={(event) => updateField("platform", event.target.value)} value={form.platform}>
                <option value="image">Image study</option>
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                <option value="direct_video">Direct video</option>
              </select></label>
              <label>Media type<select onChange={(event) => updateField("media_type", event.target.value)} value={form.media_type}>
                <option value="image">Poster / image</option>
                <option value="video">Video</option>
              </select></label>
            </div>

            <label>Video or social URL<input maxLength={500} onChange={(event) => updateField("video_url", event.target.value)} placeholder="YouTube, Instagram, or an approved .mp4/.webm URL" type="url" value={form.video_url} /></label>
            <p className="studio-admin-hint">Public pages load the poster first. YouTube and direct video only load when a visitor chooses to play; Instagram opens in a new tab.</p>

            <div className="studio-admin-field-pair">
              <label>Publication state<select onChange={(event) => updateField("status", event.target.value)} value={form.status}>
                <option value="draft">Draft — private</option>
                <option value="published">Published — public</option>
                <option value="archived">Archived — private</option>
              </select></label>
              <label>Display order<input min="0" onChange={(event) => updateField("sort_order", event.target.value)} type="number" value={form.sort_order} /></label>
            </div>

            <div className="studio-admin-checks">
              <label><input checked={form.featured} onChange={(event) => updateField("featured", event.target.checked)} type="checkbox" /> Feature in homepage showcase</label>
              <label><input checked={form.is_concept} onChange={(event) => updateField("is_concept", event.target.checked)} type="checkbox" /> Label as an illustrative concept</label>
            </div>
            <p className="studio-admin-hint">
              Keep the concept label on speculative work. Only publish non-concept
              work after confirming the project, media, and permissions.
            </p>

            <label className="studio-admin-upload">
              <span><ImagePlus aria-hidden="true" size={18} /> {selectedFile ? selectedFile.name : form.image_url ? "Replace project image" : "Choose project image"}</span>
              <input accept="image/jpeg,image/png,image/webp" onChange={(event) => chooseImage(event.target.files?.[0] ?? null)} type="file" />
            </label>
            <p className="studio-admin-hint">JPEG, PNG, or WebP under 8 MB. Images are resized to 1920px and converted to WebP before upload.</p>
            {previewError && <p className="studio-admin-feedback" role="alert">{previewError}</p>}
            {(previewUrl || form.image_url) && <img alt="" className="studio-admin-preview" src={previewUrl || form.image_url} style={{ objectPosition: form.image_position }} />}

            <label>Image description (alt text)<input maxLength={300} onChange={(event) => updateField("image_alt", event.target.value)} required value={form.image_alt} /></label>
            <label>Image focal point<input maxLength={80} onChange={(event) => updateField("image_position", event.target.value)} placeholder="center 50%" value={form.image_position} /></label>
            <label>Project summary<textarea maxLength={3000} onChange={(event) => updateField("summary", event.target.value)} required rows={3} value={form.summary} /></label>
            <label>Creative approach<textarea maxLength={3000} onChange={(event) => updateField("approach", event.target.value)} required rows={4} value={form.approach} /></label>
            <div className="studio-admin-field-pair">
              <label>Client / brand name<input maxLength={120} onChange={(event) => updateField("client_name", event.target.value)} placeholder="Leave blank for concept work" value={form.client_name} /></label>
              <label>Role<input maxLength={180} onChange={(event) => updateField("role", event.target.value)} placeholder="Production, edit, strategy…" value={form.role} /></label>
            </div>
            <label>Result or proof note<textarea maxLength={1000} onChange={(event) => updateField("result", event.target.value)} placeholder="Only add approved, verifiable outcomes. Leave blank when unavailable." rows={2} value={form.result} /></label>
            <div className="studio-admin-field-pair">
              <label>Year or label<input maxLength={32} onChange={(event) => updateField("year_label", event.target.value)} placeholder="2025 or leave blank" value={form.year_label} /></label>
              <label>Accent<select onChange={(event) => updateField("accent", event.target.value)} value={form.accent}>
                {["gold", "amber", "silver", "white"].map((accent) => <option key={accent}>{accent}</option>)}
              </select></label>
            </div>

            {feedback && <p aria-live="polite" className="studio-admin-feedback" role="status">{feedback}</p>}
            <div className="studio-admin-actions">
              <button className="button button-gold" disabled={saving} type="submit"><Save aria-hidden="true" size={17} /> {saving ? "Saving…" : form.status === "published" ? "Save & publish" : "Save project"}</button>
              {editingId && <button className="studio-admin-cancel" onClick={startNewProject} type="button">Cancel editing</button>}
              {editingId && <button className="studio-admin-delete" disabled={saving} onClick={deleteProject} type="button">Delete permanently</button>}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
