import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { trackEvent } from "../data/analytics.js";
import { getProjectBySlug } from "../data/projects.js";
import { serviceOfferings } from "../data/services.js";
import { supabase } from "../lib/supabase.js";
import SiteFooter from "./SiteFooter.jsx";
import SiteHeader from "./SiteHeader.jsx";
import WhatsAppButton from "./WhatsAppButton.jsx";

const siteOrigin = "https://vip-studios.pages.dev";

const pageMetadata = {
  "/": {
    title: "Content, Social Media & Video Production | VIP StudioS",
    description:
      "Social media management, video production, editing, podcasts and YouTube support for businesses. Build your digital content journey with VIP StudioS.",
  },
  "/services": {
    title: "Social Media, Video, Podcast & YouTube Services | VIP StudioS",
    description:
      "Explore social media management, video production and editing, podcast production, YouTube management, content creation and brand content.",
  },
  "/work": {
    title: "Portfolio concepts — VIP StudioS",
    description:
      "Explore illustrative social-media and video concept studies from VIP StudioS. Concept imagery is not commissioned client work.",
  },
  "/about": {
    title: "The studio — VIP StudioS",
    description:
      "Meet VIP StudioS: a creative and digital team connecting social media, content, video production and digital execution for businesses.",
  },
  "/process": {
    title: "Our Process — VIP StudioS",
    description:
      "See how VIP StudioS takes a project from discovery and strategy through content creation, editing, publishing and review.",
  },
  "/contact": {
    title: "Start a conversation — VIP StudioS",
    description:
      "Share your social-media or video brief with VIP StudioS by email or WhatsApp.",
  },
};

function applyRouteMetadata(pathname, project, service, pendingProject = false) {
  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  const metadata = pendingProject
    ? {
        title: "Selected project — VIP StudioS",
        description: "Explore selected video and content work from VIP StudioS.",
      }
    : project
    ? {
        title: project.concept
          ? `${project.title} — Concept project — VIP StudioS`
          : `${project.title} — VIP StudioS`,
        description: project.concept
          ? `${project.summary} This is illustrative concept work, not a commissioned client project.`
          : project.summary,
      }
    : service
      ? {
          title: `${service.title} — VIP StudioS`,
          description: `${service.description} Working with clients across India.`,
        }
      : pageMetadata[normalizedPath] ?? {
          title: "Page not found — VIP StudioS",
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

  const breadcrumbScriptId = "route-breadcrumb-schema";
  let breadcrumbScript = document.getElementById(breadcrumbScriptId);
  if (normalizedPath === "/") {
    breadcrumbScript?.remove();
  } else {
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement("script");
      breadcrumbScript.id = breadcrumbScriptId;
      breadcrumbScript.type = "application/ld+json";
      document.head.append(breadcrumbScript);
    }
    const routeLabel =
      project?.title ||
      service?.title ||
      ({
        "/services": "Services",
        "/work": "Our Work",
        "/process": "Process",
        "/about": "About",
        "/contact": "Contact",
      }[normalizedPath] || "Page");
    const category = normalizedPath.startsWith("/services/")
      ? "Services"
      : normalizedPath.startsWith("/work/")
        ? "Our Work"
        : "";
    const crumbs = [{ name: "Home", path: "/" }];
    if (category) {
      crumbs.push({
        name: category,
        path: category === "Services" ? "/services" : "/work",
      });
    }
    crumbs.push({ name: routeLabel, path: pathname });
    breadcrumbScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: new URL(crumb.path, siteOrigin).href,
      })),
    });
  }

  return metadata;
}

function RouteMetadata() {
  const { pathname, hash } = useLocation();
  const previousPathname = useRef(pathname);
  const lastTrackedPath = useRef("");

  useEffect(() => {
    let isActive = true;
    if (previousPathname.current !== pathname) {
      document.getElementById("main-content")?.focus({ preventScroll: true });
      previousPathname.current = pathname;
    }

    if (hash) {
      window.requestAnimationFrame(() => {
        const target = document.getElementById(hash.slice(1));
        if (target) {
          target.scrollIntoView();
        } else {
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    const slug = pathname.startsWith("/work/")
      ? pathname.split("/").at(-1)
      : "";
    const staticProject = slug ? getProjectBySlug(slug) : null;
    const serviceSlug = pathname.startsWith("/services/")
      ? pathname.split("/").at(-1)
      : "";
    const service = serviceSlug
      ? serviceOfferings.find((item) => item.slug === serviceSlug)
      : null;
    const pendingProject = !staticProject && Boolean(slug && supabase);
    const metadata = applyRouteMetadata(
      pathname,
      staticProject,
      service,
      pendingProject,
    );
    if (pendingProject) {
      supabase
        .from("projects")
        .select("title, summary, is_concept")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle()
        .then(({ data, error }) => {
          if (!isActive) return;
          if (error) {
            applyRouteMetadata(pathname, null, null);
            return;
          }
          if (data) {
            applyRouteMetadata(
              pathname,
              { ...data, concept: data.is_concept },
              null,
            );
          } else {
            applyRouteMetadata(pathname, null, null);
          }
        })
        .catch(() => {
          if (isActive) applyRouteMetadata(pathname, null, null);
        });
    }
    if (lastTrackedPath.current !== pathname) {
      trackEvent("page_view", {
        page_path: pathname,
        page_title: metadata.title,
      });
      if (service) {
        trackEvent("service_page_view", { service_name: service.title });
      }
      lastTrackedPath.current = pathname;
    }
    return () => {
      isActive = false;
    };
  }, [hash, pathname]);

  return null;
}

function ConversionEvents() {
  useEffect(() => {
    function handleClick(event) {
      const target = event.target instanceof Element ? event.target.closest("a, button") : null;
      if (!target) return;
      const href = target.getAttribute("href") || "";
      const label = target.getAttribute("aria-label") || target.textContent.trim().replace(/\s+/g, " ");
      if (href.startsWith("https://wa.me/")) {
        const placement = target.classList.contains("whatsapp-float")
          ? "floating_button"
          : target.classList.contains("header-whatsapp")
            ? "mobile_navigation"
            : "contact_or_footer";
        trackEvent("whatsapp_click", { link_text: label, placement });
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
      <SiteFooter />
    </>
  );
}
