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
import React, { useEffect } from "react";

import { setActivePage } from "../../../redux/slices/headerSlice";
import { useDispatch } from "react-redux";

const Page = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("FAQs"));
  }, [dispatch]);

  return (
    <div className="text-[70%] md:text-[100%]">
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
    question:
      "What is FoodieFinder, and why is it different from other Food apps?",
    answer:
      "Odio ex ducimus consequatur. Voluptatem esse expedita id quam eos et quo earum perferendis. Beatae totam velit ut. Fuga est sint non quidem sed commodi nostrum velit. Laborum est magnam occaecati placeat id a numquam repellendus. Aut ipsa veniam ad debitis dolor. Sed alias placeat fuga. Voluptates voluptatem ea itaque consequatur qui totam et et. Eum quia dolores vel rerum quia. Eum sequi ut quasi. Enim magnam ut labore. Quia libero sit et. Inventore perferendis unde aliquam dolorem debitis aperiam. Maxime et ex eius dolores.",
  },
  {
    question:
      "What is FoodieFinder, and why is it different from other Food apps?",
    answer:
      "Odio ex ducimus consequatur. Voluptatem esse expedita id quam eos et quo earum perferendis. Beatae totam velit ut. Fuga est sint non quidem sed commodi nostrum velit. Laborum est magnam occaecati placeat id a numquam repellendus. Aut ipsa veniam ad debitis dolor. Sed alias placeat fuga. Voluptates voluptatem ea itaque consequatur qui totam et et. Eum quia dolores vel rerum quia. Eum sequi ut quasi. Enim magnam ut labore. Quia libero sit et. Inventore perferendis unde aliquam dolorem debitis aperiam. Maxime et ex eius dolores.",
  },
  {
    question:
      "What is FoodieFinder, and why is it different from other Food apps?",
    answer:
      "Odio ex ducimus consequatur. Voluptatem esse expedita id quam eos et quo earum perferendis. Beatae totam velit ut. Fuga est sint non quidem sed commodi nostrum velit. Laborum est magnam occaecati placeat id a numquam repellendus. Aut ipsa veniam ad debitis dolor. Sed alias placeat fuga. Voluptates voluptatem ea itaque consequatur qui totam et et. Eum quia dolores vel rerum quia. Eum sequi ut quasi. Enim magnam ut labore. Quia libero sit et. Inventore perferendis unde aliquam dolorem debitis aperiam. Maxime et ex eius dolores.",
  },
  {
    question:
      "What is FoodieFinder, and why is it different from other Food apps?",
    answer:
      "Odio ex ducimus consequatur. Voluptatem esse expedita id quam eos et quo earum perferendis. Beatae totam velit ut. Fuga est sint non quidem sed commodi nostrum velit. Laborum est magnam occaecati placeat id a numquam repellendus. Aut ipsa veniam ad debitis dolor. Sed alias placeat fuga. Voluptates voluptatem ea itaque consequatur qui totam et et. Eum quia dolores vel rerum quia. Eum sequi ut quasi. Enim magnam ut labore. Quia libero sit et. Inventore perferendis unde aliquam dolorem debitis aperiam. Maxime et ex eius dolores.",
  },
  {
    question:
      "What is FoodieFinder, and why is it different from other Food apps?",
    answer:
      "Odio ex ducimus consequatur. Voluptatem esse expedita id quam eos et quo earum perferendis. Beatae totam velit ut. Fuga est sint non quidem sed commodi nostrum velit. Laborum est magnam occaecati placeat id a numquam repellendus. Aut ipsa veniam ad debitis dolor. Sed alias placeat fuga. Voluptates voluptatem ea itaque consequatur qui totam et et. Eum quia dolores vel rerum quia. Eum sequi ut quasi. Enim magnam ut labore. Quia libero sit et. Inventore perferendis unde aliquam dolorem debitis aperiam. Maxime et ex eius dolores.",
  },
];
