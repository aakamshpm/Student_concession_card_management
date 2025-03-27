/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "#5048E5",
      },
      fontFamily: {
        primary: "Inter",
      },
    },
  },
  plugins: [],
};
