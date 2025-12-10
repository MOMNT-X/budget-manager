import { Navigate } from "react-router-dom";

// Clear all user data from localStorage and sessionStorage
export const clearAllUserData = () => {
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
  localStorage.removeItem("accountData");
  localStorage.removeItem("hasSeenOnboardingTour");
  localStorage.removeItem("isNewUser");

  // Clear session storage
  sessionStorage.clear();
};

// Redirect to login page and clear user data
// This function is used when authentication expires or user is unauthorized
export const redirectToLogin = (message?: string) => {
  // Clear all user data
  clearAllUserData();

  // Show a toast notification if message is provided
  if (message && typeof window !== "undefined") {
    // Import toast dynamically to avoid circular dependencies
    import("sonner").then(({ toast }) => {
      toast.error(message || "Your session has expired. Please login again.");
    });
  }

  // Redirect to login page
  // Use window.location.href to force a full page reload and clear any cached state
  if (typeof window !== "undefined") {
    // Only redirect if we're not already on the login page
    if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
      window.location.href = "/login";
    }
  }
};

// utils/auth.ts or any shared file
export const logoutUser = () => {
  clearAllUserData();
  // Redirect to login page
  return <Navigate to="/login" />;
};