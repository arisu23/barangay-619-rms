import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Pages
import LoginPage from "../components/LoginPage";
import LoadingPage from "../components/LoadingPage";
import Dashboard from "../components/Dashboard";
import ResidentRecords from "../components/ResidentRecords";
import Reports from "../components/Reports";
import AuditTrail from "../components/AuditTrail";
import BackupRestore from "../components/BackupRestore";
import Archive from "../components/Archive";
import Settings from "../components/Settings";

// Protected Route wrapper — redirects to /login if not authenticated
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  adminOnly?: boolean;
}> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== "Admin")
    return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LoadingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes — any authenticated user */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/residents"
        element={
          <ProtectedRoute>
            <ResidentRecords />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/archive"
        element={
          <ProtectedRoute>
            <Archive />
          </ProtectedRoute>
        }
      />

      {/* Protected routes — Admin only */}
      <Route
        path="/audit-trail"
        element={
          <ProtectedRoute adminOnly>
            <AuditTrail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/backup"
        element={
          <ProtectedRoute adminOnly>
            <BackupRestore />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute adminOnly>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Catch-all: redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
