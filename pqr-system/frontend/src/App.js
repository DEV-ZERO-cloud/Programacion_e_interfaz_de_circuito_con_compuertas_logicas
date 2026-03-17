import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import './index.css';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreatePQRPage from './pages/user/CreatePQRPage';
import MyPQRsPage from './pages/user/MyPQRsPage';
import AssignedPQRsPage from './pages/supervisor/AssignedPQRsPage';
import AllPQRsPage from './pages/operator/AllPQRsPage';
import UsersPage from './pages/operator/UsersPage';

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-content">
          <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return <AppShell>{children}</AppShell>;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/crear-pqr" element={<ProtectedRoute roles={['user']}><CreatePQRPage /></ProtectedRoute>} />
      <Route path="/mis-pqrs" element={<ProtectedRoute roles={['user']}><MyPQRsPage /></ProtectedRoute>} />
      <Route path="/pqrs-asignadas" element={<ProtectedRoute roles={['supervisor']}><AssignedPQRsPage /></ProtectedRoute>} />
      <Route path="/todas-pqrs" element={<ProtectedRoute roles={['operator']}><AllPQRsPage /></ProtectedRoute>} />
      <Route path="/usuarios" element={<ProtectedRoute roles={['operator']}><UsersPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              borderRadius: 10,
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            },
            success: { iconTheme: { primary: '#10b981', secondary: 'white' } },
            error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
