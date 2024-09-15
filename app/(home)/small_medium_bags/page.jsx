"use client";
import React from "react";
import Steps from "../../../components/sections/home/surprise/Steps";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { faqData } from "../../../lib/constant_data";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

const Page = () => {
  return (
    <div className="text-[70%] md:text[90%] lg:text-[100%] bg-[#F5F5F5]">
      <div className="flex flex-col items-center gap-10 p-[5%] lg:p-[2%]">
        <h1 className="text-center font-extrabold text-[3.75em] uppercase">
          SMALL & LARGE BAG
        </h1>
        <p className="font-semibold text-[1em] text-center w-[80%]">
          At FoodieFinder, we offer both small and large bags with known
          contents, which gives you as a customer the opportunity to know
          exactly what you are buying and choose the size that suits your needs.
          These crates are filled with unsold, but still excellent food from
          local restaurants, bakeries and shops. Small bags contain a smaller
          number of items, perfect for one person or a small household. Large
          bags are filled with more products and are suitable for larger
          households, families or for those who want to make a substantial
          saving.
        </p>
        <img src="/small-large.png" />
      </div>
      <Steps image="/small-medium-carousal.png" />
      <div className="bg-[#F5F5F5] py-10">
        <div className="flex flex-col gap-6">
          <p className="text-center">Frequently Asked Questions</p>
          <h1 className="text-[2.188em] capitalize text-center font-extrabold">
            Questions and Answers about Surprise Box for Business
          </h1>
          <div className="flex lg:mx-14">
            <div className="mx-auto w-full divide-y flex flex-col gap-4 divide-gray-200 bg-white/5">
              <Disclosure as="div" className="px-6 border-0">
                <DisclosureButton className="group bg-white  flex w-full items-center shadow-faq1 rounded-xl justify-between p-6">
                  <span className="text-[1.125em] leading-7 font-[600] text-left text-blackThree group-hover:text-blackThree/80">
                    What is FoodieFinder, and why is it different from other
                    Food apps?
                  </span>
                  <div className="flex items-center">
                    <ChevronRightIcon className="h-6 w-6 text-blackThree/60 group-hover:text-blackThree/50 group-data-[open]:rotate-90" />
                  </div>
                </DisclosureButton>
                <DisclosurePanel className="mt-2 pb-2 text-sm text-blackThree/50">
                  {faqData}
                </DisclosurePanel>
              </Disclosure>
              <Disclosure
                as="div"
                style={{ border: 0 }}
                className="px-6 border-0"
              >
                <DisclosureButton className="group bg-white flex w-full items-center shadow-faq1 rounded-xl justify-between p-6">
                  <span className="text-[1.125em] leading-7 font-[600] text-left text-blackThree group-hover:text-blackThree/80">
                    Is FoodieFinder free to use? Is there a subscription fee?
                  </span>
                  <div className="flex items-center">
                    <ChevronRightIcon className="h-6 w-6 text-blackThree/60 group-hover:text-blackThree/50 group-data-[open]:rotate-90" />
                  </div>
                </DisclosureButton>
                <DisclosurePanel className="mt-2 pb-2 text-sm text-blackThree/50">
                  {faqData}
                </DisclosurePanel>
              </Disclosure>
              <Disclosure as="div" style={{ border: 0 }} className="px-6">
                <DisclosureButton className="group bg-white flex w-full items-center shadow-faq1 rounded-xl justify-between p-6">
                  <span className="text-[1.125em] leading-7 font-[600] text-left text-blackThree group-hover:text-blackThree/80">
                    Minus qui assumenda minus repellat.
                  </span>
                  <div className="flex items-center">
                    <ChevronRightIcon className="h-6 w-6 text-blackThree/60 group-hover:text-blackThree/50 group-data-[open]:rotate-90" />
                  </div>
                </DisclosureButton>
                <DisclosurePanel className="mt-2 pb-2 text-sm text-blackThree/50">
                  {faqData}
                </DisclosurePanel>
              </Disclosure>
              <Disclosure as="div" style={{ border: 0 }} className="px-6">
                <DisclosureButton className="group bg-white flex w-full items-center shadow-faq1 rounded-xl justify-between p-6">
                  <span className="text-[1.125em] leading-7 font-[600] text-left text-blackThree group-hover:text-blackThree/80">
                    Aut odio voluptas sed qui dolores debitis.
                  </span>
                  <div className="flex items-center">
                    <ChevronRightIcon className="h-6 w-6 text-blackThree/60 group-hover:text-blackThree/50 group-data-[open]:rotate-90" />
                  </div>
                </DisclosureButton>
                <DisclosurePanel className="mt-2 pb-2 text-sm text-blackThree/50">
                  {faqData}
                </DisclosurePanel>
              </Disclosure>
              <Disclosure as="div" style={{ border: 0 }} className="px-6">
                <DisclosureButton className="group bg-white flex w-full items-center shadow-faq1 rounded-xl justify-between p-6">
                  <span className="text-[1.125em] leading-7 font-[600] text-left text-blackThree group-hover:text-blackThree/80">
                    Placeat natus ad laboriosam voluptatem.
                  </span>
                  <div className="flex items-center">
                    <ChevronRightIcon className="h-6 w-6 text-blackThree/60 group-hover:text-blackThree/50 group-data-[open]:rotate-90" />
                  </div>
                </DisclosureButton>
                <DisclosurePanel className="mt-2 pb-2 text-sm text-blackThree/50">
                  {faqData}
                </DisclosurePanel>
              </Disclosure>
              <Disclosure as="div" style={{ border: 0 }} className="px-6">
                <DisclosureButton className="bg-white group flex w-full items-center shadow-faq1 rounded-xl justify-between p-6">
                  <span className="text-[1.125em] leading-7 font-[600] text-left text-blackThree group-hover:text-blackThree/80">
                    Qui nostrum fugit eligendi nemo ex.
                  </span>
                  <div className="flex items-center">
                    <ChevronRightIcon className="h-6 w-6 text-blackThree/60 group-hover:text-blackThree/50 group-data-[open]:rotate-90" />
                  </div>
                </DisclosureButton>
                <DisclosurePanel className="mt-2 pb-2 text-sm text-blackThree/50">
                  {faqData}
                </DisclosurePanel>
              </Disclosure>
              <Disclosure as="div" style={{ border: 0 }} className="px-6">
                <DisclosureButton className="bg-white group flex w-full items-center shadow-faq1 rounded-xl justify-between p-6">
                  <span className="text-[1.125em] leading-7 font-[600] text-left text-blackThree group-hover:text-blackThree/80">
                    Neque debitis quas quae magni error minima quae.
                  </span>
                  <div className="flex items-center">
                    <ChevronRightIcon className="h-6 w-6 text-blackThree/60 group-hover:text-blackThree/50 group-data-[open]:rotate-90" />
                  </div>
                </DisclosureButton>
                <DisclosurePanel className="mt-2 pb-2 text-sm text-blackThree/50">
                  {faqData}
                </DisclosurePanel>
              </Disclosure>
              <Disclosure as="div" style={{ border: 0 }} className="px-6">
                <DisclosureButton className="bg-white group flex w-full  items-center shadow-faq1 rounded-xl justify-between p-6">
                  <span className="text-[1.125em] leading-7 font-[600] text-left text-blackThree group-hover:text-blackThree/80">
                    Omnis sapiente vel sequi aliquid.
                  </span>
                  <div className="flex items-center">
                    <ChevronRightIcon className="h-6 w-6 text-blackThree/60 group-hover:text-blackThree/50 group-data-[open]:rotate-90" />
                  </div>
                </DisclosureButton>
                <DisclosurePanel className="mt-2 pb-2 text-sm text-blackThree/50">
                  {faqData}
                </DisclosurePanel>
              </Disclosure>
              <Disclosure as="div" style={{ border: 0 }} className="px-6">
                <DisclosureButton className="bg-white group flex w-full items-center shadow-faq1 rounded-xl justify-between p-6">
                  <span className="text-[1.125em] leading-7 font-[600] text-left text-blackThree group-hover:text-blackThree/80">
                    Commodi sint veritatis adipisci.
                  </span>
                  <div className="flex items-center">
                    <ChevronRightIcon className="h-6 w-6 text-blackThree/60 group-hover:text-blackThree/50 group-data-[open]:rotate-90" />
                  </div>
                </DisclosureButton>
                <DisclosurePanel className="mt-2 pb-2 text-sm text-blackThree/50">
                  {faqData}
                </DisclosurePanel>
              </Disclosure>
              <Disclosure as="div" style={{ border: 0 }} className="px-6">
                <DisclosureButton className="bg-white group flex w-full items-center shadow-faq1 rounded-xl justify-between p-6">
                  <span className="text-[1.125em] leading-7 font-[600] text-left text-blackThree group-hover:text-blackThree/80">
                    Repellendus iure soluta est sunt dolorem aut molestiae modi
                    ex.
                  </span>
                  <div className="flex items-center">
                    <ChevronRightIcon className="h-6 w-6 text-blackThree/60 group-hover:text-blackThree/50 group-data-[open]:rotate-90" />
                  </div>
                </DisclosureButton>
                <DisclosurePanel className="mt-2 pb-2 text-sm text-blackThree/50">
                  {faqData}
                </DisclosurePanel>
              </Disclosure>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
