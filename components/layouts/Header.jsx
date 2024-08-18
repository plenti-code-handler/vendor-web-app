import React from "react";
import { useSelector } from "react-redux";
import AdminHeader from "./AdminHeader";
import BussinessHeader from "./BussinessHeader";
import { getUserLocal } from "../../redux/slices/loggedInUserSlice";

const Header = () => {
  const user = getUserLocal();

  return user?.role === "admin" ? (
    <AdminHeader />
  ) : user?.role === "vendor" ? (
    <BussinessHeader />
  ) : (
    ""
  );
};

export default Header;
