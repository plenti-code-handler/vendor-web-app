"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
    PublicLayout, 
    BusinessLayout,
    LandingLayout,
} from "./AllLayouts";

export const RouteLayout = ({ children }) => {
    const [isClient, setIsClient] = useState(false);
    const { user: loggedInUser } = useSelector((state) => state.loggedInUser);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/forget_password" ||
        pathname === "/verify" ||
        pathname === "/setup_password" ||
        pathname === "/setup_profile" ||
        pathname === "/awaiting" ||
        pathname === "/reset_password" ||
        pathname === "/verify_phone"
      ) {
    return <PublicLayout>{children}</PublicLayout>;
    } else if (pathname === "/") {
        return <LandingLayout>{children}</LandingLayout>;
    } else if (pathname.startsWith("/business")) {
        if (isClient && !localStorage.getItem("token")) {
            router.push("/");
            return null;
        }
        return <BusinessLayout>{children}</BusinessLayout>;
    } else {
        return <PublicLayout>{children}</PublicLayout>;
    }
};
    
export default RouteLayout;