"use client";

import { useRouter } from "next/navigation";
import { authBackArrow } from "../../../svgs";
import React from "react";

const BackButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex w-[38px] h-[38px] rounded-full items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors"
    >
      {authBackArrow}
    </button>
  );
};

export default BackButton;
