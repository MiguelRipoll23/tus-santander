/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        "brand-blue": "#0070f0",
        "brand-light-blue": "#32b0fd",
      },
      animation: {
        "fade-in": "fade-in 0.2s",
        "fade-in-slow": "fade-in 0.3s",
        rotator: "rotator 0.6s linear infinite",
        wiggle: "wiggle 0.5s linear infinite",
      },
      borderRadius: {
        "4xl": "30px",
        "5xl": "40px",
        "6xl": "50px",
      },
    },
  },
  plugins: [],
};
