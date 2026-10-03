import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { getProjectBySlug } from "../data/projects.js";
import SiteFooter from "./SiteFooter.jsx";
import SiteHeader from "./SiteHeader.jsx";

const pageMetadata = {
  "/": {
    title: "VIP StudioS — Social, shot & edited",
    description:
      "Social-media strategy, content planning, publishing, account management, video shoots, and professional editing.",
  },
  "/services": {
    title: "Social & video services — VIP StudioS",
    description:
      "Explore social-media management, content planning and publishing, video shoots, and professional editing.",
  },
  "/work": {
    title: "Video concepts — VIP StudioS",
    description:
      "Illustrative concept directions for the VIP StudioS portfolio. Replace with verified studio work before launch.",
  },
  "/about": {
    title: "The studio — VIP StudioS",
    description:
      "VIP StudioS manages social-media accounts and creates video through shoots and professional editing. Studio profile details are to be confirmed.",
  },
  "/contact": {
    title: "Start a conversation — VIP StudioS",
    description:
      "Share a project idea with VIP StudioS. Enquiry email and WhatsApp details are not configured yet.",
  },
};

function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
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
        : pageMetadata[pathname] ?? {
            title: "Page not found — VIP StudioS",
            description: "This page is not available. Explore the VIP StudioS portfolio.",
          };

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
  }, [pathname]);

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
      <main id="main-content">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
