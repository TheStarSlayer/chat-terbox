import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isLoggingOut: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });     
        } 
        catch (error) {
            console.log("Error in checkAuth:", error);
            set( { authUser: null });
        }
        finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred during signup";
            toast.error(errorMessage);
        }
        finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("User logged in successfully!");
        } 
        catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred during login";
            toast.error(errorMessage);
        }
        finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully!");
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred during logout";
            toast.error(errorMessage);
        }
        finally {
            set({ isLoggingOut: false });
        }
    }
}));