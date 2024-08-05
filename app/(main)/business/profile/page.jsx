import React from 'react';
import ProfileCard from "../../../../components/sections/bussiness/profile/ProfileCard";
import Transactions from "../../../../components/sections/bussiness/profile/Transactions";

const Page = () => {
  return (
    <div className='flex flex-col md:flex-row gap-4 p-3'>
      <ProfileCard />
      <Transactions />
    </div>
  );
};

export default Page;
