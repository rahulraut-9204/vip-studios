import { useEffect, useRef, useState } from "react";
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
import ExitIntentModal from "./ExitIntentModal.jsx";
import CalendlyModal from "./CalendlyModal.jsx";

const siteOrigin = "https://vip-studios.pages.dev";

const pageMetadata = {
  "/": {
    title: "VIP StudioS | Complete Content, Social Media & Digital Growth Partner",
    description:
      "We turn content into customers. Commercial video production, high-retention video editing, viral reels, podcasts, and full-funnel digital growth.",
  },
  "/services": {
    title: "Services & Solutions | VIP StudioS",
    description:
      "High-retention editing, commercial brand films, viral reels, visual podcasts, and complete omnichannel growth suites.",
  },
  "/work": {
    title: "Selected Work & Portfolio | VIP StudioS",
    description:
      "Explore commercial brand films, high-retention vertical reels, podcasts, and digital campaigns crafted by VIP StudioS.",
  },
  "/about": {
    title: "About the Studio | VIP StudioS",
    description:
      "Meet VIP StudioS: a creative video editing and digital growth partner turning content into revenue.",
  },
  "/contact": {
    title: "Start a Project | VIP StudioS",
    description:
      "Book a free strategy call or submit your project brief directly to the VIP StudioS team.",
  },
};

function applyRouteMetadata(pathname, project, service, pendingProject = false) {
  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  const metadata = pendingProject
    ? {
        title: "Selected Project — VIP StudioS",
        description: "Explore selected video and content work from VIP StudioS.",
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
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  useEffect(() => {
    function onOpenCalendly() {
      setCalendlyOpen(true);
    }
    window.addEventListener("open-calendly", onOpenCalendly);
    return () => window.removeEventListener("open-calendly", onOpenCalendly);
  }, []);

  return (
    <>
      <ScrollProgressBar />
      <CustomCursor />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader onOpenCalendly={() => setCalendlyOpen(true)} />
      <RouteMetadata />
      <ConversionEvents />
      <main id="main-content" tabIndex="-1">
        <Outlet context={{ openCalendly: () => setCalendlyOpen(true) }} />
      </main>
      <WhatsAppButton />
      <MobilePersistentCTA />
      <SiteFooter />
      <ExitIntentModal />
      <CalendlyModal isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </>
  );
}
