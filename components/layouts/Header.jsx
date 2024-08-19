import React from "react";
import AdminHeader from "./AdminHeader";
import BussinessHeader from "./BussinessHeader";
import LandingHeader from "./LandingHeader";
import { getUserLocal } from "../../redux/slices/loggedInUserSlice";

const Header = () => {
  const user = getUserLocal();

  return user?.role === "admin" ? (
    <AdminHeader />
  ) : user?.role === "vendor" ? (
    <BussinessHeader />
  ) : (
    <LandingHeader />
  );
};

export default Header;
