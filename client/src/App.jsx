import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

const LandingPage        = lazy(() => import("./pages/LandingPage"));
const LoginPage          = lazy(() => import("./pages/LoginPage"));
const RegisterPage       = lazy(() => import("./pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage  = lazy(() => import("./pages/ResetPasswordPage"));
const DashboardPage      = lazy(() => import("./pages/DashboardPage"));
const ProfilePage        = lazy(() => import("./pages/ProfilePage"));
const MatchesPage        = lazy(() => import("./pages/MatchesPage"));
const RequestsPage       = lazy(() => import("./pages/RequestsPage"));
const ChatPage           = lazy(() => import("./pages/ChatPage"));
const NotificationsPage  = lazy(() => import("./pages/NotificationsPage"));
const AdminPage          = lazy(() => import("./pages/AdminPage"));
const NotFoundPage       = lazy(() => import("./pages/NotFoundPage"));

const Loader = () => (
  <div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "var(--on-surface-variant)" }}>
      <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", animation: "spin 1s linear infinite" }}>progress_activity</span>
      <span style={{ fontSize: "0.9rem" }}>Loading…</span>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const App = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {/* ── Public routes ── */}
      <Route path="/"                    element={<LandingPage />} />
      <Route path="/login"               element={<LoginPage />} />
      <Route path="/register"            element={<RegisterPage />} />
      <Route path="/forgot-password"     element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* ── Protected routes ── */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard"      element={<DashboardPage />} />
        <Route path="/profile"        element={<ProfilePage />} />
        <Route path="/matches"        element={<MatchesPage />} />
        <Route path="/requests"       element={<RequestsPage />} />
        <Route path="/chat"           element={<ChatPage />} />
        <Route path="/notifications"  element={<NotificationsPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default App;
