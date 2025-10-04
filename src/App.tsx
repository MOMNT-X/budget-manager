import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import Layout from "./pages/Layout";
import ProfilePage from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Main Layout Route */}
        <Route path="/layout" element={<Layout />} />
      </Routes>
    </Router>
  );
}