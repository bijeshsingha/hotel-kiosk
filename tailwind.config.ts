import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F2937",
        secondary: "#D97757",
        background: "#FAFAFA",
        surface: "#FFFFFF",
        "text-main": "#111827",
        "text-muted": "#6B7280",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
