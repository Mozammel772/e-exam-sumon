/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react");

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: ["solaimanlipi"],
  theme: {
    extend: {
      spacing: {
        "1/2": "50%",
        "1/3": "33.333333%",
      },
    },
  },
  plugins: [heroui()],
};
