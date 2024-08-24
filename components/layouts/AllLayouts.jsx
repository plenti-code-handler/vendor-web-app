import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import AuthMain from "./AuthMain";
import AdminMain from "./AdminMain";
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import ContactDrawer from "../drawers/ContactDrawer";
import { BagsProvider } from "../../contexts/BagsContext";

export const PublicLayout = ({ children }) => {
  useProtectedRoute([]);

  return <AuthMain>{children}</AuthMain>;
};

export const AdminLayout = ({ children }) => {
  useProtectedRoute(["admin"]);

  return (
    <>
      <Header />
      <AdminMain>{children}</AdminMain>
    </>
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
      {true && <ContactDrawer />}
      <Header />
      <div>{children}</div>
      <Footer />
    </>
  );
};
