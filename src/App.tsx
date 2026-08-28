import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import AuthPage from "@/pages/Auth";
import Alerts from "@/pages/Alerts";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import Settings from "@/pages/Settings";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Convenience aliases: the auth page renders both flows as tabs. */}
      <Route path="/sign-in" element={<Navigate to="/auth" replace />} />
      <Route path="/sign-up" element={<Navigate to="/auth" replace />} />
      {/* Alias for the authenticated app area (defaults to fare watches). */}
      <Route path="/app" element={<Navigate to="/dashboard" replace />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
