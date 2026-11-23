import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ContentProvider } from './cms/ContentContext';
import HomePage from './pages/HomePage';
import SectionPage from './pages/SectionPage';
import AdminApp from './admin/AdminApp';

export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<SectionPage pageKey="about" />} />
          <Route path="/pillars" element={<SectionPage pageKey="pillars" />} />
          <Route path="/gatherings" element={<SectionPage pageKey="gatherings" />} />
          <Route path="/reflections" element={<SectionPage pageKey="reflections" />} />
          <Route path="/contact" element={<SectionPage pageKey="contact" />} />
          <Route path="/leadership" element={<SectionPage pageKey="leadership" />} />
          <Route path="/faq" element={<SectionPage pageKey="faq" />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}
