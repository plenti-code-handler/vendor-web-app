import React from "react";
import CardsRow from "../../../../components/sections/admin/transactions/CardsRow";
import TableContainer from "../../../../components/sections/admin/transactions/TableContainer";

const page = () => {
  return (
    <>
      <CardsRow />
      <div className="flex flex-col w-[100%] lg:w-[100%] md:w-[60%] mt-4 border border-[#E3E3E3] rounded-2xl p-6 lg:p-3 sm:px-4">
        <TableContainer />
      </div>
    </>
  );
};

export default page;
