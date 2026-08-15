/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light surface — a near-white canvas common to premium product
        // pages. `surface-1` is the base, `-2` a half-step warmer.
        surface: {
          1: "#fbfbfd",
          2: "#f5f5f7",
        },
        // Dark surface — DM plum, used as the dark canvas for alternating
        // sections and the footer.
        plum: {
          DEFAULT: "#1B0E2E",
          1: "#1B0E2E",
          2: "#100620", // deeper, used in footer
        },
        ink: {
          DEFAULT: "#1B0E2E",
          soft: "#3F3450",
          muted: "#6E6478",
          faint: "#A39CB2",
        },
        dm: {
          pink: "#F13C64",
          magenta: "#E6359B",
          "hot-magenta": "#EC178D",
          violet: "#D332FF",
          "violet-deep": "#9A2FC6",
          orange: "#FFB23D",
          "orange-deep": "#F05F22",
          gold: "#F5A623",
          whatsapp: "#25D366",
        },
      },
      fontFamily: {
        sans: [
          "Manrope",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      // Type scale tuned for editorial / display-heavy sections.
      fontSize: {
        // Display tier — large fluid headings using clamp.
        "display-1": ["clamp(56px, 8vw, 128px)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-2": ["clamp(40px, 5.6vw, 88px)", { lineHeight: "1.0", letterSpacing: "-0.018em" }],
        "display-3": ["clamp(32px, 3.6vw, 56px)", { lineHeight: "1.05", letterSpacing: "-0.014em" }],
      },
      borderRadius: {
        card: "20px",
        "card-lg": "28px",
        pill: "999px",
        xl2: "20px",
      },
      boxShadow: {
        soft: "0 26px 60px -28px rgba(27, 14, 46, 0.22)",
        card: "0 14px 40px -22px rgba(27, 14, 46, 0.18)",
        pop: "0 22px 50px -16px rgba(241, 60, 100, 0.32)",
        ring: "0 0 0 1px rgba(27, 14, 46, 0.08)",
      },
      backgroundImage: {
        "dm-cta": "linear-gradient(90deg, #F13C64 0%, #E6359B 50%, #DC2EC9 100%)",
        "dm-brand":
          "linear-gradient(135deg, #FFB23D 14%, #F05F22 33%, #EC178D 59%, #D332FF 78%, #9A2FC6 100%)",
      },
      keyframes: {
        // Inner CTA pulse — small ring expanding from the button edge.
        // Purple (#9A2FC6) so the pulse reads as a distinct brand glow on
        // top of the blue CTA. Gentle but unmistakable.
        "pulse-plum": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(154, 47, 198, 0.55)" },
          "50%": { boxShadow: "0 0 0 14px rgba(154, 47, 198, 0)" },
        },
        // Outer bar pulse — same beat, larger ring + preserved drop shadow.
        // Purple ring, plum drop shadow keeps the bar grounded.
        "pulse-bar": {
          "0%, 100%": {
            boxShadow:
              "0 28px 60px -20px rgba(15,8,32,0.40), 0 2px 8px -2px rgba(15,8,32,0.14), 0 0 0 0 rgba(154, 47, 198, 0.50)",
          },
          "50%": {
            boxShadow:
              "0 28px 60px -20px rgba(15,8,32,0.40), 0 2px 8px -2px rgba(15,8,32,0.14), 0 0 0 22px rgba(154, 47, 198, 0)",
          },
        },
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        // Both share 2.4s ease-in-out infinite so they pulse in lockstep.
        "pulse-plum": "pulse-plum 2.4s ease-in-out infinite",
        "pulse-bar": "pulse-bar 2.4s ease-in-out infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};
