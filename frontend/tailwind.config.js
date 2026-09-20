/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        hanken: ["'Hanken Grotesk'", "sans-serif"],
        inter: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
}
