"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Rating from "./Rating";
import Account from "./Account";
import PaymentInfo from "./PaymentInfo";

const tabs = [
  {
    name: "My Account",
    component: <Account />,
  },
  {
    name: "Payment Information",
    component: <PaymentInfo />,
  },
  {
    name: "Rating & Reviews",
    component: <Rating />,
  },
];

const Tabs = () => {
  return (
    <div className="flex">
      <div className="w-full max-w-md">
        <TabGroup>
          <TabList className="flex gap-4">
            {tabs.map(({ name }) => (
              <Tab
                key={name}
                className={({ selected }) =>
                  `relative py-1 lg:py-2 px-2 text-xs sm:text-sm lg:text-sm font-semibold focus:outline-none transition-all duration-300 ${
                    selected
                      ? "text-tabColor after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[-6px] after:h-[2px] after:bg-tabColor"
                      : "text-gray-500"
                  } hover:bg-black/5`
                }
              >
                {name}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-5">
            {tabs.map(({ component }, index) => (
              <TabPanel key={index}>
                {component}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};

export default Tabs;
