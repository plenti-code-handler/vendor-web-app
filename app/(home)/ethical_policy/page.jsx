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
            Ethical Policy
          </h1>
          <p className="text-[#474747] font-medium">
            At FoodieFinder.se, we are committed to conducting our business in
            an ethical, responsible and sustainable manner. Our ethics policy
            describes our commitments and principles that guide our work,
            including how we interact with users, partners and society at large.
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
              <strong>1. Our commitment to sustainability</strong>
            </p>
            <p>
              Our main goal at FoodieFinder.se is to reduce food waste by
              connecting users with restaurants that offer surplus food. We
              strive to make a positive impact on the environment by:
            </p>
            <ul>
              <li>
                <strong>Reduce food waste:</strong> We work actively to reduce
                food waste and support restaurants in selling surplus food to
                users, which contributes to a more sustainable food chain.
              </li>
              <li>
                <strong>Environmentally friendly choices:</strong> We encourage
                users and partners to make environmentally friendly decisions,
                such as using reusable containers and reducing plastic use.
              </li>
            </ul>
            <p>
              <strong>2. Ethical business practices</strong>
            </p>
            <p>
              We are committed to conducting our business with the highest
              integrity and according to fair business practices:
            </p>
            <ul>
              <li>
                <strong>Honesty and transparency:</strong> We act honestly and
                transparently in all our business relationships and
                communications.
              </li>
              <li>
                <strong>Responsibility to customers:</strong> We strive to offer
                reliable services and to handle all user contacts in a
                respectful and responsible manner.
              </li>
              <li>
                <strong>Fair treatment:</strong> We treat all our users and
                partners fairly and respectfully, without discrimination based
                on gender, ethnicity, religion, sexual orientation, disability
                or other protected characteristic.
              </li>
            </ul>
            <p>
              <strong>3. Cooperation with partners</strong>
            </p>
            <p>
              We choose to collaborate with restaurants and cafes that share our
              values ​​of sustainability and responsible business practices. We
              encourage our partners to follow ethical guidelines that promote
              safety, fairness and respect for both customers and employees.
            </p>
            <p>
              <strong>4. Social responsibility</strong>
            </p>
            <p>FoodieFinder.se strives to contribute to society by:</p>
            <ul>
              <li>
                <strong>Supporting the local community:</strong> We work with
                local restaurants and cafes to promote the community economy and
                support local businesses.
              </li>
              <li>
                <strong>Openness and dialogue:</strong> We are open to feedback
                from our users and the community, and we are constantly looking
                for new ways to improve our business and our social impact.
              </li>
            </ul>
            <p>
              <strong>5. Reporting Unethical Behavior</strong>
            </p>
            <p>
              We encourage anyone using our platform or working with us to
              report suspected unethical or illegal behavior. If you experience
              or observe something that violates our ethics policy, please
              contact us so that we can investigate and take appropriate action.
            </p>
            <p>
              <strong>Contact information:</strong>
            </p>
            <p>
              Email:{" "}
              <a href="mailto:kontakt@foodiefinder.se">
                kontakt@foodiefinder.se
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
