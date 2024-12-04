"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";

import { setActivePage } from "../../../redux/slices/headerSlice";
import { useDispatch } from "react-redux";

// if (typeof window !== "undefined") {
//   // Access localStorage here
//   localStorage.setItem("key", "value");
//   const value = localStorage.getItem("key");
// }

// let currLang = localStorage.getItem("lang");
let currLang = "en";

const Page = () => {
  const dispatch = useDispatch();
  const [currLangg, setCurrLang] = useState("en");

  

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("lang");
      currLang = storedLang;
      if (storedLang) {
        setCurrLang(storedLang);
      }
    }
  }, []);

  useEffect(() => {
    dispatch(setActivePage("FAQs"));
  }, [dispatch]);

  return (
    <div className="text-[75%] md:text-[100%]">
      <div className="bg-[#F5F5F5] pl-[5%] pr-[5%] pb-[5%] pt-[3%]">
        <div className="flex flex-col  ">
          <div className="text-center   mx-auto pb-[30px] md:pb-[50px]">
            <h1 className="text-[2.5em] text-[500] text-pinkBgDark font-semibold uppercase">
              Frequently Asked Questions
            </h1>
            <p className="text-[#474747] font-medium">Read all the FAQs</p>
          </div>
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

export default Page;

const faqData = [
  {
    question: `What is FoodieFinder?`,
    answer:
      "FoodieFinder is a platform that helps you save food from being thrown away. Through our app, you can buy unsold goods from local shops, restaurants, bakeries and hotels at discounted prices, while helping to reduce food waste.",
  },
  {
    question: "How does FoodieFinder work?",
    answer:
      "Download the app, create an account and start exploring available groceries near you. You reserve cash registers directly in the app and pick them up at a specified time from the store, restaurant or hotel in question.",
  },
  {
    question: "What is a surprise bag?",
    answer:
      "A surprise bag contains unsold items, but you won't know exactly what you'll get until you pick it up. It is a way to save food and get a mix of different products at a low price.",
  },
  {
    question:
      "What is the difference between a surprise box and a box with known contents?",
    answer:
      "With a surprise bag, you get a mix of items that the store or restaurant chooses, and the contents are a surprise. A bag with known contents, on the other hand, gives you full information about what is included, so you know exactly which products you are buying.",
  },
  {
    question: "What sizes are available on bags with known contents?",
    answer:
      "FoodieFinder offers both Small and Large bags with known contents: \n- Small Kasse: Perfect for smaller households or individual meals, contains a smaller number of items with a short date, but at a significantly reduced price. \n- Large Kasse: Ideal for larger households or more meals, contains a larger selection of goods, giving more food for the money.",
  },
  {
    question: "What types of businesses are included in FoodieFinder?",
    answer:
      "In addition to local shops and restaurants, hotels, cafes and other eateries are also part of the FoodieFinder network. The range varies depending on where you are, but the platform is open to all eateries that want to reduce their food waste.",
  },
  {
    question: "How do I know when and where to pick up my box?",
    answer:
      "All information about collection time and location is available in the app once you have reserved your box. It is important to follow the specified times to ensure that the food is kept fresh.",
  },
  {
    question: "What happens if I don't pick up my box on time?",
    answer:
      "If you do not collect your box within the specified time frame, it may be lost, and you risk losing the payment. Be sure to pick up your box on time.",
  },
  {
    question: "How do I pay for my box?",
    answer:
      "All payments are made via the app when you reserve your box. Payment is smooth and secure, making the process easy for both you and the business.",
  },
  {
    question: "Can I cancel an order?",
    answer:
      "Unfortunately, since the crates consist of goods with a short date, cancellations cannot be made after you have reserved a crate. Make sure you can pick up the till before making a reservation.",
  },
  {
    question: `What happens if I'm not happy with my ${
      currLang === "en" ? "bag" : "pouch"
    }?`,
    answer:
      "If you are unhappy with the contents of your box, contact our support via the app and we will help you resolve the issue.",
  },
  {
    question: "How can I as a business join FoodieFinder?",
    answer:
      "Businesses, including hotels, retail stores, and restaurants, can easily connect to FoodieFinder to reduce food waste and increase their revenue from unsold goods. Contact us via our website and we will help you get started.",
  },
  {
    question: "Why should I use FoodieFinder?",
    answer:
      "FoodieFinder helps you save food and save money, while helping to reduce food waste and thus reduce your climate footprint.",
  },
  {
    question: "Is it safe to buy food via FoodieFinder?",
    answer:
      "All our partners follow strict rules for food safety. The food is still fully edible, even if it is approaching its best before date.",
  },
  {
    question: "How does FoodieFinder affect the environment?",
    answer:
      "By reducing food waste, we save resources that would otherwise be wasted. Every time you save a box of food, you help reduce carbon dioxide emissions and save energy that would otherwise be used for production and waste management.",
  },
  {
    question: "Where can I download the app?",
    answer:
      "The FoodieFinder app is available to download for both iOS and Android via the App Store and Google Play.",
  },
];
