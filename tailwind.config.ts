import { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}"],
  darkMode: "class", // IMPORTANT — enable class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
