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
            Accessibility Policy
          </h1>
          <p className="text-[#474747] font-medium">
            At FoodieFinder.se, we strive to make our platform accessible to all
            users, regardless of ability or technical skills. Our goal is to
            ensure that all users have an equal experience when using our
            website and services.
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
              <strong>1. Our commitment to accessibility</strong>
            </p>
            <p>
              We are committed to continuously improving accessibility on
              FoodieFinder.se and follow recognized guidelines for web
              accessibility, such as Web Content Accessibility Guidelines (WCAG)
              2.1 at least level AA. We are working to make our website
              user-friendly and accessible to everyone, including people with
              disabilities.
            </p>
            <p>
              <strong>2. Accessibility features</strong>
            </p>
            <p>
              FoodieFinder.se contains several functions designed to improve
              accessibility:
            </p>
            <ul>
              <li>
                <strong>Text size and contrast:</strong> Our website offers
                clear text with sufficient contrast to improve readability.
              </li>
              <li>
                <strong>Navigation:</strong> The website is structured in a way
                that makes it easy to navigate with keyboards and aids.
              </li>
              <li>
                <strong>Alt texts for images:</strong> We use alt texts for
                images and other media to make the content accessible to users
                with visual impairments.
              </li>
              <li>
                <strong>Compatibility with assistive devices:</strong> We aim
                for our website to be compatible with screen readers and other
                assistive devices.
              </li>
            </ul>
            <p>
              <strong>3. Continuous improvement</strong>
            </p>
            <p>
              We conduct regular audits of our website to identify and fix
              accessibility issues. We welcome feedback from our users and see
              this as an important part of our continuous improvement process.
            </p>
            <p>
              <strong>4. How you can help us improve</strong>
            </p>
            <p>
              If you encounter any accessibility problems when using
              FoodieFinder.se, or if you have suggestions on how we can improve
              accessibility, please contact us. We appreciate your feedback and
              are constantly working to improve our platform for all users.
            </p>
            <p>
              <strong>Contact information:</strong>
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
