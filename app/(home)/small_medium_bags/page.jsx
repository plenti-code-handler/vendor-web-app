"use client";
import React, { useEffect, useState } from "react";
import Steps from "../../../components/sections/home/surprise/Steps";
import Faqs from "../../../components/sections/home/surprise/FAQs";
import { setActivePage } from "../../../redux/slices/headerSlice";
import { useDispatch } from "react-redux";

let currLang = "en";

const Page = () => {
  const [currLangg, setCurrLang] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setActivePage("Small & Large Bag"));
    console.log("Language from localStorage:", lang);
  }, [dispatch]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateLangFromStorage = () => {
        const storedLang = localStorage.getItem("lang");
        if (storedLang) {
          setCurrLang(storedLang);
          lang = storedLang;
        }
      };

      const timeoutId = setTimeout(() => {
        updateLangFromStorage();
        window.addEventListener("storage", updateLangFromStorage);
      }, 2000);
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("storage", updateLangFromStorage);
      };
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && document.body) {
      document.body.setAttribute("lang", currLang);
    }
  }, [currLang]);

  return (
    <div className="text-[75%] md:text[90%] lg:text-[100%] bg-[#F5F5F5]">
      <div className="flex flex-col items-center gap-10 p-[5%] lg:px-[2%] lg:pt-[3%] lg:pb-[5%]">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-center font-extrabold text-[3em] md:text-[3.75em] uppercase">
            {`SMALL & LARGE ${currLang === "en" ? "bag" : "pouch"}`}
          </h1>
          <p className="font-semibold text-base text-center w-[100%] md:w-[80%]">
            At FoodieFinder, we offer both small and large bags with known
            contents, which gives you as a customer the opportunity to know
            exactly what you are buying and choose the size that suits your
            needs. These crates are filled with unsold, but still excellent food
            from local restaurants, bakeries and shops.<br></br>Small bags
            contain a smaller number of items, perfect for one person or a small
            household.<br></br>Large bags are filled with more products and are
            suitable for larger households, families or for those who want to
            make a substantial saving.
          </p>
        </div>

        <img
          src="/small-large.webp"
          className="w-full relative hidden md:block"
        />
        <img
          src="/small-large-mob.webp"
          className="w-full relative md:hidden"
        />
      </div>
      <Steps
        steps={steps}
        heading={`Here's how Small & Large ${
          currLang === "en" ? "bag" : "pouch"
        }  works - step by step:`}
        image={"/Sqaures-image-2.webp"}
      />
      <Faqs
        heading={`Questions and Answers about Small & Large ${
          currLang === "en" ? "bag" : "pouch"
        } for Business`}
        faqData={faqData}
      />
    </div>
  );
};

const faqData = [
  {
    question: `How do known content ${
      currLang === "en" ? "bags" : "pouches"
    }  work for businesses?`,
    answer: `Businesses can sell unsold items by creating ${
      currLang === "en" ? "bags" : "pouches"
    }  with known contents in the FoodieFinder app. You specify exactly what is in each ${
      currLang === "en" ? "bag" : "pouch"
    }, giving customers the opportunity to know what they are getting before they reserve and collect from you.`,
  },
  {
    question: `What can I put in a ${
      currLang === "en" ? "bag" : "pouch"
    } with known contents?`,
    answer:
      "You can put in specific items that are left over but still of high quality, such as ready meals, single products or combinations of items that would otherwise be thrown away.",
  },
  {
    question: "How often do I have to offer bags with known contents?",
    answer:
      "It is completely flexible! You can offer crates as often as you have surplus items to sell, making it easy to adapt the offer to your needs and stock status.",
  },
  {
    question: "How do bags with known content help my business?",
    answer: `By selling ${
      currLang === "en" ? "bags" : "pouches"
    } with known contents, you can reduce food waste, get revenue for goods that would otherwise be lost and give customers an attractive offer. It also provides a chance to showcase your range and attract repeat customers.`,
  },
  {
    question: `What does my company gain from using ${
      currLang === "en" ? "bags" : "pouches"
    } with known content?`,
    answer:
      "You get revenue for products that would otherwise have gone to waste, and you can attract new customers to your business by offering transparency and great deals. Customers appreciate knowing what they are buying, which can build trust and lead to repeat purchases.",
  },
  {
    question: `How do I set up ${
      currLang === "en" ? "bags" : "pouches"
    } with known content in the app?`,
    answer: `Log in to your business account in the FoodieFinder app, create a new ${
      currLang === "en" ? "bag" : "pouch"
    } by specifying the items included, the number of ${
      currLang === "en" ? "bags" : "pouches"
    } and pick-up times. Publish the checkout to make it visible for customers to reserve.`,
  },
  {
    question: "How do I handle the collection of bags with known contents?",
    answer: `Prepare the ${
      currLang === "en" ? "bags" : "pouches"
    } with the specific items you entered in the app. When customers come to pick up their crates, they show their confirmation from the app, and you hand out the prepared crates.`,
  },
  {
    question: `What happens if no customers reserve my ${
      currLang === "en" ? "bags" : "pouches"
    }?`,
    answer:
      "If cash registers are not reserved, your business is not negatively affected; you still tried to reduce food waste. You can adjust the number of crates or their contents to better match demand in the future.",
  },
  {
    question: `How do I communicate the contents of the ${
      currLang === "en" ? "Bag" : "Pouch"
    } to the customers?`,
    answer:
      "When you create the checkout in the app, you clearly list what's included, so customers know exactly what they're buying. This creates trust and makes it easy for customers to choose the pouch that suits them best.",
  },
  {
    question: `How do we ensure that the food in the ${
      currLang === "en" ? "bags" : "pouches"
    } with known contents is of high quality?`,
    answer: `Only items that are still fully edible and of good quality should be included in the ${
      currLang === "en" ? "bags" : "pouches"
    }. It is important that your company continues to maintain its standard of quality and that all food is handled in accordance with current hygiene and safety regulations.`,
  },
];

const steps = [
  {
    title: "Connect your business to FoodieFinder",
    description:
      "Start by registering your business on the FoodieFinder platform. Our team is on hand to help you through the entire registration process and set up your account.",
  },
  {
    title: "Identify Leftovers",
    description:
      "After closing or during quieter periods, go through your assortment and identify unsold items that are still high quality and edible. It can be fresh products, ready-made dishes, or other foods that were not sold during the day.",
  },
  {
    title: "Create bags with known contents",
    description: `Choose whether you want to create small or large bags depending on the amount of surplus goods. Describe exactly which products are included in each ${
      currLang === "en" ? "Bag" : "Pouch"
    } so that customers clearly know what they are getting. Be careful to include details such as type of food, number of servings, or specific products.`,
  },
  {
    title: "Set price and collection times",
    description: `As a business, you have the freedom to set the price of your ${
      currLang === "en" ? "bags" : "pouches"
    } yourself, giving you full control over your offers. However, we recommend pricing the pouches at around 1/3 of the regular price, which makes them attractive to customers and contributes to faster sales. Also enter the times when customers can pick up their ${
      currLang === "en" ? "bags" : "pouches"
    }.`,
  },
  {
    title: `Publish ${currLang === "en" ? "bags" : "pouches"} to the app`,
    description: `Once you've set up the ${
      currLang === "en" ? "bags" : "pouches"
    }, publish them to the FoodieFinder app so they're visible to customers. Customers will be able to see the description of the content and the price, making it easy for them to make a decision.`,
  },
  {
    title: `Customers reserve ${currLang === "en" ? "bags" : "pouches"}`,
    description: `Customers browse the app, see your ${
      currLang === "en" ? "bags" : "pouches"
    } with known content and reserve them directly in the app. They pay directly in the app, making the process smooth and easy for both you and the customer.`,
  },
  {
    title: "Prepare crates for pickup",
    description: `Prepare the crates according to the description you entered in the app. Ensure that each ${
      currLang === "en" ? "bag" : "pouch"
    } contains the specific items promised to maintain trust and ensure a positive customer experience.`,
  },
  {
    title: "Pick-up management",
    description: `Customers come to your store or restaurant during the specified pick-up times. They show their confirmation from the app, and you hand out the prepared ${
      currLang === "en" ? "bags" : "pouches"
    } with known contents.`,
  },
  {
    title: "Follow up and optimize",
    description: `After each round of sales, analyze what sold best and adjust your ${
      currLang === "en" ? "bags" : "pouches"
    } and prices accordingly. Be responsive to customer feedback and use it to improve your offerings and increase sales.`,
  },
];

export default Page;
