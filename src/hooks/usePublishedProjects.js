import { useEffect, useState } from "react";
import { projects as conceptProjects } from "../data/projects.js";
import { supabase } from "../lib/supabase.js";

function fromDatabase(project) {
  return {
    slug: project.slug,
    title: project.title,
    category: project.category,
    format: project.format,
    year: project.year_label,
    featured: project.featured,
    image: project.image_url,
    imageAlt: project.image_alt,
    imagePosition: project.image_position ?? "center",
    accent: project.accent ?? "gold",
    platform: project.platform ?? "image",
    mediaType: project.media_type ?? "image",
    videoUrl: project.video_url ?? "",
    clientName: project.client_name ?? "",
    role: project.role ?? "",
    result: project.result ?? "",
    summary: project.summary,
    approach: project.approach,
    concept: project.is_concept,
  };
}

export default function usePublishedProjects() {
  const [state, setState] = useState({
    projects: conceptProjects,
    isLoading: false,
    error: "",
  });

  useEffect(() => {
    if (!supabase) return undefined;

    let active = true;
    supabase
      .from("projects")
      .select(
        "slug,title,category,format,year_label,image_url,image_alt,image_position,accent,platform,media_type,video_url,client_name,role,result,summary,approach,is_concept,featured",
      )
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;

        if (error) {
          console.warn("Could not query Supabase projects, using fallback:", error.message);
          setState({
            projects: conceptProjects,
            isLoading: false,
            error: "",
          });
          return;
        }

        const dbProjects = (data ?? []).map(fromDatabase);
        setState({
          projects: dbProjects.length > 0 ? dbProjects : conceptProjects,
          isLoading: false,
          error: "",
        });
      })
      .catch((error) => {
        if (!active) return;
        console.warn("Supabase fetch failed, using fallback:", error);
        setState({
          projects: conceptProjects,
          isLoading: false,
          error: "",
        });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
