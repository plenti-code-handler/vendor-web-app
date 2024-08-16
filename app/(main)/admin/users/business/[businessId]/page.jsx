import React from "react";
import BusinessProfileCard from "../../../../../../components/sections/admin/users/BusinessProfileCard";
import BusinessDetailTable from "../../../../../../components/sections/admin/users/BusinessDetailTable";

const page = () => {
  return (
    <div className="flex flex-col gap-5 w-[100%] lg:w-[100%] rounded-md p-3">
      <BusinessProfileCard />
      <BusinessDetailTable />
    </div>
  );
};

export default page;
