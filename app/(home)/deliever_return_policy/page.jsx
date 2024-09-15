"use client";

import { homeDivider } from "../../../svgs";
import React, { useEffect } from "react";

import { setActivePage } from "../../../redux/slices/headerSlice";
import { useDispatch } from "react-redux";

const page = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage(""));
  }, [dispatch]);

  return (
    <div className="text-[75%] md:text-[100%]">
      <div className="bg-[#F5F5F5] pl-[5%] pr-[5%] pb-[5%] pt-[3%]">
        <div className="text-center lg:w-[60%] mx-auto">
          <h1 className="text-[2.5em] text-[500] text-pinkBgDark font-semibold uppercase">
            Deliever and Return Policy
          </h1>
          <p className="text-[#474747] font-medium">
            Welcome to FoodieFinder.se! Below we describe our guidelines for
            delivery and returns, as well as how cancellations and refunds are
            handled when you use our service to book meals from restaurants and
            cafes.
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
              <div>Last updated: 15 Septemeber 2024</div>
            </div>
            <p>
              <strong>1. Delivery and collection</strong>
            </p>
            <p>
              FoodieFinder.se offers a platform where you can book meals that
              would otherwise go to waste from local restaurants and cafes.
              Delivery and collection are handled as follows:
            </p>
            <ul>
              <li>
                <strong>Collection:</strong> All meals booked via
                FoodieFinder.se must be collected by you personally at the place
                and time specified by the restaurant in the booking
                confirmation. It is your responsibility to ensure that you can
                collect the meal within the specified time period.
              </li>
              <li>
                <strong>Delivery:</strong> FoodieFinder.se does not currently
                offer home delivery. All meals must be picked up on site.
              </li>
            </ul>
            <p>
              <strong>2. Cancellation and changes</strong>
            </p>
            <p>
              We understand that plans can change, but since the meals booked
              via FoodieFinder.se are often fresh products that would otherwise
              have gone to waste, special cancellation conditions apply:
            </p>
            <ul>
              <li>
                <strong>Canceling an order:</strong> You can cancel your order
                up to two hours before the specified pick-up time directly via
                your account at FoodieFinder.se. Cancellations made after this
                time will not be refunded, as the food has already been
                prepared.
              </li>
              <li>
                <strong>Changes to order:</strong> Unfortunately, we cannot
                guarantee that changes to the order can be made after the
                booking has been confirmed. If you have special requests or need
                to make changes, please contact the restaurant directly.
              </li>
            </ul>
            <p>
              <strong>3. Refund Policy</strong>
            </p>
            <p>Refunds are processed according to the following terms:</p>
            <ul>
              <li>
                <strong>Missed Collection:</strong> If you do not collect your
                order within the specified collection time frame, no refund will
                be given.
              </li>
              <li>
                <strong>Incorrect orders:</strong> If there are problems with
                your order, such as incorrect goods or serious quality problems,
                please contact both the restaurant and FoodieFinder.se customer
                service immediately. We will work to resolve the issue and, if
                possible, offer a refund or compensation.
              </li>
              <li>
                <strong>Canceled order from restaurant:</strong> If the
                restaurant has to cancel your order for any reason, you will be
                informed immediately, and the full amount of your order will be
                refunded.
              </li>
            </ul>
            <p>
              <strong>4. Quality and content</strong>
            </p>
            <p>
              Since the meals provided via FoodieFinder.se are surplus food that
              would otherwise be thrown away, we cannot guarantee the specific
              content of each meal. Quality and content may vary, and food is
              supplied "as is". We encourage you to always check ingredients and
              quality when picking up, especially if you have allergies or
              specific food preferences.
            </p>
            <p>
              <strong>5. Contact for questions or problems</strong>
            </p>
            <p>
              If you have any questions about our delivery and returns policy,
              or if you encounter any problems with your order, please feel free
              to contact us:
            </p>
            <p>
              Email:{" "}
              <a href="kontakt@foodiefinder.se">kontakt@foodiefinder.se</a>
            </p>
            <p>
              We always strive to give you a positive experience at
              FoodieFinder.se and are here to help you with any questions or
              problems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
