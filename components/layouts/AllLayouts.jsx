import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import AuthMain from "./AuthMain";
import Header from "./Header";
import Main from "./Main";

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
