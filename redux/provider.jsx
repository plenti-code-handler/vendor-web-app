"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { usePathname } from "next/navigation";
import {
  PublicLayout,
  AdminLayout,
  BusinessLayout,
  LandingLayout,
} from "../components/layouts/AllLayouts";

const Providers = ({ children }) => {
  const pathname = usePathname();

  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forget_password" ||
    pathname === "/verify" ||
    pathname === "/setup_password" ||
    pathname === "/setup_profile" ||
    pathname === "/awaiting" ||
    pathname === "/reset_password"
  ) {
    return (
      <Provider store={store}>
        <PublicLayout>{children}</PublicLayout>
      </Provider>
    );
  } else if (
    pathname === "/" ||
    pathname === "/about_us" ||
    pathname === "/faqs" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/contact_us"
  ) {
    return (
      <Provider store={store}>
        <LandingLayout>{children}</LandingLayout>
      </Provider>
    );
  } else if (pathname.startsWith("/admin")) {
    return (
      <Provider store={store}>
        <AdminLayout>{children}</AdminLayout>
      </Provider>
    );
  } else if (pathname.startsWith("/business")) {
    return (
      <Provider store={store}>
        <BusinessLayout>{children}</BusinessLayout>
      </Provider>
    );
  } else {
    return null;
  }
};

export default Providers;
