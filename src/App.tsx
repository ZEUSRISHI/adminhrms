import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Students } from "./pages/Students";
import { Streams } from "./pages/Streams";
import { Analytics } from "./pages/Analytics";
import { Badges } from "./pages/Badges";
import { Milestones } from "./pages/Milestones";
import { CategoryAnalytics } from "./pages/CategoryAnalytics";
import { Login } from "./pages/Login";
import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>

            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="streams" element={<Streams />} />
              <Route path="category-analytics" element={<CategoryAnalytics />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="badges" element={<Badges />} />
              <Route path="milestones" element={<Milestones />} />
            </Route>

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}