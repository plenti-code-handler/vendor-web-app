"use client";

import React from "react";
import { useForm } from "react-hook-form";

const ContactDetailsForm = ({ onSubmit, loading, initialData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      phoneNumber: "",
      outletName: "",
    },
  });

  // Reset form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full max-w-md space-y-5"
    >
      <div className="flex flex-col space-y-3">
        <p className="text-black font-semibold text-[28px]">
          Contact Details
        </p>
        <p className="text-[#A1A5B7] text-sm">
          Let's start with your basic contact information
        </p>
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-600">
          Phone Number
        </label>
        <input
          type="tel"
          {...register("phoneNumber", {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Please enter a valid 10-digit phone number",
            },
          })}
          className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter 10-digit phone number"
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-600">
          Outlet Name
        </label>
        <input
          type="text"
          {...register("outletName", {
            required: "Outlet name is required",
          })}
          className="rounded-md border border-gray-200 py-3 px-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter your outlet/store name"
        />
        {errors.outletName && (
          <p className="text-red-500 text-sm">
            {errors.outletName.message}
          </p>
        )}
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className={`flex justify-center bg-primary text-white font-semibold py-2 rounded hover:bg-hoverPrimary gap-2 w-full ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </form>
  );
};

export default ContactDetailsForm;