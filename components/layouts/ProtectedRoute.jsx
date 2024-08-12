import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import BussinessHeader from "./BussinessHeader";
import AdminHeader from "./AdminHeader";
import Main from "./Main"; // Import Main component if needed

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.loggedInUser.user);
  console.log({user});
  const router = useRouter();

  useEffect(() => {
    if (!user) {
        console.log("This here?")
      router.push("/"); // Redirect to login page if no user
    }
  }, [user, router]);

  if (!user) {
    return null; // Render nothing while redirecting
  }

  return (
    <>
      {user.role === "vendor" && <BussinessHeader />}
      {user.role === "admin" && <AdminHeader />}
      <Main>{children}</Main>
    </>
  );
};

export default ProtectedRoute;
