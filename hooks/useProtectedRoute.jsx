import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUserLocal } from "../redux/slices/loggedInUserSlice";

export const useProtectedRoute = (allowedRoles) => {
  const router = useRouter();

  useEffect(() => {
    router.push("/business");
  }, []);
};
