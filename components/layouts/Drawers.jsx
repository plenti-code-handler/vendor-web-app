import React from "react";
import AddBagDrawer from "../drawers/AddBagDrawer";
import AddCategoryDrawer from "../drawers/AddCategoryDrawer";
import UpdatePasswordDrawer from "../drawers/UpdatePasswordDrawer";
import DeleteAccountDrawer from "../drawers/DeleteAccountDrawer";
import WithdrawAmountDrawer from "../drawers/WithdrawAmountDrawer";
import SuccessWithdrawDrawer from "../drawers/SuccessWithdrawDrawer";
import EditBagDrawer from "../drawers/EditBagDrawer";

const Drawers = () => {
  return (
    <>
      {true && <AddBagDrawer />}
      {true && <AddCategoryDrawer />}
      {true && <UpdatePasswordDrawer />}
      {true && <DeleteAccountDrawer />}
      {true && <WithdrawAmountDrawer />}
      {true && <SuccessWithdrawDrawer />}
      {true && <EditBagDrawer />}
    </>
  );
};

export default Drawers;
