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
            <p>Last updated: 03 November 2024</p>

            <p>
              <strong>1. Information We Collect</strong>
            </p>
            <p>
              When you use FoodieFinder.se, we gather certain types of
              information to improve our services and enhance your experience:
            </p>
            <ul>
              <li>
                <strong>Personal Information</strong>: This includes details
                like your name, email, and phone number, along with any other
                information you voluntarily provide while creating an account,
                reaching out to us, or completing your profile.
              </li>
              <li>
                <strong>Location Information</strong>: We collect data about
                your location to provide recommendations and services that are
                relevant to your area. This may involve real-time location data
                or data collected while you use location-based features.
              </li>
              <li>
                <strong>Profile Picture Access</strong>: To allow profile
                customization, we request access to your photo gallery so you
                can upload a profile picture for display within your account.
              </li>
              <li>
                <strong>Usage Data</strong>: Information on how you interact
                with our app and website, including pages visited, IP address,
                device details, and browser type, helps us understand user
                engagement and improve our offerings.
              </li>
              <li>
                <strong>Vendor Information</strong>: If you&rsquo;re a vendor,
                we&rsquo;ll request your IBAN number for processing revenue
                transfers by the admin when withdrawals are requested.
              </li>
              <li>
                <strong>Cookies and Related Technologies</strong>: We use
                cookies to personalize your experience and analyze platform use.
                For more information, please see our{" "}
                <a href="https://foodiefinder.se/cookie_policy">
                  Cookie Policy
                </a>
                .
              </li>
            </ul>
            <p>
              <strong>2. How We Use Your Information</strong>
            </p>
            <p>We use your information for a variety of purposes, including:</p>
            <ul>
              <li>
                <strong>Service Enhancement</strong>: To ensure optimal
                functionality and performance of our website and app.
              </li>
              <li>
                <strong>Communication</strong>: To keep you informed about your
                account, respond to support requests, and handle other
                inquiries.
              </li>
              <li>
                <strong>Customization</strong>: To tailor content and offers to
                your interests and location.
              </li>
              <li>
                <strong>Usage Analysis</strong>: To analyze usage trends and
                behavior to inform improvements to our services and products.
              </li>
            </ul>
            <p>
              <strong>3. Sharing of Your Information</strong>
            </p>
            <p>
              We value your privacy and only share your information with third
              parties under these specific circumstances:
            </p>
            <ul>
              <li>
                <strong>Service Providers</strong>: We work with trusted
                partners who assist us in delivering and improving our services.
                These partners are required to adhere to data protection
                agreements and use your information only as needed to provide
                their services.
              </li>
              <li>
                <strong>Legal Obligations</strong>: If necessary, we may
                disclose your information to comply with legal requirements,
                regulations, or government requests.
              </li>
              <li>
                <strong>Business Transitions</strong>: In the event of a merger,
                acquisition, restructuring, or sale of FoodieFinder.se, your
                information may be transferred to the new owner, with applicable
                confidentiality measures.
              </li>
            </ul>
            <p>
              <strong>4. Security of Your Information</strong>
            </p>
            <p>
              We implement reasonable security measures to help protect your
              data from unauthorized access, alteration, or loss. While we work
              to maintain a high standard of security, please remember that no
              data transmission over the internet can be guaranteed as fully
              secure.
            </p>
            <p>
              <strong>5. Your Rights and Choices</strong>
            </p>
            <p>You have several rights concerning your personal data:</p>
            <ul>
              <li>
                <strong>Access Your Data</strong>: You can request details of
                the personal data we hold about you.
              </li>
              <li>
                <strong>Correct Your Data</strong>: If you find inaccuracies in
                your information, you have the right to request corrections.
              </li>
              <li>
                <strong>Delete Your Data</strong>: In certain cases, you can
                request deletion of your data. To delete all your data and
                account, please use this link:
                [https://forms.gle/2qbP8iqNDAqZEy1p8].
              </li>
              <li>
                <strong>Withdraw Consent</strong>: Where we rely on your consent
                for data processing, you may withdraw your consent at any time.
                This withdrawal does not affect the legality of processing
                conducted prior to withdrawal.
              </li>
            </ul>
            <p>
              <strong>6. Use of Cookies</strong>
            </p>
            <p>
              We use cookies and similar technologies to improve your experience
              and gather data on platform usage. For more information on
              managing cookies, please see our [Cookie Policy].
            </p>
            <p>
              <strong>7. Updates to This Privacy Policy</strong>
            </p>
            <p>
              We may periodically update this Privacy Policy to reflect changes
              in our services or to comply with new legal requirements. We
              recommend checking this page from time to time for the latest
              updates.
            </p>
            <p>
              <strong>8. Contact Us</strong>
            </p>
            <p>
              For any questions or concerns regarding this Privacy Policy or our
              data practices, please contact us at:
            </p>
            <p>
              <strong>Email</strong>: <u>kontakt@foodiefinder.se</u>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
