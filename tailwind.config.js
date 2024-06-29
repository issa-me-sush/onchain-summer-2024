/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        'clay-card': '35px 35px 70px hsl(302deg 25% 50%), inset -10px -10px 20px hsl(302deg 25% 50% / 70%), inset 0 16px 32px hsl(302deg 25% 95%)',
        'clay-btn': '16px 16px 32px 0 hsl(277deg 50% 65% / 50%), inset -16px -16px 32px 0 hsl(277deg 50% 65%), inset 8px 8px 16px 0 hsl(227deg 65% 75% / 45%)'
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}