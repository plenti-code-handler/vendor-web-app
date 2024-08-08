import React from "react";
import CustomerProfileCard from "../../../../../../components/sections/admin/users/CustomerProfileCard";
import CustomerDetailTable from "../../../../../../components/sections/admin/users/CustomerDetailTable";

const page = () => {
  return (
    <div className="flex flex-col gap-5 w-[100%] lg:w-[100%] md:w-[60%] rounded-md p-3">
      <CustomerProfileCard />
      <CustomerDetailTable />
    </div>
  );
};

export default page;
