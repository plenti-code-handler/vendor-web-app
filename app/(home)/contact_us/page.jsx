"use client";
import React, { useEffect } from "react";

import { homeDivider } from "../../../svgs";
import { Input, Textarea } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../../redux/slices/headerSlice";

const Page = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("Contact Us"));
  }, [dispatch]);

  return (
    <div className="bg-[#F5F5F5] py-10">
      <div className="mx-14">
        <div className="text-center lg:w-[60%] mx-auto">
          <h1 className="text-[48px] text-[500] text-pinkBgDark">Contact Us</h1>
          <p className="text-[#474747]">
            Have questions or feedback? We're here to assist you! Reach out to
            our team, and we'll ensure you have all the information you need for
            a great experience.
          </p>
          <div className="flex justify-center items-center my-10">
            <div className="w-[100%] h-[1px] bg-gradient-hr-alt" />
            {homeDivider}
            <div className="w-[100%] h-[1px] bg-gradient-hr" />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex h-full flex-col py-5 w-[896px]">
            <div className="text-[70%] md:text-[100%]">
              <div className="mx-10 flex flex-col gap-8">
                <div className="flex md:flex-row flex-col font-[400] text-[1.5em] items-center justify-between">
                  <p>Or drop us a line</p>
                  <p>
                    {" "}
                    <a
                      className="underline hover:text-pinkBgDark"
                      href="mailto:kontakt@foodiefinder.se"
                    >
                      kontakt@foodiefinder.se
                    </a>
                  </p>
                </div>
                <div className="flex md:flex-row flex-col md:items-center gap-5 justify-between">
                  <div className="flex flex-col gap-3 basis-full">
                    <label>Name *</label>
                    <Input className="px-4 w-full bg-transparent rounded-[6px] h-[60px] border-2 border-[#404146]" />
                  </div>
                  <div className="flex flex-col gap-3 basis-full">
                    <label>Email *</label>
                    <Input className="px-4 w-full bg-transparent rounded-[6px] h-[60px] border-2 border-[#404146]" />
                  </div>
                </div>
                <div className="flex flex-col gap-3 basis-full">
                  <label>Message *</label>
                  <Textarea
                    rows={5}
                    className="p-4 w-full rounded-[6px] bg-transparent border-2 border-[#404146]"
                  />
                </div>
                <button className="flex self-center justify-center bg-pinkBgDark text-white font-bold py-3 px-4 rounded hover:bg-pinkBgDarkHover2 w-full sm:w-auto sm:px-6 lg:w-[35%]">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
