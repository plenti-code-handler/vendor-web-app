"use client";

import { GFS_Didot } from "next/font/google";
import { Montserrat_Alternates } from "next/font/google";

import React from "react";
import { appleLogoSvg, googleLogoSvg, rightArrowIcon } from "../../../svgs";

const gfsFont = GFS_Didot({ weight: "400", subsets: ["greek"] });
const montserratFont = Montserrat_Alternates({
  weight: ["700", "500"],
  subsets: ["latin"],
});

const page = () => {
  return (
    <>
      <div className="bg-homeMain bg-bottom bg-cover bg-no-repeat h-[calc(100vh-96px)]">
        <div className="flex flex-col justify-center items-center h-full">
          <div className="flex flex-col gap-5 items-center">
            <img
              alt="Foodie Finder Logo"
              className="w-[496px]"
              src="/logo-landing.png"
            />
            <h1 className="text-[48px] text-white">Lorem Ipsum Lorem Ipsum</h1>
            <div className="flex gap-[5%]">
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
      <div className="flex justify-center items-center p-[5%]">
        <div className="w-1/2 flex items-center justify-center">
          <img className="w-full h-full" src="/home-second-section.png" />
        </div>
        <div className="w-1/2 flex flex-col gap-3">
          <h2 className="text-pinkTextOne text-[48px] font-[400]">Heading 1</h2>
          <p className="text-[20px] text-[#222] font-[500]">
            Magnam sunt soluta amet. Tenetur impedit debitis dolor sapiente enim
            in soluta omnis earum. Voluptatem molestiae suscipit. Et quaerat
            rerum sit quo odio ullam ea.
          </p>
        </div>
      </div>
      <div className="bg-homeSectionThree p-[5%] bg-center bg-cover h-[496px] w-auto flex flex-col justify-center">
        <div className="mx-auto flex flex-col gap-3">
          <h2 className="text-white text-[48px] font-[400]">Lorem Ipsum</h2>
          <p className="text-[20px] text-white font-[500]">
            Magnam sunt soluta amet. Tenetur impedit debitis dolor sapiente enim
            in soluta omnis earum. Voluptatem molestiae suscipit. Et quaerat
            rerum sit quo odio ullam ea.
          </p>
          <div className="flex items-center gap-5">
            <button className="mr-3 mt-2 lg:m-0 flex items-center min-w-[150px] px-[12px] py-[16px] text-center justify-center bg-secondary text-white font-semibold rounded-[6px] hover:bg-mainTwo">
              <span className="mr-3 ml-2 font-semibold">Contact us</span>
              <span>{rightArrowIcon}</span>
            </button>
          </div>
        </div>
      </div>
      <div className={gfsFont.className}>
        <div className="flex justify-center items-center p-[5%]">
          <div className="w-1/2 flex flex-col gap-3">
            <h2 className="text-pinkTextOne text-[48px] font-[400]">
              Why Choose FoodieFinder
            </h2>
            <p
              className={`${montserratFont.className} text-[20px] text-[#222] font-[500]`}
            >
              Accusantium ut fugit aut qui est aut harum sed. Et et cum et
              debitis distinctio consequatur quas mollitia. Accusantium eum illo
              expedita fugit perferendis in. Voluptate quod tempore omnis
              molestias voluptates vero sed.
            </p>
            <div className="flex items-center gap-5">
              <button className="mr-3 mt-2 lg:m-0 flex items-center min-w-[150px] px-[12px] py-[16px] text-center justify-center bg-pinkBgDark text-white font-semibold rounded-[6px] hover:bg-pinkBgDarkHover2">
                <span className="mr-3 ml-2 font-semibold">Get Started</span>
                <span>{rightArrowIcon}</span>
              </button>
            </div>
          </div>
          <div className="w-1/2 flex items-center justify-center">
            <img className="w-full h-full" src="/home-forth-section.png" />
          </div>
        </div>
        <div className="bg-pinkTextOne p-[5%]">
          <h1 className="text-center mb-8 text-white text-[48px] font-[400]">
            Take Advantage of FoodieFinder’s Amazing Features
          </h1>
          <div className="flex items-center justify-center gap-5">
            <div className="w-[334px] h-[334px] flex items-center justify-center border-white border-2">
              <div className="flex flex-col items-center gap-3">
                <div>{heartIcon}</div>
                <div
                  className={`${montserratFont.className} font-[700] text-[30px] text-white`}
                >
                  Feature 1
                </div>
              </div>
            </div>
            <div className="w-[334px] h-[334px] flex items-center justify-center border-white border-2">
              <div className="flex flex-col items-center gap-3">
                <div>{planeLogo}</div>
                <div
                  className={`${montserratFont.className} font-[700] text-[30px] text-white`}
                >
                  Feature 2
                </div>
              </div>
            </div>
            <div className="w-[334px] h-[334px] flex items-center justify-center border-white border-2">
              <div className="flex flex-col items-center gap-3">
                <div>{filterLogo}</div>
                <div
                  className={`${montserratFont.className} font-[700] text-[30px] text-white`}
                >
                  Feature 3
                </div>
              </div>
            </div>
            <div className="w-[334px] h-[334px] flex items-center justify-center border-white border-2">
              <div className="flex flex-col items-center gap-3">
                <div>{reloadIconLeft}</div>
                <div
                  className={`${montserratFont.className} font-[700] text-[30px] text-white`}
                >
                  Feature 4
                </div>
              </div>
            </div>
            <div className="w-[334px] h-[334px] flex items-center justify-center border-white border-2">
              <div className="flex flex-col items-center gap-3">
                <div>{reloadIconRight}</div>
                <div
                  className={`${montserratFont.className} font-[700] text-[30px] text-white`}
                >
                  Feature 5
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-[5%]">
        <h2 className={`text-secondary text-[48px] ${gfsFont.className}`}>
          Our Core Values
        </h2>
        <p className={`${montserratFont.className} text-[20px]`}>
          At Foodiefinder, we are guided by our core values
        </p>
      </div>
      <div className="flex justify-center items-center p-[5%]">
        <div className="w-1/2 flex items-center justify-center">
          <img src="/home-fifth-section-1.png" />
        </div>
        <div className="w-1/2 flex flex-col gap-3">
          <h2 className="text-pinkTextOne text-[48px] font-[400]">Heading 1</h2>
          <p className="text-[20px] text-[#222] font-[500]">
            Culpa dicta iste. Soluta id qui et sed tempora nihil velit
            cupiditate. Dicta voluptatem consequatur explicabo et animi.
            Voluptas accusantium maxime. Qui delectus autem corrupti mollitia
            consectetur blanditiis vel velit quo. Ipsum iste unde excepturi.
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center p-[5%]">
        <div className="w-1/2 flex flex-col gap-3">
          <h2 className="text-pinkTextOne text-[48px] font-[400]">Heading 1</h2>
          <p className="text-[20px] text-[#222] font-[500]">
            Nostrum temporibus nemo consequatur sapiente ut voluptas earum
            exercitationem. Ad aut aliquam quidem. Dolorum dolor consequatur.
            Voluptas quos quaerat sapiente est ratione ut quam quas
          </p>
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <img src="/home-fifth-section-2.png" />
        </div>
      </div>
      <div className="flex justify-center items-center p-[5%]">
        <div className="w-1/2 flex items-center justify-center">
          <img src="/home-fifth-section-3.png" />
        </div>
        <div className="w-1/2 flex flex-col gap-3">
          <h2 className="text-pinkTextOne text-[48px] font-[400]">Heading 1</h2>
          <p className="text-[20px] text-[#222] font-[500]">
            Accusamus in repudiandae non cum modi natus. Optio in quia numquam
            vero iure quia. Autem enim ad. Ad et modi et odio et.
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center p-[5%]">
        <div className="w-1/2 flex flex-col gap-3">
          <h2 className="text-pinkTextOne text-[48px] font-[400]">Heading 1</h2>
          <p className="text-[20px] text-[#222] font-[500]">
            Dolorem impedit omnis rerum nisi et quos et neque distinctio. Saepe
            ipsam labore sapiente cumque esse. Reprehenderit omnis dicta dolorem
            quo accusamus sunt quia sed.
          </p>
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <img src="/home-fifth-section-4.png" />
        </div>
      </div>
    </>
  );
};

export default page;

const filterLogo = (
  <svg
    width="49"
    height="49"
    viewBox="0 0 49 49"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.35069 5.34683C1.96944 4.03433 3.28194 3.19995 4.73506 3.19995H45.2351C46.6882 3.19995 48.0007 4.03433 48.6194 5.34683C49.2382 6.65933 49.0507 8.2062 48.1319 9.3312L30.9851 30.2843V42.2C30.9851 43.3343 30.3476 44.375 29.3257 44.8812C28.3038 45.3875 27.0944 45.2843 26.1851 44.6L20.1851 40.1C19.4257 39.5375 18.9851 38.6468 18.9851 37.7V30.2843L1.82881 9.32183C0.919437 8.2062 0.722562 6.64995 1.35069 5.34683Z"
      fill="white"
    />
  </svg>
);

const planeLogo = (
  <svg
    width="49"
    height="49"
    viewBox="0 0 49 49"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.884 3.65295C20.724 1.97295 22.239 0.199951 24.6 0.199951C26.961 0.199951 28.476 1.97595 29.316 3.65295C30.183 5.38995 30.6 7.49295 30.6 9.19995V20.273L46.11 28.028C46.8581 28.4014 47.4874 28.976 47.9272 29.6871C48.367 30.3982 48.6 31.2178 48.6 32.054V36.2C48.5999 36.4177 48.5524 36.6328 48.4608 36.8303C48.3692 37.0279 48.2357 37.2031 48.0696 37.3438C47.9034 37.4846 47.7086 37.5874 47.4987 37.6453C47.2888 37.7032 47.0688 37.7147 46.854 37.679L30.333 34.9249L29.208 41.684L33.162 45.638C33.3724 45.8477 33.5157 46.1153 33.5738 46.4066C33.6319 46.6979 33.6021 46.9999 33.4884 47.2743C33.3746 47.5488 33.182 47.7832 32.9348 47.948C32.6876 48.1128 32.3971 48.2005 32.1 48.2H17.1C16.803 48.2005 16.5124 48.1128 16.2653 47.948C16.0181 47.7832 15.8254 47.5488 15.7117 47.2743C15.5979 46.9999 15.5682 46.6979 15.6263 46.4066C15.6844 46.1153 15.8277 45.8477 16.038 45.638L19.995 41.684L18.867 34.9249L2.34604 37.679C2.13125 37.7147 1.91126 37.7032 1.70135 37.6453C1.49144 37.5874 1.29665 37.4846 1.13051 37.3438C0.964363 37.2031 0.830851 37.0279 0.739245 36.8303C0.64764 36.6328 0.600137 36.4177 0.600037 36.2V32.054C0.600065 31.2178 0.833054 30.3982 1.27287 29.6871C1.71269 28.976 2.34194 28.4014 3.09004 28.028L18.6 20.273V9.19995C18.6 7.49595 19.02 5.38695 19.884 3.65295Z"
      fill="white"
    />
  </svg>
);

const heartIcon = (
  <svg
    width="49"
    height="49"
    viewBox="0 0 49 49"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.66251 28.3625L21.6031 44.1781C22.3063 44.8343 23.2344 45.2 24.2 45.2C25.1656 45.2 26.0938 44.8343 26.7969 44.1781L43.7375 28.3625C46.5875 25.7093 48.2 21.9875 48.2 18.0968V17.5531C48.2 11 43.4656 5.41246 37.0063 4.33434C32.7313 3.62184 28.3813 5.01872 25.325 8.07497L24.2 9.19997L23.075 8.07497C20.0188 5.01872 15.6688 3.62184 11.3938 4.33434C4.93439 5.41246 0.200012 11 0.200012 17.5531V18.0968C0.200012 21.9875 1.81251 25.7093 4.66251 28.3625Z"
      fill="white"
    />
  </svg>
);

const reloadIconRight = (
  <svg
    width="49"
    height="49"
    viewBox="0 0 49 49"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M47.7061 0.199952H43.2614C43.109 0.19978 42.9582 0.230551 42.8181 0.2904C42.678 0.350248 42.5516 0.437927 42.4464 0.54812C42.3412 0.658312 42.2594 0.788722 42.2062 0.931442C42.1529 1.07416 42.1291 1.22622 42.1364 1.37839L42.5114 9.13714C40.3311 6.56791 37.6172 4.50456 34.5585 3.09065C31.4998 1.67675 28.1698 0.946241 24.8001 0.949952C11.9882 0.949952 1.54074 11.4059 1.55012 24.2178C1.55949 37.0503 11.9657 47.45 24.8001 47.45C30.5573 47.4581 36.1113 45.3221 40.3795 41.4584C40.4935 41.3563 40.5855 41.2321 40.6499 41.0933C40.7142 40.9545 40.7496 40.804 40.7538 40.651C40.758 40.4981 40.731 40.3459 40.6744 40.2037C40.6177 40.0616 40.5327 39.9325 40.4245 39.8243L37.237 36.6368C37.0353 36.4351 36.7644 36.3176 36.4794 36.3081C36.1943 36.2985 35.9162 36.3976 35.7014 36.5853C33.1827 38.8012 30.0485 40.1967 26.7165 40.5859C23.3845 40.9751 20.013 40.3394 17.0515 38.7635C14.09 37.1877 11.6792 34.7466 10.1405 31.7656C8.60172 28.7847 8.00817 25.4055 8.43893 22.0786C8.86969 18.7517 10.3043 15.6352 12.5515 13.1444C14.7987 10.6537 17.7517 8.90705 21.0169 8.13742C24.2821 7.36779 27.7043 7.61171 30.8273 8.83666C33.9503 10.0616 36.6258 12.2094 38.497 14.9937L28.9786 14.5371C28.8264 14.5299 28.6743 14.5536 28.5316 14.6069C28.3889 14.6602 28.2585 14.7419 28.1483 14.8471C28.0381 14.9523 27.9504 15.0788 27.8906 15.2189C27.8307 15.359 27.7999 15.5098 27.8001 15.6621V20.1068C27.8001 20.4052 27.9186 20.6913 28.1296 20.9023C28.3406 21.1133 28.6267 21.2318 28.9251 21.2318H47.7061C48.0044 21.2318 48.2906 21.1133 48.5015 20.9023C48.7125 20.6913 48.8311 20.4052 48.8311 20.1068V1.32495C48.8311 1.02658 48.7125 0.740435 48.5015 0.529457C48.2906 0.318478 48.0044 0.199952 47.7061 0.199952Z"
      fill="white"
    />
  </svg>
);

const reloadIconLeft = (
  <svg
    width="49"
    height="49"
    viewBox="0 0 49 49"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.2912 21.2312H1.50995C0.888668 21.2312 0.384949 20.7275 0.384949 20.1062V1.32495C0.384949 0.70367 0.888668 0.199951 1.50995 0.199951H6.00995C6.63123 0.199951 7.13495 0.70367 7.13495 1.32495V8.64795C11.4262 3.88236 17.6593 0.900264 24.5889 0.950607C37.4238 1.04379 47.6934 11.4153 47.6661 24.2505C47.6388 37.0679 37.24 47.45 24.4162 47.45C18.4078 47.45 12.9322 45.1706 8.80586 41.4298C8.32782 40.9965 8.30579 40.2529 8.76207 39.7967L11.9465 36.6123C12.3659 36.1928 13.0398 36.17 13.4841 36.563C16.3937 39.1377 20.2206 40.7 24.4162 40.7C33.535 40.7 40.9162 33.3203 40.9162 24.2C40.9162 15.0812 33.5365 7.69995 24.4162 7.69995C18.9322 7.69995 14.0774 10.3696 11.078 14.4812H20.2912C20.9124 14.4812 21.4162 14.9849 21.4162 15.6062V20.1062C21.4162 20.7275 20.9124 21.2312 20.2912 21.2312Z"
      fill="white"
    />
  </svg>
);
