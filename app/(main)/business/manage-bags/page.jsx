import React from "react";
import TableContainer from "../../../../components/sections/bussiness/bags/TableContainer";

import ItemTemplates from "../../../../components/sections/bussiness/bags/ItemTemplates";

const Page = () => {
  return (
    <div className="flex flex-col">
      <TableContainer />
      <ItemTemplates />
    </div>
  );
};

export default Page;
