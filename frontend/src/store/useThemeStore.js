import { create } from "zustand";

const DEFAULT_THEME = "dark";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || DEFAULT_THEME,
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme);
        set({ theme });
    }
}));