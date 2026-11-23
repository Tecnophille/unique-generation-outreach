import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ContentProvider } from './cms/ContentContext';
import ErrorBoundary from './components/ErrorBoundary';
import DocumentMeta from './components/DocumentMeta';
import RedirectHandler from './components/RedirectHandler';
import HomePage from './pages/HomePage';
import SectionPage from './pages/SectionPage';
import NotFoundPage from './pages/NotFoundPage';

const AdminApp = lazy(() => import('./admin/AdminApp'));

export default function App() {
  return (
    <ErrorBoundary>
      <ContentProvider>
        <BrowserRouter>
          <DocumentMeta />
          <RedirectHandler />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<SectionPage pageKey="about" />} />
            <Route path="/pillars" element={<SectionPage pageKey="pillars" />} />
            <Route path="/gatherings" element={<SectionPage pageKey="gatherings" />} />
            <Route path="/reflections" element={<SectionPage pageKey="reflections" />} />
            <Route path="/contact" element={<SectionPage pageKey="contact" />} />
            <Route path="/leadership" element={<SectionPage pageKey="leadership" />} />
            <Route path="/faq" element={<SectionPage pageKey="faq" />} />
            <Route path="/events" element={<SectionPage pageKey="events" />} />
            <Route path="/videos" element={<SectionPage pageKey="videos" />} />
            <Route path="/resources" element={<SectionPage pageKey="resources" />} />
            <Route
              path="/admin/*"
              element={
                <Suspense fallback={<div className="boot-screen">Loading CMS…</div>}>
                  <AdminApp />
                </Suspense>
              }
            />
            <Route path="/:pageKey" element={<SectionPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ContentProvider>
    </ErrorBoundary>
  );
}
