import { Navigate } from "react-router-dom";

// utils/auth.ts or any shared file
export const logoutUser = () => {
  // Clear all token variations
  localStorage.removeItem("accessToken");
  localStorage.removeItem("access_token");
  localStorage.removeItem("token");

  // Clear user identity data
  localStorage.removeItem("userId");
  localStorage.removeItem("email");
  localStorage.removeItem("username");
  localStorage.removeItem("user");

  // Clear app-specific data
  localStorage.removeItem("userProfile");
  localStorage.removeItem("bankData");
  localStorage.removeItem("transactions");
  localStorage.removeItem("budget");

  // Clear session storage
  sessionStorage.clear();

  // Optional: Clear cookies if used
  // document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Redirect to login page
  return <Navigate to="/login" />;
};