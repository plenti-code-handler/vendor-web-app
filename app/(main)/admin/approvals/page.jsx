import React from "react";
import TableContainer from "../../../../components/sections/admin/approvals/TableContainer";

const page = () => {
  return (
    <div className="flex flex-col w-[100%] md:w-[100%] mt-4 border border-[#E3E3E3] rounded-2xl p-6 lg:p-3 sm:px-4">
      <TableContainer />
    </div>
  );
};

export default page;
