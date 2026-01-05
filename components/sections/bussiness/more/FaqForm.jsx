import React, { useState } from "react";
import { Textarea } from "@headlessui/react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { getAuth } from "firebase/auth";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
// import { db } from "../../../../app/firebase/config";

const FaqForm = () => {
  const [query, setQuery] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      toast.error("Please enter your query.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      toast.error("User is not authenticated.");
      return;
    }

    try {
      // Fetch user details from Firestore using user.uid
      // const userRef = doc(db, "users", user.uid);
      // const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        toast.error("User data not found in Firestore.");

        return;
      }

      const { email, name } = userDoc.data();

      console.log(email, name, query);

      // Sending the email using EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_KEY,
        process.env.NEXT_PUBLIC_EMAILJS_BUSINESS_CONTACT_TEMPLATE_KEY,
        {
          message: query,
          name: name || "User",
          user_email: email,

          reply_to: email,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );
      toast.success("Your query has been submitted successfully");
    } catch (error) {
      toast.error(error);
    } finally {
      setQuery(""); // Clear the query field after submission
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center">
        <p className="font-semibold text-md">
          You can send us an email with your query at
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center gap-4"
      >
        <Textarea
          className="block w-full resize-none rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
          rows={5}
          placeholder="Your Query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className={`flex justify-center bg-blueBgDark text-white font-semibold py-3 px-4 rounded hover:bg-blueBgDarkHover2 w-full sm:w-auto sm:px-6 lg:w-[35%]  `}
        >
          Contact Us
        </button>
      </form>
    </div>
  );
};

export default FaqForm;
