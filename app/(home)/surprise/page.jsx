"use client";
import React, { useEffect } from "react";
import Steps from "../../../components/sections/home/surprise/Steps";
import Faqs from "../../../components/sections/home/surprise/FAQs";
import { setActivePage } from "../../../redux/slices/headerSlice";
import { useDispatch } from "react-redux";

const Page = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setActivePage("Surprise Bag"));
  }, [dispatch]);
  return (
    <div className="text-[75%] md:text[90%] lg:text-[100%] bg-[#F5F5F5]">
      <div className="flex flex-col items-center gap-10 p-[5%] lg:px-[2%] lg:pt-[3%] lg:pb-[5%]">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-center font-extrabold text-[3em] md:text-[3.75em] uppercase">
            Surprise BAG
          </h1>
          <p className="font-semibold text-[1em] text-center w-[100%] md:w-[80%]">
            With FoodieFinder's surprise bag, you get the chance to discover
            good food at a good price while helping to reduce food waste. Our
            surprise bags consist of unsold, but still excellent, food items
            from local restaurants, bakeries and shops. You don't know exactly
            what's in the box until you pick it up, which makes the experience
            both exciting and sustainable. Each box is filled with a mixture of
            fresh and tasty goods that would otherwise be thrown away, so you
            make both a good bargain and a contribution to the environment!
          </p>
        </div>

        <img
          src="/surprise-group.webp"
          className="w-full relative hidden md:block"
        />
        <img
          src="/surprise-group-mob.webp"
          className="w-full relative md:hidden"
        />
      </div>
      <Steps
        steps={steps}
        heading={"Here's how Surprise Bag works - step by step:"}
        image={"/Sqaures-image-1.webp"}
      />
      <Faqs
        heading={"Questions and Answers about Surprise Bag for Business"}
        faqData={faqData}
      />
    </div>
  );
};

const steps = [
  {
    title: "Connect your business:",
    description:
      "Start by registering your business on the FoodieFinder platform. It's easy to get started, and our support is available to help you through the entire process.",
  },
  {
    title: "Add leftover food:",
    description:
      "After closing or during quieter periods, identify the items that have not been sold but are still completely fresh and of high quality. Add these to the app as a surprise box.",
  },
  {
    title: "Enter details and availability: ",
    description:
      "Determine how many surprise bags are available and specify a time for collection. Be transparent with the type of food but keep the content a surprise to provide an exciting experience for customers. As a business, you have the freedom to set the price of your boxes yourself, which gives you full control over your offers. However, we recommend pricing the checkouts at around 1/3 of the regular price, which makes them attractive to customers and contributes to faster sales. Also enter the times when customers can pick up their boxes.",
  },
  {
    title: "Customers reserve bags:",
    description:
      "Customers browse offers on the FoodieFinder app, see your available surprise bags and reserve them directly in the app.",
  },
  {
    title: "Prepare checkouts for pickup:",
    description:
      "Prepare checkouts with the leftover products specified in the app. The boxes must be ready for collection at the time specified for the customers.",
  },
  {
    title: "Customers collect their bags:",
    description:
      "Customers come to your store or restaurant during the pickup time, show their confirmation from the app, and collect their surprise bags. This often creates a chance for customers to discover your business and possibly buy more items.",
  },
  {
    title: "Contribute to sustainability and increase sales:",
    description:
      "By selling surprise bags, you reduce food waste, attract new customers and increase your revenue from products that would otherwise have been lost. Each box sold also contributes to reducing CO2 emissions, making a positive impact on the environment.",
  },
];

const faqData = [
  {
    question: "How does the surprise fund for companies work?",
    answer:
      "Businesses can sell their leftover, but still fully edible items by creating surprise bags in the FoodieFinder app. You post available boxes, set collection times, and customers reserve and collect their boxes from you.",
  },
  {
    question: "What can I put in a surprise bag?",
    answer:
      "You can put in all kinds of unsold food that is still of good quality. It can be baked goods, ready meals, fruit, vegetables or other goods that would otherwise have been thrown away.",
  },
  {
    question: "How often do I have to offer surprise bags?",
    answer:
      "It's entirely up to you. You can post crates as often or as infrequently as you like, depending on how much surplus food you have at different times.",
  },
  {
    question: "How do surprise bags help my business?",
    answer:
      "By selling surprise bags, you reduce food waste, generate revenue from items that would otherwise have been lost, and potentially attract new customers to your store or restaurant. Many customers also buy more items when they pick up their checkout.",
  },
  {
    question: "What does my company gain from using the surprise box?",
    answer:
      "You get paid for items that would otherwise be thrown away, helping to reduce your losses. In addition, new customers can discover your business through the app, which can increase your customer base and future sales.",
  },
  {
    question: "How do I set up surprise bags in the app?",
    answer:
      "It's simple! Log in to your business account in the FoodieFinder app, create a new surprise bag by entering the quantity, description, and pickup times. When you publish the checkout, it becomes visible for customers to reserve.",
  },
  {
    question: "How do I manage the collection of surprise bags?",
    answer:
      "Prepare the checkouts according to the information you have entered in the app. When customers come to pick up their crates, they show their confirmation from the app, and you give them the crates.",
  },
  {
    question: "What happens if no customers reserve my checkouts?",
    answer:
      "If cash registers are not reserved, your business is not negatively affected; you still tried to reduce food waste. We recommend that you adjust the number of boxes or the price to better match demand.",
  },
  {
    question: "Can customers see what is in the surprise box?",
    answer:
      "No, the concept is based on surprise! Customers know what type of food to expect (eg baked goods, vegetables), but exact contents are only revealed at pick-up. This creates an exciting experience for customers.",
  },
  {
    question:
      "How do we ensure that the food in the surprise bags is of high quality?",
    answer:
      "It is important to only include produce that is still fully edible and of good quality. Surprise bags must reflect the standard your company stands for, and all food must be handled according to current hygiene and safety regulations.",
  },
];

export default Page;
