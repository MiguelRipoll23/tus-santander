/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          600: "#0070f0",
          400: "#32b0fd",
        },
      },
      spacing: {
        lr: "14px",
        "2.75": "11px",
        "3.5": "14px",
        "10.5": "42px",
        "18.5": "74px",
        "1.25": "5px",
        "1.75": "7px",
        "0.25": "1px",
        "0.5": "2px",
        "8.75": "35px",
        "4.5": "18px",
        "7.5": "30px",
        "9": "36px",
        "12.5": "50px",
        "30": "120px",
        "50": "200px",
        "60": "240px",
        "45px": "45px",
      },
      fontSize: {
        "3.5xl": "35px",
      },
      zIndex: {
        1: "1",
      },
      keyframes: {
        wiggle: {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-0.5deg)" },
          "50%": { transform: "rotate(0.5deg)" },
          "75%": { transform: "rotate(-0.5deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        blink: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
        },
        "slide-from-right": {
          from: { transform: "translateX(30px)" },
        },
        "slide-to-left": {
          to: { transform: "translateX(-30px)" },
        },
        "slide-to-right": {
          to: { transform: "translateX(30px)" },
        },
        "slide-from-left": {
          from: { transform: "translateX(-30px)" },
        },
        rotator: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 0.5s linear infinite",
        blink: "blink 0.8s linear infinite",
        "fade-in": "fade-in 0.2s",
        "slide-from-right": "slide-from-right 300ms cubic-bezier(0.4, 0, 0.2, 1) both",
        "slide-to-left": "slide-to-left 300ms cubic-bezier(0.4, 0, 0.2, 1) both",
        "slide-to-right": "slide-to-right 300ms cubic-bezier(0.4, 0, 0.2, 1) both",
        "slide-from-left": "slide-from-left 300ms cubic-bezier(0.4, 0, 0.2, 1) both",
        rotator: "rotator 0.6s linear infinite",
      },
      padding: {
        lr: "14px",
        "1.5": "6px",
        "2.25": "9px",
      },
      width: {
        96: "500px",
      },
      boxShadow: {
        lg: "0 0 40px rgba(0, 0, 0, 0.3)",
      },
      borderRadius: {
        glass: "24px",
        "40": "40px",
        "2xl": "14px",
        "2": "8px",
        "2.5": "10px",
        "3.5": "14px",
        "3.25": "13px",
        "7.5": "30px",
        "4xl": "32px",
      },
      minWidth: {
        "8.75": "35px",
        "6.5": "26px",
      },
      lineHeight: {
        "4.75": "19px",
        "1.4": "1.4",
        "27px": "27px",
        "5.5": "22px",
        "6.75": "27px",
      },
    },
  },
  plugins: [],
};
