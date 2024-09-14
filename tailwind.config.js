/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      dropShadow: {
        custom: "0px 4px 10px rgba(0, 0, 0, 0.08)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-custom": "linear-gradient(to right, #74D5B3, #4AA887)",
        "gradient-hr":
          "linear-gradient(to right, rgba(116,213,179 , 0.6), #FFFFFF)",
        "gradient-hr-alt":
          "linear-gradient(to left, rgba(116,213,179 , 0.6), #FFFFFF)",
        homeMain: "url('/banner.png')",
        homeSectionThree: "url('/home-third-section.png')",
        homeSectionThreeMobile: "url('/home-third-section-mobile.png')",
        homeFooter: "url('/footer.png')",
        homeFooterMobile: "url('/mobile-footer.png')",
        homeMobile: "url('/mobile-banner.png')",
      },
      borderColor: {
        gray: "#AEAEAE",
        secondary: "#74D5B3",
      },
      fontSize: {
        // base: ["18px", "1.5"],
      },
      boxShadow: {
        faq: "0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
        faq1: "0px 1px 1px 0px rgba(0, 0, 0, 0.14)",
        faq2: "0px 2px 1px -1px rgba(0, 0, 0, 0.20)",
      },
      aspectRatio: {
        normal: "2 / 3",
      },
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
        graySeven: "#3F4254",
        grayEight: "#AEAEAE",
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
        menuItem: "#5E6278",
        starItem: "#FFB400",

        // bg colors
        notPickedBg: "#FFF5F8",
        pickedBg: "#E8FFF3",
        pinkBgOne: "#FFF1F9",
        pinkBgDark: "#FD8AD0",
        pinkBgDarkHover: "#ffe6f5",
        pinkBgDarkHover2: "#FEBCE5",
        scheduledBg: "#FFF8DD",
      },

      backgroundColor: {
        blackBtn: "#191919",
      },
    },
  },
  plugins: [],
};
