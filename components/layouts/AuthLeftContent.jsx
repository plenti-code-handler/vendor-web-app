import React from "react";

const AuthLeftContent = () => {
  return (
    <div className="flex flex-col lg:w-[45%] items-center text-center mb-[5%] lg:mb-[0%]">
      <img
        alt="Foodie Finder Logo"
        src={"/auth_logo.png"}
        className="w-[60%] h-[80%] md:h-[40%] md:w-[40%] lg:h-[60%] lg:w-[55%]"
      />
      <div className="flex flex-col mt-4 lg:mt-6">
        <p className="text-[30px] font-semibold text-gray-800">
          possimus ea <span className="text-secondary">laboriosam </span>
          laboriosam
        </p>
        <p className="text-[14px] font-medium text-[#7E8299] leading-6 pl-[8%] pr-[8%]">
          Soluta quisquam qui animi dolor possimus dolorum ab aut iure. Repellat
          ut fugit incidunt dolor. Quia fuga et aperiam. Delectus ut praesentium
          quos reiciendis et sint labore cum. Voluptatibus ipsam sint.
        </p>
      </div>
    </div>
  );
};

export default AuthLeftContent;
