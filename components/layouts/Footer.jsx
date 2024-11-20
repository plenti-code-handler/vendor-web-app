"use client";

import React from "react";
import { appLogoUrl } from "../../lib/constant_data";
import { appleLogoSvg, googleLogoSvg, rightArrowIcon } from "../../svgs";
import { setOpenDrawer } from "../../redux/slices/contactUserSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";

const Footer = () => {
  const dispatch = useDispatch();

  const openContactForm = () => {
    dispatch(setOpenDrawer(true));
  };

  return (
    <div className="text-[75%] md:text-[100%]">
      <div className="bg-homeFooterMobile md:bg-homeFooter p-[5%] bg-cover bg-center w-auto flex flex-col justify-center">
        <div className="mx-auto flex flex-col gap-3">
          <div className="flex flex-col gap-5 items-center">
            <h1 className="text-[2.188em] text-center uppercase lg:text-left text-white font-extrabold">
              Download FoodieFinder Today!
            </h1>
            <p className="text-[#fff] text-center text-[1em] font-medium md:w-[547px]">
              FoodeFinder is free to download and free to use! Are you ready to
              discover the best taste around you? Find best deals around you
              today!
            </p>
            <div className="flex flex-col md:flex-row gap-[5%] space-y-5 md:space-y-0">
              <button className="flex items-center gap-3 w-[205px] px-4 py-2 bg-blackBtn hover:bg-slate-800 rounded-[12px] text-white">
                <div>{appleLogoSvg}</div>
                <div className="text-center">
                  <div className="text-[#A8A29E] text-[14px]">
                    Download on the
                  </div>
                  <div className="text-[18px] font-[500]">App Store</div>
                </div>
              </button>
              <button className="flex items-center gap-3 w-[205px] px-4 py-2 bg-blackBtn hover:bg-slate-800 rounded-[12px] text-white">
                <div>{googleLogoSvg}</div>
                <div className="text-center">
                  <div className="text-[#A8A29E] text-[14px]">
                    Download on the
                  </div>
                  <div className="text-[18px] font-[500]">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-blackBtn px-[5%] pt-[5%] pb-6">
        <div className="flex flex-col gap-5 justify-between flex-wrap sm:flex-row pb-14">
          <div className="flex-1">
            <div className="flex mb-8 gap-3">
              <img src="/logo-without-text.png" />
              <img src="/logo-white.png" />
            </div>
            <div className="flex flex-col lg:flex-row gap-3 lg:justify-between">
              <ul className=" text-white flex flex-col gap-5 text-[400] text-[1em] w-full   lg:w-1/3">
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-5 hover:text-main transition-colors duration-300 w-fit"
                  >
                    {horizontalChecklistIcon}
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/surprise"
                    className="flex items-center gap-5 hover:text-main transition-colors duration-300 w-fit"
                  >
                    {horizontalChecklistIcon}
                    <span>Surprise Pouch</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/small_medium_bags"
                    className="flex items-center gap-5 hover:text-main transition-colors duration-300 w-fit"
                  >
                    {horizontalChecklistIcon}
                    <span>Small & Medium Pouch</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faqs"
                    className="flex items-center gap-5 hover:text-main transition-colors duration-300 w-fit"
                  >
                    {horizontalChecklistIcon}
                    <span>FAQs</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about_app"
                    className="flex items-center gap-5 hover:text-main transition-colors duration-300 w-fit"
                  >
                    {horizontalChecklistIcon}
                    <span>About App</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact_us"
                    className="flex items-center gap-5 hover:text-main transition-colors duration-300 w-fit"
                  >
                    {horizontalChecklistIcon}
                    <span>Contact Us</span>
                  </Link>
                </li>
              </ul>
              <ul className=" text-white flex flex-col gap-5 text-[400] text-[1em] w-full  lg:w-1/3">
                <li>
                  <Link
                    href="/privacy"
                    className="flex items-center gap-5 hover:text-main transition-colors duration-300 w-fit"
                  >
                    {horizontalChecklistIcon}
                    <span>Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="flex items-center gap-5 hover:text-main transition-colors duration-300 w-fit"
                  >
                    {horizontalChecklistIcon}
                    <span>Terms & Conditions</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookie_policy"
                    className="flex items-center gap-5 hover:text-main transition-colors duration-300 w-fit"
                  >
                    {horizontalChecklistIcon}
                    <span>Cookie Policy</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/deliever_return_policy"
                    className="flex items-center gap-5 hover:text-main transition-colors duration-300 w-fit"
                  >
                    {horizontalChecklistIcon}
                    <span>Delivery and Return Policy</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/payment_terms"
                    className="flex items-center gap-5 hover:text-main transition-colors duration-300 w-fit"
                  >
                    {horizontalChecklistIcon}
                    <span>Payment Terms</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ugc_policy"
                    className="flex items-center gap-5 hover:text-main transition-colors duration-300 w-fit"
                  >
                    {horizontalChecklistIcon}
                    <span>UGC Policy</span>
                  </Link>
                </li>
              </ul>
              <ul className=" text-white flex flex-col gap-5 text-[400] text-[1em] w-full   lg:w-1/3">
                <li>
                  <Link
                    href="/security_policy"
                    className="flex items-center gap-5 hover:text-main transition-colors duration-300 w-fit"
                  >
                    {horizontalChecklistIcon}
                    <span>Security Policy</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/accessibility_policy"
                    className="flex items-center gap-5 hover:text-main transition-colors duration-300 w-fit"
                  >
                    {horizontalChecklistIcon}
                    <span>Accessibility Policy</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ethical_policy"
                    className="flex items-center gap-5 hover:text-main transition-colors duration-300 w-fit"
                  >
                    {horizontalChecklistIcon}
                    <span>Ethical Policy</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-white pl-8 flex flex-col gap-4 border-white border-l w-full md:w-1/2 lg:w-1/4">
            <h2 className="text-[1.25em] text-[400]">Connect with us</h2>
            <div className="flex gap-4 items-center">
              <a
                href="https://www.facebook.com/profile.php?id=100067991773746"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 hover:text-blue-600 transition transform duration-300 ease-in-out"
              >
                {facebookLogo}
              </a>
              <a
                href="https://www.instagram.com/foodie.finder/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 hover:text-pink-500 transition transform duration-300 ease-in-out"
              >
                {instagramLogo}
              </a>
              {/* Uncomment and add links as needed */}
              {/* 
  <a
    href="https://twitter.com"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:scale-110 hover:text-blue-400 transition transform duration-300 ease-in-out"
  >
    {twitterLogo}
  </a>
  <a
    href="https://youtube.com"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:scale-110 hover:text-red-600 transition transform duration-300 ease-in-out"
  >
    {youtubeLogo}
  </a>
  */}
            </div>

            <hr className="my-4" />
            <div className="flex flex-col gap-4">
              <h2 className="text-[1.25em] text-[400]">drop us a line</h2>
              <p className={`underline text-[1em]`}>
                <a
                  href="mailto:kontakt@foodiefinder.se"
                  className="underline hover:text-secondary"
                >
                  kontakt@foodiefinder.se
                </a>
              </p>
              <div className="flex items-center gap-5">
                <Link
                  href={"/contact_us"}
                  className="mr-3 mt-2 lg:m-0 flex items-center min-w-[150px] px-[10px] py-[10px] text-center justify-center bg-secondary text-white font-semibold rounded-[6px] hover:bg-pinkTextOne transition-colors duration-500"
                >
                  <span className="mr-3 ml-2 font-semibold uppercase">
                    Contact Us
                  </span>
                  <span>{rightArrowIcon}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <hr className="pb-6" />
        <p className="text-[#F0F0F0] text-[0.875em] text-[400]">
          FoodieFinder @2024 - Part of BuildLoop Sverige AB 559475-7170
        </p>
      </div>
    </div>
  );
};

export default Footer;

const horizontalChecklistIcon = (
  <svg
    width="10"
    height="11"
    viewBox="0 0 10 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_3693_503)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 11L10 5.5L0 0C1.53199 3.53801 1.53199 7.47807 0 11Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_3693_503">
        <rect width="10" height="11" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const facebookLogo = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 10.061C20 4.50354 15.5225 -0.00146484 10 -0.00146484C4.475 -0.000214844 -0.00250244 4.50354 -0.00250244 10.0623C-0.00250244 15.0835 3.655 19.246 8.435 20.001V12.9698H5.8975V10.0623H8.4375V7.84354C8.4375 5.32229 9.93125 3.92979 12.215 3.92979C13.31 3.92979 14.4537 4.12604 14.4537 4.12604V6.60104H13.1925C11.9512 6.60104 11.5637 7.37729 11.5637 8.17354V10.061H14.3362L13.8937 12.9685H11.5625V19.9998C16.3425 19.2448 20 15.0823 20 10.061Z"
      fill="white"
    />
  </svg>
);

const instagramLogo = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 7.39658C8.56641 7.39658 7.39649 8.5665 7.39649 10.0001C7.39649 11.4337 8.56641 12.6036 10 12.6036C11.4336 12.6036 12.6035 11.4337 12.6035 10.0001C12.6035 8.5665 11.4336 7.39658 10 7.39658ZM17.8086 10.0001C17.8086 8.92197 17.8184 7.85361 17.7578 6.77744C17.6973 5.52744 17.4121 4.41806 16.498 3.504C15.582 2.58798 14.4746 2.30478 13.2246 2.24423C12.1465 2.18369 11.0781 2.19345 10.002 2.19345C8.92383 2.19345 7.85547 2.18369 6.7793 2.24423C5.5293 2.30478 4.41992 2.58994 3.50586 3.504C2.58984 4.42001 2.30664 5.52744 2.24609 6.77744C2.18555 7.85556 2.19531 8.92392 2.19531 10.0001C2.19531 11.0763 2.18555 12.1466 2.24609 13.2227C2.30664 14.4727 2.5918 15.5821 3.50586 16.4962C4.42188 17.4122 5.5293 17.6954 6.7793 17.756C7.85742 17.8165 8.92578 17.8067 10.002 17.8067C11.0801 17.8067 12.1484 17.8165 13.2246 17.756C14.4746 17.6954 15.584 17.4102 16.498 16.4962C17.4141 15.5802 17.6973 14.4727 17.7578 13.2227C17.8203 12.1466 17.8086 11.0782 17.8086 10.0001ZM10 14.006C7.7832 14.006 5.99414 12.2169 5.99414 10.0001C5.99414 7.7833 7.7832 5.99423 10 5.99423C12.2168 5.99423 14.0059 7.7833 14.0059 10.0001C14.0059 12.2169 12.2168 14.006 10 14.006ZM14.1699 6.76572C13.6523 6.76572 13.2344 6.34775 13.2344 5.83017C13.2344 5.31259 13.6523 4.89462 14.1699 4.89462C14.6875 4.89462 15.1055 5.31259 15.1055 5.83017C15.1056 5.95307 15.0815 6.0748 15.0346 6.18837C14.9876 6.30195 14.9187 6.40514 14.8318 6.49205C14.7449 6.57895 14.6417 6.64786 14.5281 6.69482C14.4145 6.74178 14.2928 6.76587 14.1699 6.76572Z"
      fill="white"
    />
  </svg>
);

const twitterLogo = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.125 4.9668C17.5273 5.22462 16.877 5.41016 16.207 5.48243C16.9026 5.06922 17.4234 4.41641 17.6719 3.64649C17.0192 4.03475 16.3042 4.30701 15.5586 4.45118C15.247 4.11803 14.8701 3.85262 14.4514 3.67151C14.0327 3.49039 13.5812 3.39744 13.125 3.39845C11.2793 3.39845 9.79492 4.89454 9.79492 6.73048C9.79492 6.98829 9.82617 7.2461 9.87695 7.49415C7.11328 7.34962 4.64844 6.0293 3.00977 4.00782C2.71118 4.51781 2.55471 5.0985 2.55664 5.68946C2.55664 6.84571 3.14453 7.86524 4.04102 8.46485C3.5127 8.44405 2.99676 8.29883 2.53516 8.04102V8.08204C2.53516 9.70118 3.67969 11.043 5.20508 11.3516C4.91867 11.426 4.62404 11.464 4.32812 11.4649C4.11133 11.4649 3.90625 11.4434 3.69922 11.4141C4.12109 12.7344 5.34961 13.6934 6.8125 13.7246C5.66797 14.6211 4.23438 15.1484 2.67773 15.1484C2.39844 15.1484 2.14062 15.1387 1.87305 15.1074C3.34961 16.0547 5.10156 16.6016 6.98828 16.6016C13.1133 16.6016 16.4648 11.5274 16.4648 7.12306C16.4648 6.97852 16.4648 6.83399 16.4551 6.68946C17.1035 6.21485 17.6719 5.62696 18.125 4.9668Z"
      fill="white"
    />
  </svg>
);
const youtubeLogo = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.3848 5.7832C18.2851 5.41218 18.0898 5.07384 17.8184 4.80202C17.5469 4.53021 17.2088 4.33446 16.8379 4.23438C15.4727 3.86719 10 3.86719 10 3.86719C10 3.86719 4.52734 3.86719 3.16211 4.23242C2.79106 4.33219 2.45278 4.52782 2.18126 4.79969C1.90974 5.07155 1.71453 5.41007 1.61523 5.78125C1.25 7.14844 1.25 10 1.25 10C1.25 10 1.25 12.8516 1.61523 14.2168C1.81641 14.9707 2.41016 15.5645 3.16211 15.7656C4.52734 16.1328 10 16.1328 10 16.1328C10 16.1328 15.4727 16.1328 16.8379 15.7656C17.5918 15.5645 18.1836 14.9707 18.3848 14.2168C18.75 12.8516 18.75 10 18.75 10C18.75 10 18.75 7.14844 18.3848 5.7832ZM8.26172 12.6172V7.38281L12.793 9.98047L8.26172 12.6172Z"
      fill="white"
    />
  </svg>
);
const tiktokLogo = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.75 8.19961C17.0303 8.20372 15.3527 7.6674 13.9543 6.66641V13.6477C13.9538 14.9407 13.5586 16.2027 12.8215 17.265C12.0844 18.3274 11.0406 19.1393 9.82952 19.5924C8.61848 20.0455 7.298 20.118 6.04463 19.8003C4.79126 19.4826 3.66475 18.7899 2.81572 17.8147C1.9667 16.8395 1.43563 15.6283 1.29353 14.3431C1.15143 13.058 1.40508 11.76 2.02055 10.6229C2.63602 9.48578 3.58398 8.56366 4.73767 7.97983C5.89136 7.39601 7.1958 7.17832 8.47656 7.35586V10.8672C7.89048 10.6828 7.26114 10.6884 6.67841 10.8831C6.09567 11.0777 5.58935 11.4515 5.23175 11.9511C4.87414 12.4507 4.68353 13.0505 4.68715 13.6649C4.69077 14.2793 4.88843 14.8768 5.25189 15.3721C5.61536 15.8675 6.12605 16.2353 6.71104 16.4231C7.29602 16.6109 7.92538 16.609 8.50925 16.4178C9.09311 16.2265 9.60162 15.8557 9.96215 15.3582C10.3227 14.8607 10.5168 14.262 10.5168 13.6477V0H13.9543C13.9519 0.290289 13.9762 0.580182 14.0269 0.866016C14.1464 1.50409 14.3948 2.1111 14.7568 2.6499C15.1189 3.1887 15.5871 3.64796 16.1328 3.99961C16.9091 4.51293 17.8193 4.78652 18.75 4.78633V8.19961Z"
      fill="white"
    />
  </svg>
);
const snapchatLogo = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.9549 15.3386C19.7514 15.8134 18.8909 16.1623 17.3237 16.4057C17.243 16.5145 17.1762 16.9793 17.0695 17.3414C17.006 17.5589 16.8498 17.6879 16.5957 17.6879L16.5841 17.6877C16.2171 17.6877 15.834 17.5188 15.0665 17.5188C14.0305 17.5188 13.6734 17.7549 12.8691 18.323C12.0162 18.9261 11.1983 19.4466 9.97737 19.3933C8.7412 19.4845 7.71077 18.7329 7.13085 18.3229C6.32171 17.7509 5.96569 17.5189 4.93394 17.5189C4.19706 17.5189 3.73331 17.7032 3.41628 17.7032C3.10093 17.7032 2.97827 17.511 2.93105 17.3501C2.82546 16.9912 2.75901 16.5195 2.67624 16.4075C1.86847 16.2822 0.0469433 15.9644 0.00053705 15.1517C-0.00508794 15.0495 0.027192 14.9489 0.0911853 14.8691C0.155179 14.7893 0.24638 14.736 0.347295 14.7193C3.06538 14.2718 4.28964 11.481 4.34054 11.3625C4.34343 11.3556 4.34659 11.3491 4.34979 11.3424C4.49483 11.048 4.52729 10.8014 4.44601 10.6098C4.24874 10.1452 3.39632 9.97844 3.03769 9.83656C2.11132 9.4707 1.98241 9.05031 2.03722 8.76219C2.13241 8.26078 2.88585 7.95223 3.32636 8.15856C3.67476 8.32188 3.98429 8.40453 4.24616 8.40453C4.44233 8.40453 4.56694 8.3575 4.63522 8.31973C4.55542 6.91598 4.35784 4.90996 4.85737 3.78969C6.17663 0.831953 8.97284 0.602109 9.79788 0.602109C9.83476 0.602109 10.155 0.598633 10.1928 0.598633C12.2298 0.598633 14.1871 1.64473 15.1429 3.78781C15.642 4.90695 15.4456 6.90469 15.3654 8.31941C15.4272 8.35348 15.5356 8.39527 15.7013 8.40297C15.9512 8.3918 16.2409 8.30965 16.5634 8.15856C16.801 8.04738 17.1261 8.06242 17.3633 8.16082L17.3645 8.16121C17.7346 8.29344 17.9676 8.56023 17.9734 8.85926C17.9806 9.24 17.6405 9.56883 16.9626 9.83652C16.8798 9.86914 16.7792 9.90117 16.6722 9.93516C16.2895 10.0565 15.7112 10.24 15.5544 10.6098C15.4732 10.8014 15.5053 11.0477 15.6505 11.3421C15.6539 11.3487 15.6569 11.3555 15.6598 11.3623C15.7106 11.4806 16.9338 14.2709 19.6532 14.7191C19.9042 14.7604 20.0892 15.0268 19.9549 15.3386Z"
      fill="white"
    />
  </svg>
);
