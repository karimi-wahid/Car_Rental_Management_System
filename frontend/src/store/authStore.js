import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const authStore = (set) => ({
  // State
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  // Signup
  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/auth/signup", userData);
      const { data } = response.data;

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed";
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      const { data } = response.data;

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/auth/forgotPassword", {
        email,
      });
      set({
        isLoading: false,
        error: null,
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send reset email";
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Reset Password
  resetPassword: async (token, password, passwordConfirm) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch(
        `/auth/resetPassword/${token}`,
        {
          password,
          passwordConfirm,
        },
      );
      const { data } = response.data;

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to reset password";
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Update Password (Authenticated)
  updatePassword: async (passwordCurrent, password, passwordConfirm) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch("/auth/updateMyPassword", {
        passwordCurrent,
        password,
        passwordConfirm,
      });
      const { data } = response.data;

      set({
        user: data.user,
        isLoading: false,
        error: null,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update password";
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Check if user is authenticated (on app load)
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/users/me");
      const { user } = response.data.data;

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      console.log(error);
      return false;
    }
  },

  // Get current user data
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get("/users/me");
      const { user } = response.data.data;
      set({ user });
      return user;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  },
});

const useAuthStore = create(authStore);

export default useAuthStore;
