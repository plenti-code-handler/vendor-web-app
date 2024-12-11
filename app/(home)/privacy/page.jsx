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
            Welcome to FoodieFinder.se! Your privacy is important to us, and we
            are committed to safeguarding your personal information. This
            Privacy Policy explains what information we collect, how we use it,
            and your rights regarding your data.
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
            <p>Last updated: 11 December 2024</p>

            <p>
              <strong>1. Information We Collect</strong>
            </p>
            <p>
              When you use FoodieFinder.se, we collect certain types of
              information to enhance our services and improve your experience:
            </p>
            <ul>
              <li>
                <strong>Personal Information</strong>: Your name, email address,
                phone number, and other details you voluntarily provide when
                creating an account, contacting us, or completing your profile.
              </li>
              <li>
                <strong>Location Information</strong>: Data about your location
                is collected to provide recommendations and services relevant to
                your area. This may include real-time location data or data
                collected when using location-based features.
              </li>
              <li>
                <strong>Profile Picture Access</strong>: To customize your
                profile, we request access to your photo gallery so you can
                upload a profile picture.
              </li>
              <li>
                <strong>Usage Data</strong>: Information such as pages visited,
                IP addresses, device details, and browser type to understand
                user engagement and improve our offerings.
              </li>
              <li>
                <strong>Vendor Information</strong>: If you&rsquo;re a vendor,
                we request your IBAN number to process revenue transfers by the
                admin upon withdrawal requests.
              </li>
              <li>
                <strong>Cookies and Related Technologies</strong>: We use
                cookies to personalize your experience and analyze platform use.
                For details, please see our{" "}
                <a href="https://foodiefinder.se/cookie_policy">
                  Cookie Policy
                </a>
                .
              </li>
            </ul>
            <p>
              <strong>2. How We Use Your Information</strong>
            </p>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li>
                <strong>Service Enhancement</strong>: To ensure optimal
                functionality and performance of our website and app.
              </li>
              <li>
                <strong>Communication</strong>: To keep you informed about your
                account, respond to support requests, and handle inquiries.
              </li>
              <li>
                <strong>Customization</strong>: To tailor content and offers
                based on your interests and location.
              </li>
              <li>
                <strong>Usage Analysis</strong>: To analyze trends and behavior
                for improving our services and products.
              </li>
            </ul>
            <p>
              <strong>3. Sharing of Your Information</strong>
            </p>
            <p>
              We respect your privacy and only share your information under
              specific circumstances:
            </p>
            <ul>
              <li>
                <strong>Service Providers</strong>: We collaborate with trusted
                partners to deliver and improve our services. These partners
                adhere to data protection agreements and use your information
                solely to provide their services.
              </li>
              <li>
                <strong>Legal Obligations</strong>: We may disclose your
                information to comply with legal requirements, regulations, or
                government requests.
              </li>
              <li>
                <strong>Business Transitions</strong>: In the event of a merger,
                acquisition, restructuring, or sale of FoodieFinder.se, your
                information may be transferred to the new owner with appropriate
                confidentiality measures.
              </li>
            </ul>
            <p>
              <strong>4. Security of Your Information</strong>
            </p>
            <p>
              We implement reasonable security measures to protect your data
              from unauthorized access, alteration, or loss. However, please
              note that no data transmission over the internet can be guaranteed
              as fully secure.
            </p>
            <p>
              <strong>5. Your Rights and Choices</strong>
            </p>
            <p>You have several rights regarding your personal data::</p>
            <ul>
              <li>
                <strong>Access Your Data</strong>: You can request details of
                the personal data we hold about you.
              </li>
              <li>
                <strong>Correct Your Data</strong>: If you find inaccuracies in
                your information, you can request corrections.
              </li>
              <li>
                <strong>Delete Your Data</strong>: You can request the deletion
                of your data. To delete your account and all associated data,
                please use this link: [https://forms.gle/2qbP8iqNDAqZEy1p8].
              </li>
              <li>
                <strong>Withdraw Consent</strong>: Where data processing relies
                on your consent, you may withdraw it at any time. This
                withdrawal does not affect the legality of processing conducted
                prior to withdrawal.
              </li>
            </ul>
            <p>
              <strong>6. Use of Cookies</strong>
            </p>
            <p>
              We use cookies and similar technologies to improve your experience
              and gather data on platform usage. For more information about
              managing cookies, please see our{" "}
              <a href="https://foodiefinder.se/cookie_policy">Cookie Policy</a>.
            </p>
            <p>
              <strong>7. Updates to This Privacy Policy</strong>
            </p>
            <p>
              We may update this Privacy Policy periodically to reflect changes
              in our services or to comply with new legal requirements. We
              recommend checking this page regularly for the latest updates.
            </p>
            <p>
              <strong>8. Contact Us</strong>
            </p>
            <p>
              For any questions or concerns about this Privacy Policy or our
              data practices, please contact us:
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
