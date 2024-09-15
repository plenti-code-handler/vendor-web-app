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
            User Generated Content Policy
          </h1>
          <p className="text-[#474747] font-medium">
            FoodieFinder.se strives to create a community where users can share
            their experiences and give feedback on meals and restaurants. This
            User Generated Content Policy describes the rules and guidelines
            that apply to all content that you as a user share on our platform,
            including reviews, comments, images and other contributions.
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
              <strong>1. What is User Generated Content?</strong>
            </p>
            <p>
              User-generated content is all material created and shared by users
              on FoodieFinder.se. This may include meal reviews, comments,
              ratings, photos, videos or other feedback related to restaurants
              and experiences via our platform.
            </p>
            <p>
              <strong>2. User Generated Content Guidelines</strong>
            </p>
            <p>
              To ensure a positive and respectful community, we ask that you
              follow these guidelines when contributing content to
              FoodieFinder.se:
            </p>
            <ul>
              <li>
                <strong>Relevant and factual information:</strong> Only share
                content that is relevant to your experiences with
                FoodieFinder.se and that can be helpful to other users.
              </li>
              <li>
                <strong>Respectful and friendly conduct:</strong> Use respectful
                language and avoid insults, harassment, threats or any content
                that may be perceived as offensive.
              </li>
              <li>
                <strong>No Illegal or Inappropriate Materials:</strong> Do not
                post content that is illegal, pornographic, violent, hateful, or
                otherwise violates any laws or regulations.
              </li>
              <li>
                <strong>No advertising or spam:</strong> Content that is
                considered advertising, spam, or intended to sell other products
                or services is not permitted.
              </li>
              <li>
                <strong>Truth and honesty:</strong> Share honest experiences and
                avoid spreading false information or misleading content.
              </li>
            </ul>
            <p>
              <strong>3. Rights and Licenses</strong>
            </p>
            <p>
              By sharing content on FoodieFinder.se, you grant us a
              non-exclusive, worldwide, royalty-free and transferable license to
              use, copy, modify, publish and distribute your content on our
              platform and in marketing materials. This means that we can use
              your content to promote our service, but you still retain the
              copyright to your content.
            </p>
            <p>
              <strong>4. Responsibility for content</strong>
            </p>
            <p>
              As a user, you are fully responsible for all content that you
              share on FoodieFinder.se. This means that you must ensure that you
              have the necessary rights or permission to publish the content and
              that it does not infringe anyone else's rights, including
              copyright, trademark or privacy rights.
            </p>
            <p>
              <strong>5. Review and Removal of Content</strong>
            </p>
            <p>
              FoodieFinder.se reserves the right to review, moderate and remove
              user-generated content that we believe violates this policy or is
              inappropriate for our platform. This may be done without notice,
              and we are not required to provide reasons why content is removed.
            </p>
            <p>
              <strong>6. Report inappropriate content</strong>
            </p>
            <p>
              If you come across content that violates this policy or that you
              consider inappropriate, please report it to us by using the
              reporting feature on the platform or by contacting our customer
              service.
            </p>
            <p>
              <strong>7. Changes to Policy</strong>
            </p>
            <p>
              We may update this User Generated Content Policy as necessary. Any
              changes will be posted on this page, and we encourage you to
              regularly review the policy to stay informed of the current
              guidelines.
            </p>
            <p>
              <strong>8. Contact information</strong>
            </p>
            <p>
              Have questions or concerns about this User Generated Content
              Policy? You are welcome to contact us:
            </p>
            <p>
              Email:{" "}
              <a href="mailto:kontakt@foodiefinder.se">
                kontakt@foodiefinder.se
              </a>
            </p>
            <p>
              We appreciate your contribution to FoodieFinder.se and look
              forward to creating a positive experience for all users!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
