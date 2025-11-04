"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
    PublicLayout, 
    BusinessLayout,
    LandingLayout,
} from "./AllLayouts";

export const RouteLayout = ({ children }) => {
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    // ✅ Fix: Use PublicLayout for account processing
    if (pathname === "/accountProcessing") {
        return <LandingLayout>{children}</LandingLayout>;
    }

    if (
        pathname === "/verify_email" || 
        pathname === "/verify_otp" ||
        pathname === "/complete_profile" ||
        pathname === "/price-decision" ||
        pathname === "/terms" ||
        pathname === "/privacy"
    ) {
        return <LandingLayout>{children}</LandingLayout>;
    } else if (pathname === "/") {
        if (isClient && localStorage.getItem("token")) {
            router.push("/business");
            return null;
        }
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