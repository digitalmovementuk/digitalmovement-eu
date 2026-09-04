/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: "#ffffff", 2: "#f5f5f7" },
        ink: {
          DEFAULT: "#1b0e2e",
          soft: "#4b4059",
          muted: "#6f6579",
        },
        accent: { DEFAULT: "#ec178d", hover: "#d0117b" },
        star: "#f5a623",
        plum: "#1b0e2e",
      },
      borderColor: {
        line: "rgba(27,14,46,0.12)",
        "line-strong": "rgba(27,14,46,0.22)",
      },
      fontFamily: {
        sans: ['"Manrope Variable"', "Manrope", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        pill: "999px",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};
