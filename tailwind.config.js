/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c1d2ff",
          300: "#9ab5ff",
          400: "#6b8eff",
          500: "#3d62f5",
          600: "#2541e8",
          700: "#1c31cc",
          800: "#1a2ba6",
          900: "#1b2a83",
          950: "#111b54",
        },
        slate: {
          925: "#0d1526",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
