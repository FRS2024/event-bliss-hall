
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Wedding theme colors
        blush: {
          50: "#fff0f3",
          100: "#ffe5e9",
          200: "#ffd6de",
          300: "#ffb8c6",
          400: "#ff8da3",
          500: "#ff5c7c",
          600: "#ea3158",
          700: "#d91a46",
          800: "#b01742",
          900: "#931941",
        },
        champagne: {
          50: "#fefbf3",
          100: "#fef7e6",
          200: "#fdeecc",
          300: "#fbde9f",
          400: "#f8c76a",
          500: "#f5ad3e",
          600: "#e58e21",
          700: "#c26e1c",
          800: "#9b571c",
          900: "#7d491b",
        },
        ivory: {
          50: "#fffef8",
          100: "#fdfdf0",
          200: "#fbfbe0",
          300: "#f7f6c4",
          400: "#f1ef99",
          500: "#eae46d",
          600: "#dac847",
          700: "#b5a334",
          800: "#92812d",
          900: "#786a28",
        },
        gold: {
          50: "#fbf9f2",
          100: "#f8f2dd",
          200: "#f2e4be",
          300: "#e8ce8c",
          400: "#ddb35b",
          500: "#d49839",
          600: "#c7822f",
          700: "#a56429",
          800: "#85512b",
          900: "#6c4326",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["Georgia", "ui-serif"],
        script: ["'Playfair Display'", "serif"],
        display: ["'Great Vibes'", "cursive"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-in": "slide-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss-rtl"),
  ],
} satisfies Config;
