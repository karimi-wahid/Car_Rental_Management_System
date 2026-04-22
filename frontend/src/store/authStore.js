import { create } from "zustand";
import {
  signupService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
  updatePasswordService,
  logoutService,
  getMeService,
} from "@/services/authService";

const authStore = (set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await signupService(userData);
      const { data } = res.data;

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await loginService(email, password);
      const { data } = res.data;

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await forgotPasswordService(email);
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to send reset email";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  resetPassword: async (token, password, passwordConfirm) => {
    set({ isLoading: true, error: null });
    try {
      const res = await resetPasswordService(token, {
        password,
        passwordConfirm,
      });

      const { data } = res.data;

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "Failed to reset password";

      set({
        isLoading: false,
        error: message,
        tokenExpired: status === 400,
      });

      return { success: false, error: message };
    }
  },

  updatePassword: async (passwordCurrent, password, passwordConfirm) => {
    set({ isLoading: true, error: null });
    try {
      const res = await updatePasswordService({
        passwordCurrent,
        password,
        passwordConfirm,
      });

      const { data } = res.data;

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update password";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  logout: async () => {
    try {
      await logoutService();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const res = await getMeService();
      const { data } = res.data;

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
});

export const useAuthStore = create(authStore);
