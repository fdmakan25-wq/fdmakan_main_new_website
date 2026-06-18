import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        /* Reference: professional logistics/consultancy scale */
        "display-2": ["3.5rem", { lineHeight: "1.12", letterSpacing: "-0.02em", fontWeight: "800" }],
        "display-1": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.015em", fontWeight: "800" }],
        "heading-1": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "heading-2": ["1.75rem", { lineHeight: "1.25", fontWeight: "700" }],
        "heading-3": ["1.5rem", { lineHeight: "1.35", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "label-sm": ["0.875rem", { lineHeight: "1.4", letterSpacing: "0.06em", fontWeight: "700" }],
        "caption": ["0.8125rem", { lineHeight: "1.45", fontWeight: "400" }],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: "#0F172A",
        "body-text": "#4B5563",
        "accent-orange": "#FF5722",
        "surface-muted": "#F3F4F6",
        gray: {
          ...colors.gray,
          900: "#0F172A",
          800: "#1E293B",
          700: "#374151",
          600: "#4B5563",
          500: "#6B7280",
          100: "#F3F4F6",
        },
        'navy-blue': '#0F172A',
        'brand-teal': '#2fb9a2',
        'brand-red': '#FF5722',
        'brand-teal-light': '#4fc5b0',
        'brand-teal-dark': '#259a87',
        'brand-red-light': '#ff7043',
        'brand-red-dark': '#e64a19',
      },
      animation: {
        'spin-slow': 'spin 1s linear infinite',
        'gradient': 'gradient 3s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'soft-md': '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 20px 60px -15px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(255, 87, 34, 0.25)',
        'accent': '0 8px 24px -4px rgba(255, 87, 34, 0.35)',
      },
    },
  },
  plugins: [],
};
export default config;
