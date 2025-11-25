"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
    PublicLayout, 
    BusinessLayout,
    OnboardLayout,
} from "./AllLayouts";

export const RouteLayout = ({ children }) => {
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Public pages - accessible without token
    const publicPages = ["/terms", "/privacy", "/price-decision"];
    const isPublicPage = publicPages.includes(pathname);

    // Onboarding pages - handled by OnboardLayout with centralized routing
    const onboardPages = [
        "/",
        "/verify_email",
        "/verify_otp",
        "/complete_profile",
        "/accountProcessing"
    ];
    const isOnboardPage = onboardPages.includes(pathname);

    // Route to appropriate layout
    if (isPublicPage) {
        return <PublicLayout>{children}</PublicLayout>;
    } else if (isOnboardPage) {
        return <OnboardLayout>{children}</OnboardLayout>;
    } else if (pathname.startsWith("/business")) {
        // BusinessLayout will handle its own guard checks
        return <BusinessLayout>{children}</BusinessLayout>;
    } else {
        // Default to PublicLayout for unknown routes
        return <PublicLayout>{children}</PublicLayout>;
    }
};
    
export default RouteLayout;