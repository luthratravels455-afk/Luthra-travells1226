import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { CMSProvider } from './contexts/CMSContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Home } from './pages/Home';
import { Fleet } from './pages/Fleet';
import { FleetDetail } from './pages/FleetDetail';
import { AirportTransfers } from './pages/AirportTransfers';
import { OutstationTaxi } from './pages/OutstationTaxi';
import { LocalTaxi } from './pages/LocalTaxi';
import { CorporateTravel } from './pages/CorporateTravel';
import { About } from './pages/About';
import { Blog } from './pages/Blog';
import { BlogPostView } from './pages/BlogPost';
import { Gallery } from './pages/Gallery';
import { FAQPage } from './pages/FAQPage';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFound } from './pages/NotFound';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CMSProvider>
          <ToastProvider>
            <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-between selection:bg-[#C9A227] selection:text-zinc-950">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/fleet" element={<Fleet />} />
                  <Route path="/fleet/:id" element={<FleetDetail />} />
                  <Route path="/airport-transfers" element={<AirportTransfers />} />
                  <Route path="/outstation-taxi" element={<OutstationTaxi />} />
                  <Route path="/local-taxi" element={<LocalTaxi />} />
                  <Route path="/corporate-travel" element={<CorporateTravel />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPostView />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-conditions" element={<TermsConditions />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin/login" element={<Login />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </ToastProvider>
        </CMSProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
