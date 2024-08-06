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
        "gradient-custom": "linear-gradient(to right, #74D5B3, #4AA887)",
      },
      // ringColor: {
      //   gradient: "linear-gradient(to right, #74D5B3, #4AA887)",
      // },
      // ringOffsetWidth: {
      //   gradient: "4px",
      // },
      colors: {
        // texts
        main: "#39B88B",
        mainLight: "#74D5B3",
        textLight: "#FFFFFF",
        one: "#181C32",
        blackTwo: "#3F4254",
        blackThree: "#0B0B0B",
        blackFour: "#09090B",
        cardNumber: "#2A2D43",
        grayOne: "#A1A5B7",
        grayTwo: "#E3E3E3",
        grayThree: "#7E8299",
        grayFour: "#747474",
        grayFive: "#F9F9F9",
        graySix: "#404146",
        amountStatus: "#E2E2E2",
        date: "#AFAFAF",
        amount: "#1C1C28",
        comment: "#575B62",
        dividerComment: "#C4C4C4",
        notPickedText: "#F1416C",
        pickedText: "#50CD89",
        pinkTextOne: "#FD8AD0",
        secondary: "#74D5B3",
        redOne: "#D12E34",
        mainTwo: "#50CD89",
        mainThree: "#E8FFF3",
        tabColor: "#3E97FF",
        badgeScheduled: "#F6C000",

        // bg colors
        notPickedBg: "#FFF5F8",
        pickedBg: "#E8FFF3",
        pinkBgOne: "#FFF1F9",
        pinkBgDark: "#FD8AD0",
        pinkBgDarkHover: "#FF8C9E",
        scheduledBg: "#FFF8DD",
      },
    },
  },
  plugins: [],
};
