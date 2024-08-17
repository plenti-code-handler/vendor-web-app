import React from "react";
import { useSelector } from "react-redux";
import AdminHeader from "./AdminHeader";
import BussinessHeader from "./BussinessHeader";

const Header = () => {
  const user = useSelector((state) => state.loggedInUser.user);
  return user?.role === "admin" ? (
    <AdminHeader />
  ) : user?.role === "vendor" ? (
    <BussinessHeader />
  ) : (
    ""
  );
};

export default Header;
