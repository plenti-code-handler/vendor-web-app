"use client";

import { homeDivider } from "../../../svgs";
import React, { useEffect } from "react";

import { setActivePage } from "../../../redux/slices/headerSlice";
import { useDispatch } from "react-redux";

const page = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage(""));
  }, [dispatch]);

  return (
    <div className="text-[75%] md:text-[100%]">
      <div className="bg-[#F5F5F5] pl-[5%] pr-[5%] pb-[5%] pt-[3%]">
        <div className="text-center lg:w-[60%] mx-auto">
          <h1 className="text-[2.5em] text-[500] text-pinkBgDark font-semibold uppercase">
            Privacy Policy
          </h1>
          <p className="text-[#474747] font-medium">
            Your privacy is important to us at FoodieFinder.se, and we are
            determined to protect the personal data you share with us. In this
            privacy policy, we describe how we collect, use and protect your
            data when you visit and use our service.
          </p>
          <div className="flex justify-center items-center mt-4 mb-6  md:mt-8 md:mb-10">
            <div className="w-[100%] h-[1px] bg-gradient-hr-alt" />
            {homeDivider}
            <div className="w-[100%] h-[1px] bg-gradient-hr" />
          </div>
        </div>
        <div className="relative">
          <img src="/privacy.png" className="absolute top-0 right-0" />
          <div className="policies flex flex-col gap-6  lg:w-[60%]">
            <p>Last updated: 15 Septemeber 2024</p>

            <p>
              <strong>1. What information we collect</strong>
            </p>
            <p>
              When you use FoodieFinder.se, we can collect the following types
              of information:
            </p>
            <ul>
              <li>
                <strong>Personal Data:</strong> This includes data such as name,
                email address and other information you voluntarily provide when
                creating an account or contacting us.
              </li>
              <li>
                <strong>Usage Information:</strong> Data about your interaction
                with our website, such as which pages you visit, your IP address
                and your browser type.
              </li>
              <li>
                <strong>Cookies and similar technologies:</strong> We use
                cookies to improve your experience and analyze how you use our
                website. For more information, see our [Cookie Policy].
              </li>
            </ul>
            <p>
              <strong>2. How we use your information</strong>
            </p>
            <p>We process your data for various purposes, including:</p>
            <ul>
              <li>To operate and improve our website and services.</li>
              <li>
                To communicate with you regarding your account, support matters
                or to answer your questions.
              </li>
              <li>
                To personalize your experience and offer content and offers that
                are relevant to you.
              </li>
              <li>
                To analyze and understand user behavior to improve our services
                and products.
              </li>
              <li>
                To send marketing materials and other information, provided you
                have given your consent to this.
              </li>
            </ul>
            <p>
              <strong>3. Sharing of Your Information</strong>
            </p>
            <ul>
              <li>
                We do not share your personal data with third parties except in
                the following circumstances:
              </li>
              <li>
                <strong>Service providers:</strong> We may work with trusted
                parties who help us deliver and improve our services.
              </li>
              <li>
                <strong>Legal requirements:</strong> We may need to share
                information to comply with laws, regulations or legal requests.
              </li>
              <li>
                <strong>Business Changes:</strong> If we were to undergo a
                merger, restructuring or sale, your information may be
                transferred as part of this process.
              </li>
            </ul>
            <p>
              <strong>4. Security of your information</strong>
            </p>
            <p>
              We use reasonable security measures to protect your information
              from unauthorized access and use. We strive to maintain high
              standards of our security procedures, but we cannot guarantee that
              data transmissions over the Internet are completely secure.
            </p>
            <p>
              <strong>5. Your rights and choices</strong>
            </p>
            <p>You have the right to:</p>
            <ul>
              <li>
                Request information about the personal data we process about
                you.
              </li>
              <li>Correct incorrect or incomplete information.</li>
              <li>Request deletion of your data in certain cases.</li>
              <li>
                Withdraw your consent for specific treatments if the treatment
                is based on consent.
              </li>
            </ul>
            <p>
              <strong>6. Use of cookies</strong>
            </p>
            <p>
              For details on how we use cookies and similar technologies, and
              how you can manage them, see our [Cookie Policy].
            </p>
            <p>
              <strong>7. Changes to this Privacy Policy</strong>
            </p>
            <p>
              We may update this policy to reflect changes in our services or
              legal requirements. We encourage you to regularly check this page
              for the latest updates.
            </p>
            <p>
              <strong>8. Contact</strong>
            </p>
            <p>
              Do you have any questions or concerns about our privacy policy or
              how we handle your personal data? You can contact us at:
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

export default page;
