"use client";

import { useDispatch, useSelector } from "react-redux";
import { filesEmailSvg, phoneSvg } from "../../../../svgs";
import React, { useEffect, useState } from "react";
import { setActivePage } from "../../../../redux/slices/headerSlice";
import { useRouter } from "next/navigation";

const CustomerProfileCard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("Users"));
  }, [dispatch]);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const router = useRouter();

  const business = useSelector(
    (state) => state.selectBusiness.selectedBusiness
  );

  useEffect(() => {
    if (!business || Object.keys(business).length === 0) {
      router.push("/admin/users");
    }
    setName(business.username);
    setImage(business.imageUrl);
    setEmail(business.email);
    setPhone(business.phone);
  }, [business, router]);

  return (
    <>
      <div className="flex space-x-4">
        <img
          alt="User"
          src={image}
          className="rounded-full h-24 w-24 sm:h-25 sm:w-25 object-cover"
        />
        <div className="flex mt-2 lg:mt-0">
          <div className="flex flex-col lg:mt-5 lg:gap-y-2">
            <p className="text-lg font-semibold text-gray-900">{name}</p>
            <div className="flex items-center text-gray-600 space-x-2">
              {filesEmailSvg}
              <p className="text-sm">{email}</p>
            </div>
            <div className="flex items-center text-gray-600 space-x-2">
              {phoneSvg}
              <p className="text-sm">{phone}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerProfileCard;
