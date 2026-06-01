import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        archivo: ["Archivo Black", "sans-serif"],
        work: ["Work Sans", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        blue: "#0000FF",
        success: "#008000",
        warning: "#FFA500",
        error: "#FF0000",
      },
      borderWidth: {
        thin: "1px",
        thick: "3px",
        heavy: "5px",
      }
    },
  },
  darkMode: "class",
  plugins: [heroui({
    layout: {
      radius: {
        small: "0px",
        medium: "0px",
        large: "0px",
      },
      borderWidth: {
        small: "1px",
        medium: "3px",
        large: "5px",
      }
    },
    themes: {
      light: {
        colors: {
          background: "#FFFFFF",
          foreground: "#000000",
          primary: {
            DEFAULT: "#000000",
            foreground: "#FFFFFF",
          },
          secondary: {
            DEFAULT: "#FFFFFF",
            foreground: "#000000",
          },
          focus: "#000000",
        },
      },
    },
  })],
};
