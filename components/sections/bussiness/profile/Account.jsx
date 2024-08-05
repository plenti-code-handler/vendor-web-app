import React from "react";
import TextField from "../../../fields/TextField";
import { tickSvg } from "../../../../svgs";
import { Textarea } from "@headlessui/react";

const Account = () => {
  return (
    <div className="flex flex-col gap-4">
      <TextField placeholder={"Business Name"} />
      <div className="flex justify-between w-full placeholder:font-bold rounded-lg border border-gray-300 bg-[#F4F4F4] py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black">
        <p className="font-semibold text-black">iamzaibi305@gmail.com</p>
        <div className="flex gap-1 items-center">
          <p className="text-main font-semibold">Verified</p>
          {tickSvg}
        </div>
      </div>
      <TextField placeholder={"Address"} />
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345094173!2d144.9537363159041!3d-37.81720974202165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce7e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1613989980106!5m2!1sen!2sus"
        width="450"
        height="250"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
      ></iframe>
      <Textarea
        className="block w-full resize-none rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        rows={8}
        placeholder="Description"
      />
      <div className="flex gap-5 pt-2">
        <button className="flex justify-center bg-white text-black border border-black font-md py-2  rounded hover:bg-grayTwo gap-2 w-[100%]">
          Discard Changes
        </button>
        <button className="flex justify-center bg-pinkBgDark text-white font-md py-2  rounded hover:bg-pinkBgDarkHover gap-2 w-[100%]">
          Update
        </button>
      </div>
    </div>
  );
};

export default Account;
