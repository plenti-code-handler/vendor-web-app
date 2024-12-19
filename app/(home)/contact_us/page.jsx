"use client";
import React, { useEffect, useState } from "react";
import { homeDivider } from "../../../svgs";
import { Input, Textarea } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../../redux/slices/headerSlice";
import emailjs from "@emailjs/browser";

const Page = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [nameValid, setNameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [queryValid, setQueryValid] = useState(true);

  useEffect(() => {
    dispatch(setActivePage("Contact Us"));
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    const isNameValid = name.trim() !== "";
    const isEmailValid = email.trim() !== "";
    const isQueryValid = query.trim() !== "";

    setNameValid(isNameValid);
    setEmailValid(isEmailValid);
    setQueryValid(isQueryValid);

    if (!isNameValid || !isEmailValid || !isQueryValid) {
      return; // Prevent form submission if any field is invalid
    }
    console.log(name, email, query);
    try {
      // Sending the email using EmailJS (commented out for now)
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_KEY,
        process.env.NEXT_PUBLIC_EMAILJS_USER_CONTACT_TEMPLATE_KEY,
        {
          message: query,
          name: name,
          user_email: email,
          reply_to: email,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      // Clear the form fields after successful submission
      setName("");
      setEmail("");
      setQuery("");
      console.log("Send successfully"); // Log the error for debugging
    } catch (error) {
      console.error("Failed to send your message:", error); // Log the error for debugging
    } finally {
    }
  };

  return (
    <div className="bg-[#F5F5F5] py-10">
      <div className="mx-14">
        <div className="text-center lg:w-[60%] mx-auto">
          <h1 className="text-[48px] text-[500] text-blueBgDark">Contact Us</h1>
          <p className="text-[#474747]">
            Have questions or feedback? We're here to assist you! Reach out to
            our team, and we'll ensure you have all the information you need for
            a great experience.
          </p>
          <div className="flex justify-center items-center my-10">
            <div className="w-[100%] h-[1px] bg-gradient-hr-alt" />
            {homeDivider}
            <div className="w-[100%] h-[1px] bg-gradient-hr" />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex h-full flex-col py-5 w-[896px]">
            <div className="text-[75%] md:text-[100%]">
              <div className="mx-10 flex flex-col gap-8">
                {/* <div className="flex md:flex-row flex-col font-[400] text-[1.5em] items-center justify-between">
                  <p>drop us a line</p>
                  <p>
                    <a
                      className="underline hover:text-blueBgDark"
                      href="mailto:kontakt@foodiefinder.se"
                    >
                      kontakt@foodiefinder.se
                    </a>
                  </p>
                </div> */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex md:flex-row flex-col md:items-center gap-5 justify-between">
                    <div className="flex flex-col gap-3 basis-full">
                      <label
                        className={`${
                          nameValid ? "text-black" : "text-red-500"
                        }`}
                      >
                        Name *
                      </label>
                      <Input
                        className={`px-4 w-full bg-transparent rounded-[6px] h-[60px] border-2 ${
                          nameValid ? "border-[#404146]" : "border-red-500"
                        }`}
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setNameValid(true); // Reset validation state on input
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-3 basis-full">
                      <label
                        className={`${
                          emailValid ? "text-black" : "text-red-500"
                        }`}
                      >
                        Email *
                      </label>
                      <Input
                        className={`px-4 w-full bg-transparent rounded-[6px] h-[60px] border-2 ${
                          emailValid ? "border-[#404146]" : "border-red-500"
                        }`}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailValid(true); // Reset validation state on input
                        }}
                        type="email" // Ensure it's an email input
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 basis-full">
                    <label
                      className={`${
                        queryValid ? "text-black" : "text-red-500"
                      }`}
                    >
                      Message *
                    </label>
                    <Textarea
                      rows={5}
                      className={`p-4 w-full rounded-[6px] bg-transparent border-2 ${
                        queryValid ? "border-[#404146]" : "border-red-500"
                      }`}
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setQueryValid(true); // Reset validation state on input
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`flex self-center justify-center bg-blueBgDark text-white font-bold py-3 px-4 rounded hover:bg-blueBgDarkHover2 w-full sm:w-auto sm:px-6 lg:w-[35%]  `}
                  >
                    Contact us
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
