import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
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

export default function App() {
  return (
    <Suspense fallback={<div aria-live="polite" className="studio-route-loading">Loading page…</div>}>
      <Routes>
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
  );
}
