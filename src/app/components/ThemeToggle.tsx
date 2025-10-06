"use client";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded-md bg-gray-300 dark:bg-gray-700"
    >
      {theme === "light" ? "🌞" : "🌙"}
    </button>
  );
}
