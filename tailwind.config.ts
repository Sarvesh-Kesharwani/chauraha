import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        asphalt: {
          50: "#F4F6F8",
          100: "#E5E9EE",
          200: "#C8D0DA",
          500: "#4B5563",
          700: "#1F2937",
          900: "#0B1220",
        },
        marigold: {
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        paan: {
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
        },
        auto: {
          400: "#FDE68A",
          500: "#FACC15",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Manrope", "Inter", "sans-serif"],
      },
      boxShadow: {
        pop: "0 4px 0 0 rgba(0,0,0,0.15), 0 8px 24px -8px rgba(0,0,0,0.25)",
        tile: "0 2px 0 0 rgba(0,0,0,0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        pulseJoin: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(16,185,129,0.6)" },
          "50%": { boxShadow: "0 0 0 12px rgba(16,185,129,0)" },
        },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        pulseJoin: "pulseJoin 900ms ease-out",
        shake: "shake 260ms ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
