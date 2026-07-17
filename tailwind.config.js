/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        muted: "#6B7280",
        line: "#E5E7EB",
        canvas: "#FFFFFF",
        panel: "#FAFAF9",
        sun: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#EA580C",
          700: "#C2410C",
        },
        good: "#16A34A",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(17,24,39,0.04), 0 8px 24px rgba(17,24,39,0.06)",
        cardHover: "0 2px 4px rgba(17,24,39,0.06), 0 16px 32px rgba(17,24,39,0.10)",
      },
      backgroundImage: {
        "sun-gradient": "linear-gradient(135deg, #FBBF24 0%, #F59E0B 45%, #EA580C 100%)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSlow: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease-out both",
        pulseSlow: "pulseSlow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}

