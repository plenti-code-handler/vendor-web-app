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

    const token = localStorage.getItem("token");

    // Only handle the exact `/parent` route.
    if (pathname === "/parent") {
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

  return <>{children}</>;
};

export default ParentLayout;

