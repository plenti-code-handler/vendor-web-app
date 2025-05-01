import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import BussinessHeader from "./BussinessHeader";
import AdminHeader from "./AdminHeader";
import Main from "./Main";

const ProtectedRoute = ({ children }) => {
  return (
    <>
      <BussinessHeader />
      <Main>{children}</Main>
    </>
  );
};

export default ProtectedRoute;
