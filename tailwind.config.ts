import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "hsl(var(--color-text))",
        paper: "hsl(var(--color-bg))",
        line: "hsl(var(--color-border))",
        accent: "hsl(var(--color-primary))",
        berry: "hsl(var(--color-danger))",
        surface: "hsl(var(--color-surface))",
        "surface-2": "hsl(var(--color-surface-2))",
        muted: "hsl(var(--color-muted))"
      },
      boxShadow: {
        soft: "0 18px 50px -30px rgb(15 23 42 / 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
