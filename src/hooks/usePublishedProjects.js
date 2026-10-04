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
    summary: project.summary,
    approach: project.approach,
    concept: project.is_concept,
  };
}

export default function usePublishedProjects() {
  const [state, setState] = useState({
    projects: supabase ? [] : conceptProjects,
    isLoading: Boolean(supabase),
    error: "",
  });

  useEffect(() => {
    if (!supabase) return undefined;

    let active = true;
    supabase
      .from("projects")
      .select(
        "slug,title,category,format,year_label,image_url,image_alt,image_position,accent,summary,approach,is_concept,featured",
      )
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;

        if (error) {
          setState({ projects: [], isLoading: false, error: error.message });
          return;
        }

        setState({
          projects: (data ?? []).map(fromDatabase),
          isLoading: false,
          error: "",
        });
      })
      .catch((error) => {
        if (!active) return;
        setState({
          projects: [],
          isLoading: false,
          error: error instanceof Error ? error.message : String(error),
        });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
