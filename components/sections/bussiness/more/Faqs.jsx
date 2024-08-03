import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { faqData } from "../../../../lib/constant_data";
import FaqForm from "./FaqForm";

const Faqs = () => {
  return (
    <div className="flex h-screen w-full px-4 sm:px-10 md:px-20 lg:px-40 sm:pt-10">
      <div className="mx-auto w-full max-w-4xl divide-y divide-gray-200 rounded-xl bg-white/5">
        <Disclosure as="div" defaultOpen={true}>
          <DisclosureButton className="group flex w-full items-center justify-between py-4">
            <span className="text-[20px] font-medium text-blackThree group-hover:text-bblackThreelack/80">
              Terms and Conditions
            </span>
            <div className="flex items-center">
              <ChevronRightIcon className="h-6 w-6 text-blackThree/60 group-hover:text-blackThree/50 group-data-[open]:rotate-90" />
            </div>
          </DisclosureButton>
          <DisclosurePanel className="mt-2 pb-2 text-sm text-blackThree/50">
            {faqData}
          </DisclosurePanel>
        </Disclosure>

        <Disclosure as="div">
          <DisclosureButton className="group flex w-full items-center justify-between py-4">
            <span className="text-[20px] font-medium text-blackThree group-hover:text-blackThree/80">
              Privacy Policy
            </span>
            <div className="flex items-center">
              <ChevronRightIcon className="h-6 w-6 text-blackThree/60 group-hover:text-blackThree/50 group-data-[open]:rotate-90" />
            </div>
          </DisclosureButton>
          <DisclosurePanel className="mt-2 pb-2 text-sm text-blackThree/50">
            {faqData}
          </DisclosurePanel>
        </Disclosure>

        <Disclosure as="div">
          <DisclosureButton className="group flex w-full items-center justify-between py-4">
            <span className="text-[20px] font-medium text-blackThree group-hover:text-blackThree/80">
              Contact Support
            </span>
            <div className="flex items-center">
              <ChevronRightIcon className="h-6 w-6 text-blackThree/60 group-hover:text-blackThree/50 group-data-[open]:rotate-90" />
            </div>
          </DisclosureButton>
          <DisclosurePanel className="mt-2">
            <FaqForm />
          </DisclosurePanel>
        </Disclosure>
      </div>
    </div>
  );
};

export default Faqs;
