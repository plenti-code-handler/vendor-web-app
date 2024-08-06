import React from "react";
import AddBagDrawer from "../drawers/AddBagDrawer";
import UpdatePasswordDrawer from "../drawers/UpdatePasswordDrawer";
import DeleteAccountDrawer from "../drawers/DeleteAccountDrawer";
import WithdrawAmountDrawer from "../drawers/WithdrawAmountDrawer";
import SuccessWithdrawDrawer from "../drawers/SuccessWithdrawDrawer";

const Drawers = () => {
  return (
    <>
      {true && <AddBagDrawer />}
      {true && <UpdatePasswordDrawer />}
      {true && <DeleteAccountDrawer />}
      {true && <WithdrawAmountDrawer />}
      {true && <SuccessWithdrawDrawer />}
    </>
  );
};

export default Drawers;
