import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { trackEvent } from "../data/analytics.js";
import { getProjectBySlug } from "../data/projects.js";
import { serviceOfferings } from "../data/services.js";
import { supabase } from "../lib/supabase.js";
import SiteFooter from "./SiteFooter.jsx";
import SiteHeader from "./SiteHeader.jsx";
import WhatsAppButton from "./WhatsAppButton.jsx";
import MobilePersistentCTA from "./MobilePersistentCTA.jsx";
import ScrollProgressBar from "./ScrollProgressBar.jsx";
import CustomCursor from "./CustomCursor.jsx";

const siteOrigin = "https://vip-studios.pages.dev";

const pageMetadata = {
  "/": {
    title: "VIP StudioS | Social Media Management & Creative Content Agency in Pune",
    description:
      "VIP StudioS helps businesses, brands, professionals, and creators build their digital presence through social media management, strategic content creation, and professional video production.",
  },
  "/services": {
    title: "Social Media & Video Services | VIP StudioS Pune",
    description:
      "Complete social media management, Reels creation, video shooting & editing, YouTube management, and creative design in Pune, India.",
  },
  "/work": {
    title: "Our Work & Portfolio | VIP StudioS",
    description:
      "Browse actual client work across social media management, Instagram Reels, YouTube videos, and brand campaigns.",
  },
  "/about": {
    title: "About VIP StudioS | Social Media & Creative Agency",
    description:
      "Learn about VIP StudioS: our team, creative philosophy, and 6+ years of social media and video production experience in Pune.",
  },
  "/process": {
    title: "Our Content Process | VIP StudioS",
    description:
      "From strategy to publishing: explore our 6-step content pipeline for social media management and brand growth.",
  },
  "/contact": {
    title: "Start Your Project | VIP StudioS",
    description:
      "Discuss your social media management, content creation, or video production requirements with the VIP StudioS team in Pune.",
  },
};

function applyRouteMetadata(pathname, project, service, pendingProject = false) {
  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  const metadata = pendingProject
    ? {
        title: "Selected Project — VIP StudioS",
        description: "Explore selected social media and content work from VIP StudioS.",
      }
    : project
    ? {
        title: `${project.title} — VIP StudioS`,
        description: project.summary,
      }
    : service
      ? {
          title: `${service.title} — VIP StudioS`,
          description: service.description,
        }
      : pageMetadata[normalizedPath] ?? {
          title: "Page Not Found — VIP StudioS",
          description:
            "This page is not available. Explore VIP StudioS services or contact the studio.",
        };
  const canonicalUrl = new URL(pathname, siteOrigin).href;
  const isNotFound =
    (!project && !service && !pendingProject && !pageMetadata[normalizedPath]) ||
    pendingProject;

  document.title = metadata.title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", metadata.description);
  document
    .querySelector('meta[property="og:title"]')
    ?.setAttribute("content", metadata.title);
  document
    .querySelector('meta[property="og:description"]')
    ?.setAttribute("content", metadata.description);
  document
    .querySelector('meta[property="og:url"]')
    ?.setAttribute("content", canonicalUrl);
  document
    .querySelector('meta[property="og:type"]')
    ?.setAttribute("content", project ? "article" : "website");
  document
    .querySelector('meta[name="twitter:title"]')
    ?.setAttribute("content", metadata.title);
  document
    .querySelector('meta[name="twitter:description"]')
    ?.setAttribute("content", metadata.description);
  document
    .querySelector('link[rel="canonical"]')
    ?.setAttribute("href", canonicalUrl);
  document
    .querySelector('meta[name="robots"]')
    ?.setAttribute("content", isNotFound ? "noindex, follow" : "index, follow");
}

function RouteMetadata() {
  const { pathname } = useLocation();
  const projectSlugMatch = pathname.match(/^\/work\/([^/]+)/);
  const projectSlug = projectSlugMatch?.[1];
  const serviceSlugMatch = pathname.match(/^\/services\/([^/]+)/);
  const serviceSlug = serviceSlugMatch?.[1];

  const localProject = projectSlug ? getProjectBySlug(projectSlug) : null;
  const localService = serviceSlug
    ? serviceOfferings.find((s) => s.slug === serviceSlug)
    : null;

  useEffect(() => {
    let isMounted = true;
    if (projectSlug && !localProject && supabase) {
      applyRouteMetadata(pathname, null, null, true);
      supabase
        .from("projects")
        .select("title, summary")
        .eq("slug", projectSlug)
        .eq("status", "published")
        .maybeSingle()
        .then(({ data }) => {
          if (!isMounted) return;
          applyRouteMetadata(pathname, data ? { title: data.title, summary: data.summary } : null, null);
        })
        .catch(() => {
          if (isMounted) applyRouteMetadata(pathname, null, null);
        });
      return () => {
        isMounted = false;
      };
    }

    applyRouteMetadata(pathname, localProject, localService);
    return () => {
      isMounted = false;
    };
  }, [pathname, projectSlug, localProject, localService]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function ConversionEvents() {
  useEffect(() => {
    function handleClick(event) {
      const target = event.target instanceof Element ? event.target.closest("a, button") : null;
      if (!target) return;
      const href = target.getAttribute("href") || "";
      const label = target.getAttribute("aria-label") || target.textContent?.trim()?.replace(/\s+/g, " ") || "";
      if (href.startsWith("https://wa.me/")) {
        trackEvent("whatsapp_click", { link_text: label });
      } else if (href.startsWith("mailto:")) {
        trackEvent("email_click", { link_text: label });
      } else if (href.startsWith("tel:")) {
        trackEvent("call_click", { link_text: label });
      } else if (target.closest(".project-link")) {
        trackEvent("portfolio_view", { project_name: label });
      } else if (target.matches(".button, .studio-text-link")) {
        trackEvent("cta_click", { link_text: label, link_url: href });
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}

export default function SiteShell() {
  return (
    <>
      <ScrollProgressBar />
      <CustomCursor />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <RouteMetadata />
      <ConversionEvents />
      <main id="main-content" tabIndex="-1">
        <Outlet />
      </main>
      <WhatsAppButton />
      <MobilePersistentCTA />
      <SiteFooter />
    </>
  );
}
