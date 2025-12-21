// ============================================
// StackUp - Main App Component
// ============================================
// Sets up routing, context providers, and layout

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar, Footer, ProtectedRoute } from './components/layout';
import {
  LandingPage,
  LoginPage,
  SignupPage,
  WelcomePage,
  DashboardPage,
  BrowsePage,
  CreateOpeningPage,
  OpeningDetailsPage,
  TeamPage,
  ChatPage
} from './pages';
import './index.css';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <SocketProvider>
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '12px 16px',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />

            <Routes>
              {/* Public routes with Navbar/Footer */}
              <Route
                path="/"
                element={
                  <>
                    <Navbar />
                    <LandingPage />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/browse"
                element={
                  <>
                    <Navbar />
                    <BrowsePage />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/openings/:id"
                element={
                  <>
                    <Navbar />
                    <OpeningDetailsPage />
                    <Footer />
                  </>
                }
              />

              {/* Auth routes (no Navbar/Footer) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected routes */}
              <Route
                path="/welcome"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <WelcomePage />
                    <Footer />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <DashboardPage />
                    <Footer />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/openings/new"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <CreateOpeningPage />
                    <Footer />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/teams/:id"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <TeamPage />
                    <Footer />
                  </ProtectedRoute>
                }
              />

              {/* Chat route (no Navbar/Footer - fullscreen) */}
              <Route
                path="/teams/:id/chat"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
