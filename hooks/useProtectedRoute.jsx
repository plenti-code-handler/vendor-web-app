import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUserLocal } from "../redux/slices/loggedInUserSlice";

export const useProtectedRoute = (allowedRoles) => {
  const router = useRouter();
  const user = getUserLocal();

  useEffect(() => {
    if (!user && allowedRoles.length === 0) {
      // Public routes are allowed for unauthenticated users
      return;
    }

    if (user && allowedRoles.includes(user.role)) {
      // User is allowed on this route
      return;
    }

    if (user?.role === "admin") {
      router.push("/admin");
    } else if (user?.role === "vendor") {
      router.push("/business");
    } else {
      router.push("/");
    }
  }, [router, user, allowedRoles]);
};
