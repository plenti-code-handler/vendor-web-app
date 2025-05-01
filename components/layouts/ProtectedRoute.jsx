import BussinessHeader from "./BussinessHeader";

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
