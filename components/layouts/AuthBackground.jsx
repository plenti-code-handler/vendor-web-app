import {
  authBgBarLeftSvg,
  authBgCornerSvg,
  authBgSlightRightSvg,
  authBgTopBarSvg,
} from "../../svgs";
import React from "react";

const AuthBackground = () => {
  return (
    <div className="-z-10">
      <div className="absolute right-[30%] bottom-[0%]">
        {authBgSlightRightSvg}
      </div>
      <div className="absolute top-[0%] left-[0%]">{authBgBarLeftSvg}</div>
      <div className="absolute top-[0%] right-[30%]">{authBgTopBarSvg}</div>
      <div className="absolute left-[0%] bottom-[0%]">{authBgCornerSvg}</div>
    </div>
  );
};

export default AuthBackground;
