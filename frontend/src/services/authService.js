import { axiosInstance } from "./api";

// Signup
export const signupService = (userData) =>
  axiosInstance.post("/auth/signup", userData);

// Login
export const loginService = (email, password) =>
  axiosInstance.post("/auth/login", { email, password });

// Forgot Password
export const forgotPasswordService = (email) =>
  axiosInstance.post("/auth/forgotPassword", { email });

// Reset Password
export const resetPasswordService = (token, data) =>
  axiosInstance.patch(`/auth/resetPassword/${token}`, data);

// Update Password
export const updatePasswordService = (data) =>
  axiosInstance.patch("/auth/updateMyPassword", data);

// Logout
export const logoutService = () => axiosInstance.post("/auth/logout");

// Check Auth
export const getMeService = () => axiosInstance.get("/users/me");
