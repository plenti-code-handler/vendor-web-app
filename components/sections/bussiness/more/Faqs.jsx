"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { faqData } from "../../../../lib/constant_data";
import FaqForm from "./FaqForm";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../../../redux/slices/headerSlice";
import { useEffect } from "react";

const Faqs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("More"));
  }, [dispatch]);

  return (
    <div className="flex w-full px-4 sm:px-10 md:px-20 lg:px-40 sm:pt-15">
      <div className="mx-auto w-full max-w-4xl divide-y divide-gray-200 rounded-xl bg-white/5">
        <Disclosure as="div">
          <DisclosureButton className="group flex w-full items-center justify-between py-4">
            <span className="text-xl font-medium text-blackThree group-hover:text-blackThree/80">
              Terms and Conditions
            </span>
            <div className="flex items-center">
              <ChevronRightIcon className="h-6 w-6 text-blackThree/60 group-hover:text-blackThree/50 group-data-[open]:rotate-90" />
            </div>
          </DisclosureButton>
          <DisclosurePanel className="mt-2 pb-2 text-sm text-blackThree/50">
            <div className="policies flex flex-col gap-6  lg:w-[60%]">
              <p>Last updated: 05 November 2024</p>
              <p>
                <strong>1. About FoodieFinder.se</strong>
              </p>
              <p>
                FoodieFinder.se offers a platform where users can find and book
                meals from restaurants and cafes that want to reduce food waste.
                Our service acts as an intermediary between users and
                restaurants and aims to facilitate the discovery of food options
                in your vicinity.
              </p>
              <p>
                <strong>2. User Account</strong>
              </p>
              <p>
                To use certain functions on FoodieFinder.se, you may need to
                create a user account. You are responsible for keeping your
                login details secure and for all activity that occurs under your
                account. Please notify us immediately if you suspect that your
                account has been compromised.
              </p>
              <p>
                <strong>3. Your Commitments</strong>
              </p>
              <p>When you use FoodieFinder.se, you undertake to:</p>
              <ul>
                <li>
                  Enter correct and complete details when registering or making
                  a booking.
                </li>
                <li>Comply with all applicable laws and regulations.</li>
                <li>
                  Do not abuse the service or use it for illegal purposes.
                </li>
                <li>
                  Respect restaurants and other users by behaving in a
                  respectful manner.
                </li>
              </ul>
              <p>
                <strong>4. Availability of the services</strong>
              </p>
              <p>
                We strive to keep FoodieFinder.se available and functioning, but
                we cannot guarantee that the service will always be free of
                interruptions or errors. We reserve the right to change, limit
                or terminate access to all or part of the Service at any time.
              </p>
              <p>
                <strong>5. Bookings and payments</strong>
              </p>
              <p>
                When you make a reservation via FoodieFinder.se, you enter into
                an agreement directly with the selected restaurant. We only act
                as an intermediary and are not responsible for the restaurant's
                fulfillment of the reservation. All payments are made directly
                with the restaurant, and their own terms and conditions may
                apply.
              </p>
              <p>
                <strong>6. Right of withdrawal and cancellations</strong>
              </p>
              <p>
                As FoodieFinder.se mediates bookings of fresh products, no right
                of withdrawal applies according to the Distance Contracts Act.
                Cancellations must be made according to the specific conditions
                set by the restaurant. We recommend that you check these terms
                and conditions before making a booking.
              </p>
              <p>
                <strong>7. Limitation of Liability</strong>
              </p>
              <p>
                FoodieFinder.se is not responsible for damages or losses that
                may occur in connection with the use of our service, unless
                these are due to our willful negligence or criminality. This
                includes, but is not limited to, any quality deficiencies in
                food or service provided by the restaurants.
              </p>
              <p>
                <strong>8. Intellectual Property Rights</strong>
              </p>
              <p>
                All content on FoodieFinder.se, including texts, graphics, logos
                and other design, is protected by copyright and belongs to
                FoodieFinder.se or our licensors. You may not copy, distribute
                or otherwise use our content without our express permission.
              </p>
              <p>
                <strong>9. Changes to Terms</strong>
              </p>
              <p>
                We may update these Terms of Use from time to time to reflect
                changes in our service or applicable law. You will be notified
                of material changes, and by continuing to use the Service after
                the changes become effective, you accept the updated terms.
              </p>
            </div>
          </DisclosurePanel>
        </Disclosure>

        <Disclosure as="div">
          <DisclosureButton className="group flex w-full items-center justify-between py-4">
            <span className="text-xl font-medium text-blackThree group-hover:text-blackThree/80">
              Privacy Policy
            </span>
            <div className="flex items-center">
              <ChevronRightIcon className="h-6 w-6 text-blackThree/60 group-hover:text-blackThree/50 group-data-[open]:rotate-90" />
            </div>
          </DisclosureButton>
          <DisclosurePanel className="mt-2 pb-2 text-sm text-blackThree/50">
            <div className="policies flex flex-col gap-6  lg:w-[60%]">
              <p>Last updated: 05 November 2024</p>

              <p>
                <strong>1. What information we collect</strong>
              </p>
              <p>
                When you use FoodieFinder.se, we can collect the following types
                of information:
              </p>
              <ul>
                <li>
                  <strong>Personal Data:</strong> This includes data such as
                  name, email address and other information you voluntarily
                  provide when creating an account or contacting us.
                </li>
                <li>
                  <strong>Usage Information:</strong> Data about your
                  interaction with our website, such as which pages you visit,
                  your IP address and your browser type.
                </li>
                <li>
                  <strong>Cookies and similar technologies:</strong> We use
                  cookies to improve your experience and analyze how you use our
                  website. For more information, see our [Cookie Policy].
                </li>
              </ul>
              <p>
                <strong>2. How we use your information</strong>
              </p>
              <p>We process your data for various purposes, including:</p>
              <ul>
                <li>To operate and improve our website and services.</li>
                <li>
                  To communicate with you regarding your account, support
                  matters or to answer your questions.
                </li>
                <li>
                  To personalize your experience and offer content and offers
                  that are relevant to you.
                </li>
                <li>
                  To analyze and understand user behavior to improve our
                  services and products.
                </li>
                <li>
                  To send marketing materials and other information, provided
                  you have given your consent to this.
                </li>
              </ul>
              <p>
                <strong>3. Sharing of Your Information</strong>
              </p>
              <ul>
                <li>
                  We do not share your personal data with third parties except
                  in the following circumstances:
                </li>
                <li>
                  <strong>Service providers:</strong> We may work with trusted
                  parties who help us deliver and improve our services.
                </li>
                <li>
                  <strong>Legal requirements:</strong> We may need to share
                  information to comply with laws, regulations or legal
                  requests.
                </li>
                <li>
                  <strong>Business Changes:</strong> If we were to undergo a
                  merger, restructuring or sale, your information may be
                  transferred as part of this process.
                </li>
              </ul>
              <p>
                <strong>4. Security of your information</strong>
              </p>
              <p>
                We use reasonable security measures to protect your information
                from unauthorized access and use. We strive to maintain high
                standards of our security procedures, but we cannot guarantee
                that data transmissions over the Internet are completely secure.
              </p>
              <p>
                <strong>5. Your rights and choices</strong>
              </p>
              <p>You have the right to:</p>
              <ul>
                <li>
                  Request information about the personal data we process about
                  you.
                </li>
                <li>Correct incorrect or incomplete information.</li>
                <li>Request deletion of your data in certain pouches.</li>
                <li>
                  Withdraw your consent for specific treatments if the treatment
                  is based on consent.
                </li>
              </ul>
              <p>
                <strong>6. Use of cookies</strong>
              </p>
              <p>
                For details on how we use cookies and similar technologies, and
                how you can manage them, see our [Cookie Policy].
              </p>
              <p>
                <strong>7. Changes to this Privacy Policy</strong>
              </p>
              <p>
                We may update this policy to reflect changes in our services or
                legal requirements. We encourage you to regularly check this
                page for the latest updates.
              </p>
              <p>
                <strong>8. Contact</strong>
              </p>
              <p>
                Do you have any questions or concerns about our privacy policy
                or how we handle your personal data? You can contact us at:
              </p>
              <p>
                Email:{" "}
                <a href="mailto:kontakt@foodiefinder.se">
                  kontakt@foodiefinder.se
                </a>
              </p>
            </div>
          </DisclosurePanel>
        </Disclosure>

        <Disclosure as="div">
          <DisclosureButton className="group flex w-full items-center justify-between py-4">
            <span className="text-xl font-medium text-blackThree group-hover:text-blackThree/80">
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
