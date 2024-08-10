import { Textarea } from "@headlessui/react";
import React from "react";

const FaqForm = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center">
        <p className="font-semibold text-md">
          You can send us an email with your query at
        </p>
        <p className="font-bold text-lg">foodiefindersupport@gmail.com</p>
      </div>
      <Textarea
        className="block w-full resize-none rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        rows={5}
        placeholder="Your Query"
      />
      <button className="flex justify-center bg-pinkBgDark text-white font-bold py-3 px-4 rounded hover:bg-pinkBgDarkHover2 w-full sm:w-auto sm:px-6 lg:w-[35%]">
        Submit
      </button>
    </div>
  );
};

export default FaqForm;
