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
            Terms & Conditions
          </h1>
          <p className="text-[#474747] font-medium">
            Welcome to FoodieFinder.se! By using our website and services, you
            agree to these terms of use. Please read them carefully before you
            start using the Services. If you do not accept the terms, you should
            not use FoodieFinder.se.
          </p>
          <div className="flex justify-center items-center mt-4 mb-6  md:mt-8 md:mb-10">
            <div className="w-[100%] h-[1px] bg-gradient-hr-alt" />
            {homeDivider}
            <div className="w-[100%] h-[1px] bg-gradient-hr" />
          </div>
        </div>
        <div className="relative">
          <img src="/terms.png" className="absolute top-0 right-0" />
          <div className="policies flex flex-col gap-6  lg:w-[60%]">
            <p>Last updated: 05 November 2024</p>
            <p>
              <strong>1. About FoodieFinder.se</strong>
            </p>
            <p>
              FoodieFinder.se offers a platform where users can find and book
              meals from restaurants and cafes that want to reduce food waste.
              Our service acts as an intermediary between users and restaurants
              and aims to facilitate the discovery of food options in your
              vicinity.
            </p>
            <p>
              <strong>2. User Account</strong>
            </p>
            <p>
              To use certain functions on FoodieFinder.se, you may need to
              create a user account. You are responsible for keeping your login
              details secure and for all activity that occurs under your
              account. Please notify us immediately if you suspect that your
              account has been compromised.
            </p>
            <p>
              <strong>3. Your Commitments</strong>
            </p>
            <p>When you use FoodieFinder.se, you undertake to:</p>
            <ul>
              <li>
                Enter correct and complete details when registering or making a
                booking.
              </li>
              <li>Comply with all applicable laws and regulations.</li>
              <li>Do not abuse the service or use it for illegal purposes.</li>
              <li>
                Respect restaurants and other users by behaving in a respectful
                manner.
              </li>
            </ul>
            <p>
              <strong>4. Availability of the services</strong>
            </p>
            <p>
              We strive to keep FoodieFinder.se available and functioning, but
              we cannot guarantee that the service will always be free of
              interruptions or errors. We reserve the right to change, limit or
              terminate access to all or part of the Service at any time.
            </p>
            <p>
              <strong>5. Bookings and payments</strong>
            </p>
            <p>
              When you make a reservation via FoodieFinder.se, you enter into an
              agreement directly with the selected restaurant. We only act as an
              intermediary and are not responsible for the restaurant's
              fulfillment of the reservation. All payments are made directly
              with the restaurant, and their own terms and conditions may apply.
            </p>
            <p>
              <strong>6. Right of withdrawal and cancellations</strong>
            </p>
            <p>
              As FoodieFinder.se mediates bookings of fresh products, no right
              of withdrawal applies according to the Distance Contracts Act.
              Cancellations must be made according to the specific conditions
              set by the restaurant. We recommend that you check these terms and
              conditions before making a booking.
            </p>
            <p>
              <strong>7. Limitation of Liability</strong>
            </p>
            <p>
              FoodieFinder.se is not responsible for damages or losses that may
              occur in connection with the use of our service, unless these are
              due to our willful negligence or criminality. This includes, but
              is not limited to, any quality deficiencies in food or service
              provided by the restaurants.
            </p>
            <p>
              <strong>8. Intellectual Property Rights</strong>
            </p>
            <p>
              All content on FoodieFinder.se, including texts, graphics, logos
              and other design, is protected by copyright and belongs to
              FoodieFinder.se or our licensors. You may not copy, distribute or
              otherwise use our content without our express permission.
            </p>
            <p>
              <strong>9. Changes to Terms</strong>
            </p>
            <p>
              We may update these Terms of Use from time to time to reflect
              changes in our service or applicable law. You will be notified of
              material changes, and by continuing to use the Service after the
              changes become effective, you accept the updated terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
