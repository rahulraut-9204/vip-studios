import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { getProjectBySlug } from "../data/projects.js";
import SiteFooter from "./SiteFooter.jsx";
import SiteHeader from "./SiteHeader.jsx";
import WhatsAppButton from "./WhatsAppButton.jsx";

const siteOrigin = "https://vip-studios.pages.dev";

const pageMetadata = {
  "/": {
    title: "VIP StudioS — Social, shot & edited",
    description:
      "Social-media strategy, account management, video shoots, and professional editing from VIP StudioS. Explore illustrative concepts and start a project.",
  },
  "/services": {
    title: "Social & video services — VIP StudioS",
    description:
      "Social-media strategy, content planning and publishing, video shoots, and professional editing from VIP StudioS.",
  },
  "/work": {
    title: "Portfolio concepts — VIP StudioS",
    description:
      "Explore illustrative social-media and video concept studies from VIP StudioS. Concept imagery is not commissioned client work.",
  },
  "/about": {
    title: "The studio — VIP StudioS",
    description:
      "Learn about the connected social-media and video approach at VIP StudioS: planning, shoots, publishing, and professional editing.",
  },
  "/contact": {
    title: "Start a conversation — VIP StudioS",
    description:
      "Share your social-media or video brief with VIP StudioS by email or WhatsApp.",
  },
};

function RouteMetadata() {
  const { pathname, hash } = useLocation();
  const previousPathname = useRef(pathname);

  useEffect(() => {
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
    const project = slug ? getProjectBySlug(slug) : null;
    const metadata =
      project
        ? {
            title: `${project.title} — Concept project — VIP StudioS`,
            description: `${project.summary} This is illustrative concept work, not a commissioned client project.`,
          }
        : pageMetadata[pathname.replace(/\/$/, "") || "/"] ?? {
            title: "Page not found — VIP StudioS",
            description: "This page is not available. Explore the VIP StudioS portfolio.",
          };

    const canonicalUrl = new URL(pathname, siteOrigin).href;
    const isNotFound = !project && !pageMetadata[pathname.replace(/\/$/, "") || "/"];
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
  }, [hash, pathname]);

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
      <main id="main-content" tabIndex="-1">
        <Outlet />
      </main>
      <WhatsAppButton />
      <SiteFooter />
    </>
  );
}
