import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#131110",
        paper: "#F7F4EE",
        signal: "#E0231F",
        teal: "#1A6B66",
        sand: "#DCD1B8",
        gold: "#C79A3C",
        muted: "#847E70",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "sans-serif"],
        body: ["var(--font-work-sans)", "sans-serif"],
        tag: ["var(--font-space-mono)", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "3px",
      },
      letterSpacing: {
        tag: "0.08em",
      },
    },
  },
  plugins: [],
};
export default config;
