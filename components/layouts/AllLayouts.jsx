import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import AuthMain from "./AuthMain";
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import ContactDrawer from "../drawers/ContactDrawer";

export const PublicLayout = ({ children }) => {
  useProtectedRoute([]);

  return <AuthMain>{children}</AuthMain>;
};

export const AdminLayout = ({ children }) => {
  useProtectedRoute(["admin"]);

  return (
    <>
      <Header />
      <Main>{children}</Main>
    </>
  );
};

export const BusinessLayout = ({ children }) => {
  useProtectedRoute(["vendor"]);

  return (
    <>
      <Header />
      <Main>{children}</Main>
    </>
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
