import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2933",
        paper: "#f7f4ef",
        line: "#d8d1c7",
        accent: "#0f766e",
        berry: "#9f1239"
      }
    }
  },
  plugins: []
};

export default config;
