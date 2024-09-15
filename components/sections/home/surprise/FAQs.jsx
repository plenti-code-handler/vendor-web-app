import React, { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

export const Surprise_faqs = ({ heading, faqData }) => {
  return (
    <div className="bg-[#F5F5F5] p-[5%]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4">
          <p className="text-center">Frequently Asked Questions</p>
          <h1 className="text-[2.188em] uppercase text-center font-extrabold">
            {heading}
          </h1>
        </div>
        <div className="flex">
          <div className="mx-auto w-full divide-y flex flex-col gap-4 divide-gray-200 bg-white/5">
            {faqData.map((faq, index) => (
              <Disclosure
                key={index}
                as="div"
                className="border-none transition-all"
              >
                {({ open }) => (
                  <>
                    <DisclosureButton className="group bg-white flex w-full items-center shadow-faq1 rounded-xl justify-between p-6">
                      <span className="text-[1.125em] leading-7 font-[600] text-left text-blackThree group-hover:text-blackThree/80">
                        {faq.question}
                      </span>
                      <div className="flex items-center">
                        <ChevronRightIcon
                          className={`h-6 w-6 text-blackThree/60 group-hover:text-blackThree/50 transition-transform duration-200 ${
                            open ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </DisclosureButton>
                    <div className={`overflow-hidden `}>
                      <DisclosurePanel
                        transition
                        className="mt-2 pb-2   text-black px-6 py-4 transition duration-200 ease-in-out   data-[closed]:opacity-0"
                      >
                        {faq.answer}
                      </DisclosurePanel>
                    </div>
                  </>
                )}
              </Disclosure>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Surprise_faqs;
