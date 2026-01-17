/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
      dropShadow: {
        custom: "0px 4px 10px rgba(0, 0, 0, 0.08)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-custom":
          "linear-gradient(to right, #9f7eea, #7a48e3, #5b2fcf)",
        "gradient-hr":
          "linear-gradient(to right, rgba(116,213,179 , 0.6), #FFFFFF)",
        "gradient-hr-alt":
          "linear-gradient(to left, rgba(116,213,179 , 0.6), #FFFFFF)",
        homeMain: "url('/banner.png')",
        homeSectionThree: "url('/home-third-section.webp')",
        homeSectionThreeMobile: "url('/home-third-section-mobile.webp')",
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
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(-8px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        popout: {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.8) translateY(10px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1) translateY(0)' 
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'fade-down': 'fadeDown 0.2s ease-out',
        'popout': 'popout 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      colors: {
        // texts
        primary: "#5F22D9",
        hoverPrimary: "#7e45ee",
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
        pinkTextOne: "#6436c1",
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
        blueBgDark: "#5F22D9",
        blueBgDarkHover: "#6436c1",
        blueBgDarkHover2: "#a074f9",
        scheduledBg: "#FFF8DD",
      },

      backgroundColor: {
        blackBtn: "#191919",
      },
    },
  },
  plugins: [],
};
