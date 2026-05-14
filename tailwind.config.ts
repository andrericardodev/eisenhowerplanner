import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1f2933",
        paper: "#f7f6f2",
        cedar: "#7f5539",
        moss: "#52796f",
        coral: "#d65a31",
        graphite: "#343a40",
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        "card-foreground": "rgb(var(--card-foreground) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-foreground": "rgb(var(--primary-foreground) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        "secondary-foreground": "rgb(var(--secondary-foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        destructive: "rgb(var(--destructive) / <alpha-value>)",
        "quadrant-do": "rgb(var(--quadrant-do) / <alpha-value>)",
        "quadrant-do-bg": "rgb(var(--quadrant-do-bg) / <alpha-value>)",
        "quadrant-schedule": "rgb(var(--quadrant-schedule) / <alpha-value>)",
        "quadrant-schedule-bg": "rgb(var(--quadrant-schedule-bg) / <alpha-value>)",
        "quadrant-delegate": "rgb(var(--quadrant-delegate) / <alpha-value>)",
        "quadrant-delegate-bg": "rgb(var(--quadrant-delegate-bg) / <alpha-value>)",
        "quadrant-eliminate": "rgb(var(--quadrant-eliminate) / <alpha-value>)",
        "quadrant-eliminate-bg": "rgb(var(--quadrant-eliminate-bg) / <alpha-value>)"
      },
      borderRadius: {
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(31, 41, 51, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
