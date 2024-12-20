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
            Security Policy
          </h1>
          <p className="text-[#474747] font-medium">
            At Plenti.se, we take your security and privacy very seriously. We
            are committed to protecting your personal information and ensuring
            that your user experience is secure. This security policy describes
            the measures we take to protect information and how we handle
            security issues on our platform.
          </p>
          <div className="flex justify-center items-center mt-4 mb-6  md:mt-8 md:mb-10">
            <div className="w-[100%] h-[1px] bg-gradient-hr-alt" />
            {homeDivider}
            <div className="w-[100%] h-[1px] bg-gradient-hr" />
          </div>
        </div>
        <div className="relative">
          <div className="policies flex flex-col gap-6   ">
            <div>
              <div>Last updated: 05 November 2024</div>
            </div>
            <p>
              <strong>1. Purpose and scope</strong>
            </p>
            <p>
              This security policy applies to all users of Plenti.se and
              describes the security measures we have implemented to protect
              personal data, payment information and other sensitive data
              collected through our platform.
            </p>
            <p>
              <strong>2. Data security</strong>
            </p>
            <p>
              We use modern security techniques and procedures to protect your
              data against unauthorized access, alteration, disclosure or
              destruction. Our security measures include:
            </p>
            <ul>
              <li>
                <strong>Encryption:</strong> All data transmitted between your
                browser and our website is protected with Secure Socket Layer
                (SSL) encryption to ensure that information is kept secure in
                transit.
              </li>
              <li>
                <strong>Secure storage:</strong> Personal and payment
                information is stored on secure servers protected by firewalls
                and other security protocols to prevent unauthorized access.
              </li>
              <li>
                <strong>Restricted access:</strong> Only authorized personnel
                have access to sensitive information, and access is strictly
                controlled and limited to what is required to perform specific
                job duties.
              </li>
            </ul>
            <p>
              <strong>3. Security of payment</strong>
            </p>
            <p>
              For payments, we use trusted third-party providers certified to
              industry standards (eg PCI DSS) for payment security. Plenti.se
              does not store your payment information; all payment processing is
              handled directly by our payment partners, which further ensures
              that your payment details are protected.
            </p>
            <p>
              <strong>4. User Responsibilities</strong>
            </p>
            <p>
              As a user, you also play an important role in protecting your own
              information:
            </p>
            <ul>
              <li>
                <strong>Password security:</strong> Create strong, unique
                passwords for your account and never share your login
                information with others. We recommend that you change your
                password regularly and use a password manager.
              </li>
              <li>
                <strong>Suspicious Activity:</strong> If you notice any
                suspicious activity on your account, please contact us
                immediately so we can investigate and take steps to protect your
                account.
              </li>
            </ul>
            <p>
              <strong>5. Incident management</strong>
            </p>
            <p>
              We have established procedures to deal with any security
              incidents:
            </p>
            <ul>
              <li>
                <strong>Detection and response:</strong> Upon detection of a
                security incident, our security team acts immediately to contain
                the threat and minimize the impact.
              </li>
              <li>
                <strong>Incident reporting:</strong> We will notify affected
                users as soon as possible if there is a data security breach
                affecting their personal information, and we will cooperate with
                relevant authorities in accordance with applicable laws.
              </li>
            </ul>
            <p>
              <strong>6. Continuous improvement</strong>
            </p>
            <p>
              Security is an ongoing process, and we are constantly improving
              our security measures to address emerging threats and ensure we
              adhere to industry best practices. We carry out regular security
              reviews and update our systems and procedures as new risks are
              identified.
            </p>
            <p>
              <strong>7. Changes to the Security Policy</strong>
            </p>
            <p>
              This security policy may be updated to reflect changes in our
              security practices or to meet new legal requirements. We encourage
              you to regularly review this policy to stay informed about how we
              protect your information.
            </p>
            <p>
              <strong>8. Contact information</strong>
            </p>
            <p>
              If you have questions about our security policy or need to report
              a security issue, please contact us:
            </p>
            <p>
              Email:{" "}
              <a href="mailto:kontakt@foodiefinder.se">
                kontakt@foodiefinder.se
              </a>
            </p>
            <p>
              We at Plenti.se are here to ensure that your user experience is as
              secure as possible and that your personal data is protected in the
              best possible way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
