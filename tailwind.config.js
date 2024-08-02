/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // texts
        main: "#39B88B",
        mainLight: "#74D5B3",
        textLight: "#FFFFFF",
        one: "#181C32",
        blackTwo: "#3F4254",
        grayOne: "#A1A5B7",
        grayTwo: "#E3E3E3",
        grayThree: "#7E8299",
        notPickedText: "#F1416C",
        pickedText: "#50CD89",
        // secondary: "#74D5B3",
        // placeholder: "#BCBEC0",
        // greyText: "#C9C9C9",
        // sidebarOptionText: "#ADB7C0",
        // headingText: "#333333",
        // filterHeading: "#A1A5B7",
        // errorText: "#E10000",
        // successText: "#50CD89",
        // paginationText: "#6E6B7B",

        // bg colors
        notPickedBg: "#FFF5F8",
        pickedBg: "#E8FFF3",
        // sidebarBackground: "#0C0C0C",
        // tableButtonBackground: "#F1F1F2",
        // paginationBackground: "#F3F2F7",
        // deletecolor: "#C60000",
        // greyTag: "#F6F6F6",
      },
    },
  },
  plugins: [],
};
