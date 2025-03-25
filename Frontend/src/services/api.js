export const BASE_URL = "http://localhost:8081/";

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || "An error occurred");
    } catch (e) {
      throw new Error(errorText || "An error occurred");
    }
  }

  try {
    return await response.json();
  } catch (e) {
    return { success: true };
  }
};

// Helper function to handle network errors
const handleNetworkError = (error) => {
  if (!window.navigator.onLine) {
    throw new Error("No internet connection. Please check your network.");
  }
  if (error.message === "Failed to fetch") {
    throw new Error(
      "Unable to connect to the server. Please ensure the backend is running."
    );
  }
  throw error;
};

// Registration endpoints
export const registerUser = async (formData) => {
  const endpoint =
    formData.role === "SERVICE_PROVIDER"
      ? "auth/service-provider/register"
      : "auth/consumer/register";

  // Add logging to debug the request
  console.log("Registration request:", {
    url: `${BASE_URL}${endpoint}`,
    data: formData,
  });

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: formData.role || "CONSUMER", // Default to CONSUMER if not specified
      termsAccepted: formData.termsAccepted,
    }),
  });

  // Add logging to debug the response
  console.log("Registration response status:", response.status);

  // First check if the response is ok
  if (!response.ok) {
    const errorText = await response.text();
    console.log("Registration error:", errorText);
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || "Registration failed");
    } catch (e) {
      throw new Error(errorText || "Registration failed");
    }
  }

  // Try to parse JSON response
  try {
    const data = await response.json();
    console.log("Registration success:", data);
    return data;
  } catch (e) {
    // If response is not JSON but status was ok, consider it successful
    return { success: true };
  }
};

// Login endpoints
export const loginUser = async (formData) => {
  try {
    const endpoint =
      formData.role === "SERVICE_PROVIDER"
        ? "/service-provider/login"
        : "/consumer/login";

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await handleResponse(response);

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", formData.role);
    }
    return data;
  } catch (error) {
    handleNetworkError(error);
  }
};

// Logout function
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
};

// Password reset request
export const requestPasswordReset = async (email) => {
  const response = await fetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Password reset request failed");
  }

  return await response.json();
};

// Reset password with token
export const resetPassword = async (token, newPassword) => {
  const response = await fetch(`${BASE_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Password reset failed");
  }

  return await response.json();
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const endpoint =
      userRole === "SERVICE_PROVIDER"
        ? "/service-provider/profile"
        : "/consumer/profile";

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return handleResponse(response);
  } catch (error) {
    handleNetworkError(error);
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const endpoint =
    userRole === "SERVICE_PROVIDER"
      ? "/service-provider/profile"
      : "/consumer/profile";

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update profile");
  }

  return await response.json();
};

// Verify auth token
export const verifyToken = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${BASE_URL}/verify-token`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    throw new Error("Invalid or expired token");
  }

  return await response.json();
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Helper function to get user role
export const getUserRole = () => {
  return localStorage.getItem("userRole");
};

// Helper function to get auth header
export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Test connection to backend
export const testConnection = async () => {
  try {
    const response = await fetch(`${BASE_URL}actuator/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Backend connection test failed:", error);
    return false;
  }
};
