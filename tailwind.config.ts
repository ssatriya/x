import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        mobile: "350px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        blue: "#1D9BF0",
        blueProgress: "#1D9BF0",
        black: "#000000",
        text: "#D9D9D9",
        hover: "#161616",
        gray: "#6E767D",
        border: "#2F3336",
        trends: "#202327",
        backdrop: "rgba(91, 112, 131, 0.4)",
      },
      boxShadow: {
        normal: "0 0 15px rgba(255,255,255,0.2)",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
