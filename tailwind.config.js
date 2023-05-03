/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      gridTemplateRows: {
        "min-One": " auto 1fr",
        "One-min": " 1fr auto ",
      },
      gridTemplateColumns: {
        "min-One": " auto 1fr",
        "One-min": " 1fr auto ",
      },
    },
  },
  plugins: [],
};
