"use client";

// Parent layout is now a pass-through.
// Auth shell is applied only in /parent/login/page.jsx.
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchParentDetails,
  selectParentData,
  selectParentLoading,
} from "../../redux/slices/parentSlice";

export const ParentLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const parentData = useSelector(selectParentData);
  const parentLoading = useSelector(selectParentLoading);

  useEffect(() => {
    if (!pathname?.startsWith("/parent")) return;

    // Parent pages should always use the parent token directly (no outlet override).
    // Outlet access is handled when we navigate to `/business` after clicking a tile.
    localStorage.removeItem("target_vendor_id");

    const token = localStorage.getItem("token");

    // Only handle the exact `/parent` route.
    if (pathname === "/parent" || pathname === "/parent/login") {
      if (token) {
        router.replace("/parent/dashboard");
      } else {
        router.replace("/parent/login");
      }
      return;
    }

    // Fetch parent details only if missing.
    if (token && !parentData && !parentLoading) {
      dispatch(fetchParentDetails(token));
    }
  }, [pathname, router, dispatch, parentData, parentLoading]);

  useEffect(() => {
    if (!pathname?.startsWith("/parent")) return;
    if (parentData?.role) {
      localStorage.setItem("role", parentData.role);
    }
  }, [pathname, parentData]);

  return <>{children}</>;
};

export default ParentLayout;

