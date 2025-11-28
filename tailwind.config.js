/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class", // we will toggle 'dark' class on html
  theme: {
    extend: {
      boxShadow: {
        glass: "0 22px 50px rgba(15,23,42,0.95)",
      },
      keyframes: {
        "orb-float": {
          "0%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(20px,-20px)" },
          "100%": { transform: "translate(-10px,10px)" },
        },
        float: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: 0, transform: "translateY(-12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: 0, transform: "translateY(24px) scale(0.98)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        shake: {
          "0%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "50%": { transform: "translateX(4px)" },
          "75%": { transform: "translateX(-2px)" },
          "100%": { transform: "translateX(0)" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "orb-float": "orb-float 18s infinite alternate ease-in-out",
        float: "float 3.5s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.7s ease-out both",
        "fade-in-down": "fade-in-down 0.6s ease-out both",
        "slide-up": "slide-up 0.7s ease-out both",
        shake: "shake 0.3s ease-in-out",
        spin: "spin 0.9s linear infinite",
      },
    },
  },
  plugins: [],
};
