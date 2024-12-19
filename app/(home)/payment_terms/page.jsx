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
          <h1 className="text-[2.5em] text-[500] text-blueBgDark font-semibold uppercase">
            Payment Terms
          </h1>
          <p className="text-[#474747] font-medium">
            These payment terms describe the rules and guidelines that apply
            when you place an order via FoodieFinder.se. By using our service
            and placing an order, you agree to these payment terms.
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
              <strong>1. Payment methods</strong>
            </p>
            <p>
              FoodieFinder.se offers several payment options to make your
              shopping experience as easy as possible. The payment methods
              currently accepted are:
            </p>
            <ul>
              <li>
                <strong>Credit and debit cards:</strong> We accept Visa,
                MasterCard, and other major card providers.
              </li>
              <li>
                <strong>Digital payment solutions:</strong> We accept payments
                through services such as Swish, PayPal, and other digital
                platforms.
              </li>
            </ul>
            <p>
              All payments are made securely via our trusted payment providers
              and we do not store your payment details directly.
            </p>
            <p>
              <strong>2. Time of payment</strong>
            </p>
            <p>
              Payment for your order is deducted immediately at the time of
              booking. This is to ensure that the meal is reserved for you and
              that the restaurant can prepare your order in time for collection.
            </p>
            <p>
              <strong>3. Price and fees</strong>
            </p>
            <p>
              All prices displayed on FoodieFinder.se are inclusive of VAT and
              any applicable fees. The price of each meal is determined by the
              restaurant and is clearly displayed before you complete your
              reservation. There are no hidden fees.
            </p>
            <p>
              <strong>4. Confirmation of payment</strong>
            </p>
            <p>
              After you have completed a payment, you will receive a
              confirmation email containing details of your order and payment.
              If you do not receive a confirmation within a reasonable time,
              please check your spam folder or contact our customer service.
            </p>
            <p>
              <strong>5. Security and data protection</strong>
            </p>
            <p>
              We protect the security of your payment details. All transactions
              are handled through encrypted payment systems and your data is
              protected in accordance with our privacy policy. We do not share
              your payment details with third parties other than our payment
              providers.
            </p>
            <p>
              <strong>6. Refunds</strong>
            </p>
            <p>
              Refunds are handled according to our Delivery and Returns Policy.
              Briefly:
            </p>
            <ul>
              <li>
                <strong>
                  Order cancellations within the cancellation window:
                </strong>{" "}
                You can cancel your order and receive a full refund if the
                cancellation occurs at least two hours before the scheduled
                pick-up time.
              </li>
              <li>
                <strong>Problems with the order:</strong> If your order is
                incorrect or if there is a problem with the quality of the food,
                please contact our customer service for assistance. We aim to
                process all refunds and compensations as quickly as possible.
              </li>
            </ul>
            <p>
              <strong>7. Unpaid Amounts</strong>
            </p>
            <p>
              If for any reason the payment fails or is not completed correctly,
              the order will not be completed and no meal reservation will be
              made. You will be notified of this and can try to complete the
              payment again.
            </p>
            <p>
              <strong>8. Changes in payment terms</strong>
            </p>
            <p>
              We reserve the right to update these payment terms at any time.
              Any changes will be posted on our website, and we recommend that
              you review these terms regularly to stay informed of current rules
              and guidelines.
            </p>
            <p>
              <strong>9. Contact information</strong>
            </p>
            <p>
              Do you have questions about our payment terms or need help with a
              payment? Contact us at:
            </p>
            <p>
              Email:{" "}
              <a href="mailto:kontakt@foodiefinder.se">
                kontakt@foodiefinder.se
              </a>
            </p>
            <p>We are here to help you and answer your questions!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
