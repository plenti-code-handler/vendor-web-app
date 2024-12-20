"use client";

import { homeDivider } from "../../../svgs";
import React, { useEffect } from "react";

import { setActivePage } from "../../../redux/slices/headerSlice";
import { useDispatch } from "react-redux";

const Page = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage(""));
  }, [dispatch]);

  return (
    <div className="text-[75%] md:text-[100%]">
      <div className="bg-[#F5F5F5] pl-[5%] pr-[5%] pb-[5%] pt-[3%]">
        <div className="text-center lg:w-[60%] mx-auto">
          <h1 className="text-[2.5em] text-[500] text-blueBgDark font-semibold uppercase">
            Cookie Policy
          </h1>
          <p className="text-[#474747] font-medium">
            At Plenti.se we use cookies and similar technologies to
            improve your experience on our website. This policy explains what
            cookies are, how we use them, and what choices you have regarding
            cookies on our website.
          </p>
          <div className="flex justify-center items-center mt-4 mb-6  md:mt-8 md:mb-10">
            <div className="w-[100%] h-[1px] bg-gradient-hr-alt" />
            {homeDivider}
            <div className="w-[100%] h-[1px] bg-gradient-hr" />
          </div>
        </div>
        <div className="relative">
          <div className="policies flex flex-col gap-6   ">
            <p>Last updated: 05 November 2024</p>
            <p>
              <strong>1. What are cookies?</strong>
            </p>
            <p>
              Cookies are small text files that are stored on your device when
              you visit a website. They help us recognize your device and
              remember information about your visit, which can improve your
              experience on the website, such as keeping you logged in or saving
              your preferences.
            </p>
            <p>
              <strong>2. How we use cookies</strong>
            </p>
            <p>
              We use cookies on Plenti.se for various purposes, including:
            </p>
            <ul>
              <li>
                Necessary cookies: These cookies are essential for our website
                to function properly and allow you to navigate and use our basic
                features, such as accessing secure areas.
              </li>
              <li>
                Performance cookies: We use these cookies to collect anonymous
                statistics about how users interact with our website. This
                information helps us improve the site's functionality and
                understand which parts are most useful to our visitors.
              </li>
              <li>
                Functionality cookies: These cookies enable us to remember your
                choices (for example, your language or region) and improve your
                experience by offering more personalized features.
              </li>
              <li>
                Marketing cookies: We use these cookies to show you ads that are
                relevant to you based on your interests and to measure how
                effective our campaigns are.
              </li>
            </ul>
            <p>
              <strong>3. Third party cookies</strong>
            </p>
            <p>
              We may also allow third-party services such as social media or
              advertising networks to place cookies on your device when you
              visit Plenti.se. These cookies are controlled by the
              respective third-party providers and are often used to track your
              activities across different websites.
            </p>
            <p>
              <strong>4. Your choices regarding cookies</strong>
            </p>
            <p>
              You have the option to control and manage cookies in different
              ways. You can set your browser to block all cookies or to warn you
              when cookies are being sent. However, please note that if you
              choose to block or delete cookies, some parts of our website may
              stop working properly.
            </p>
            <p>
              To manage your cookie settings in your browser, visit your
              browser's help section or settings to learn how to change your
              cookie preferences.
            </p>
            <p>
              <strong>5. Changes to our cookie policy</strong>
            </p>
            <p>
              We may update this cookie policy from time to time to reflect
              changes in how we use cookies or due to changes in the law. Any
              changes will be posted on this page, and we encourage you to
              regularly review this policy to stay informed about how we use
              cookies.
            </p>
            <p>
              <strong>6. Contact information</strong>
            </p>
            <p>
              If you have any questions about our use of cookies or this policy,
              please contact us at:
            </p>
            <p>
              Email:{" "}
              <a href="mailto:kontakt@foodiefinder.se">
                kontakt@foodiefinder.se
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
