import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas publicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Dashboard — funciona com ou sem login */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/editor" element={<DashboardPage />} />
            <Route path="/editor/:id" element={<DashboardPage />} />
          </Route>

          {/* Admin — protegido */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/*" element={<AdminPage />} />
          </Route>

          {/* Redirects legados */}
          <Route path="/projects" element={<Navigate to="/" replace />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />

          {/* Pagina 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
