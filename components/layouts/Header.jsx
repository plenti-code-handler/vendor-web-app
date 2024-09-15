import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import AdminHeader from "./AdminHeader";
import BussinessHeader from "./BussinessHeader";
import LandingHeader from "./LandingHeader";
import { getUserLocal } from "../../redux/slices/loggedInUserSlice";

const Header = () => {
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  // const { pathname } = router;

  useEffect(() => {
    const user = getUserLocal();
    setUser(user);
  }, []);

  // Define routes based on conditions
  const landingRoutes = [
    "/",
    "/about_us",
    "/faqs",
    "/privacy",
    "/terms",
    "/contact_us",
    "/surprise",
    "/small_medium_bags",
    "/cookie_policy",
    "/deliever_return_policy",
    "/payment_terms",
    "/ugc_policy",
    "/security_policy",
    "/accessibility_policy",
    "/ethical_policy",
  ];
  const authRoutes = [
    "/awaiting",
    "/forget_password",
    "/login",
    "/register",
    "/reset_password",
    "/setup_password",
    "/setup_profile",
    "/verify",
  ];

  const isLandingRoute = landingRoutes.includes(pathname);
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isBusinessRoute = pathname.startsWith("/business");
  const isAdminRoute = pathname.startsWith("/admin");

  // Determine which header to display based on route and user role
  if (isAuthRoute) {
    return null; // No header for auth routes
  } else if (isLandingRoute) {
    return <LandingHeader />;
  } else if (isBusinessRoute && user?.role === "vendor") {
    return <BussinessHeader />;
  } else if (isAdminRoute && user?.role === "admin") {
    return <AdminHeader />;
  } else {
    return null; // Optionally handle other cases or default header
  }
};

export default Header;
