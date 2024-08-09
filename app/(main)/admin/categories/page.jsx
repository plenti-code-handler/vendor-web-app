import React from "react";
import RestaurentBox from "../../../../components/sections/admin/categories/RestaurentBox";
import FoodFiltersBox from "../../../../components/sections/admin/categories/FoodFiltersBox";

const page = () => {
  return (
    <div className="flex w-[100%] gap-[5%] flex-col lg:flex-row p-8">
      <RestaurentBox />
      <FoodFiltersBox />
    </div>
  );
};

export default page;
