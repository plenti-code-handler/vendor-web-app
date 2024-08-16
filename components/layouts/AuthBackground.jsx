import {
  authBgBarLeftSvg,
  authBgCornerSvg,
  authBgSlightRightSvg,
  authBgTopBarSvg,
} from "../../svgs";
import React from "react";

const AuthBackground = () => {
  return (
    <>
      <div
        className="absolute"
        style={{
          right: "30%",
          bottom: "0%",
          zIndex: 1,
        }}
      >
        {authBgSlightRightSvg}
      </div>
      <div
        className="absolute top-[0%] left-[0%]"
        style={{
          zIndex: 2,
        }}
      >
        {authBgBarLeftSvg}
      </div>
      <div
        className="absolute top-[0%] right-[30%]"
        style={{
          zIndex: 0,
        }}
      >
        {authBgTopBarSvg}
      </div>
      <div
        className="absolute"
        style={{
          left: "0%",
          bottom: "0%",
          zIndex: 4,
        }}
      >
        {authBgCornerSvg}
      </div>
    </>
  );
};

export default AuthBackground;
