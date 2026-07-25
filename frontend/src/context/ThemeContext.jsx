import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext();

const lightTheme = {
    mode: "light",

    colors: {
        page: "linear-gradient(180deg,#F8FAFD 0%,#EEF3FB 100%)",
        card: "#FFFFFF",
        cardSecondary: "#FAFBFE",
        border: "#E6ECF5",
        text: "#1F2937",
        subText: "#6B7280",
        primary: "#3446B5",
        sidebar: "#FFFFFF",
        input: "#FFFFFF",
        shadow: "0 15px 40px rgba(15,23,42,.06)"
    }
};

const darkTheme = {
    mode: "dark",

    colors: {
        page: "#0F172A",
        card: "#182235",
        cardSecondary: "#111827",
        border: "#2B3955",
        text: "#F9FAFB",
        subText: "#94A3B8",
        primary: "#536DFE",
        sidebar: "#111827",
        input: "#1E293B",
        shadow: "0 20px 45px rgba(0,0,0,.45)"
    }
};

export function ThemeProvider({ children }) {
    const [mode, setMode] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {
        localStorage.setItem("theme", mode);
    }, [mode]);

    const toggleTheme = () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
    };

    const value = useMemo(() => {
        return {
            mode,
            toggleTheme,
            theme: mode === "light" ? lightTheme : darkTheme,
        };
    }, [mode]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}