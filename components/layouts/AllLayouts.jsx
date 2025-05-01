import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import AuthMain from "./AuthMain";
import AdminMain from "./AdminMain";
import Header from "./Header";

import Main from "./Main";
// import ContactDrawer from "../drawers/ContactDrawer";
import { BagsProvider } from "../../contexts/BagsContext";
import { AdminProvider } from "../../contexts/AdminContext";

export const PublicLayout = ({ children }) => {
  useProtectedRoute([]);

  return <AuthMain>{children}</AuthMain>;
};

export const AdminLayout = ({ children }) => {
  useProtectedRoute(["admin"]);

  return (
    <AdminProvider>
      <Header />
      <AdminMain>{children}</AdminMain>
    </AdminProvider>
  );
};

export const BusinessLayout = ({ children }) => {
  useProtectedRoute(["vendor"]);

  return (
    <BagsProvider>
      <Header />
      <Main>{children}</Main>
    </BagsProvider>
  );
};

export const LandingLayout = ({ children }) => {
  return (
    <>
      <div>{children}</div>
    </>
  );
};
