import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isLoggingOut: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });

            get().connectSocket();     
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

            get().connectSocket();
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

            get().connectSocket();
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
            get().disconnectSocket();
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred during logout";
            toast.error(errorMessage);
        }
        finally {
            set({ isLoggingOut: false });
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/updateProfilePic", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully!");
        } 
        catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred during profile upload";
            toast.error(errorMessage);
        }
        finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const {authUser} = get();
        if (!authUser || get().socket?.connected)
            return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected)
            get().socket.disconnect();
    }
}));