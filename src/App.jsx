import React, { lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";
import SiteShell from "./components/SiteShell.jsx";
const AboutPage = lazy(() => import("./pages/AboutPage.jsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.jsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.jsx"));
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));
const ProjectPage = lazy(() => import("./pages/ProjectPage.jsx"));
const ProcessPage = lazy(() => import("./pages/ProcessPage.jsx"));
const ServicesPage = lazy(() => import("./pages/ServicesPage.jsx"));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage.jsx"));
const WorkPage = lazy(() => import("./pages/WorkPage.jsx"));

function PageLoading() {
  return (
    <div aria-live="polite" className="studio-route-loading">
      <span>Loading page…</span>
    </div>
  );
}

class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("VIP StudioS route failed to load", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="route-error page-gutter">
        <p className="studio-location">VIP STUDIOS · PAGE ERROR</p>
        <h1>That frame<br /><span>didn&apos;t load.</span></h1>
        <p>
          The page could not be loaded. Refresh and try again, or return to the
          work library.
        </p>
        <div className="route-error-actions">
          <button className="button button-gold" onClick={() => window.location.reload()} type="button">
            Refresh page
          </button>
          <Link className="button button-outline" to="/work">
            Explore the work
          </Link>
        </div>
      </main>
    );
  }
}

export default function App() {
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/studio/admin" element={<AdminPage />} />
          <Route element={<SiteShell />}>
            <Route index element={<HomePage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/:serviceSlug" element={<ServiceDetailPage />} />
            <Route path="work" element={<WorkPage />} />
            <Route path="work/:slug" element={<ProjectPage />} />
            <Route path="process" element={<ProcessPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </RouteErrorBoundary>
  );
}
