import {
    authBgBarLeftSvg,
    authBgCornerSvg,
    authBgSlightRightSvg,
    authBgTopBarSvg,
  } from "../../svgs";
  import React from "react";
  
  const AuthBackground = () => {
    return (
      <div className="relative">
        <div
          className="absolute"
          style={{
            right: "-1100px",
            top: "200px",
            zIndex: 1,
          }}
        >
          {authBgSlightRightSvg}
        </div>
        <div
          className="absolute bottom-[-20px] left-[-20px]"
          style={{
            zIndex: 2, 
          }}
        >
          {authBgBarLeftSvg}
        </div>
        <div
          className="absolute bottom-[150px] left-[700px]"
          style={{
            zIndex: 0,
          }}
        >
          {authBgTopBarSvg}
        </div>
        <div
          className="absolute"
          style={{
            right: "-200px",
            top: "50px",
            zIndex: 4,
          }}
        >
          {authBgCornerSvg}
        </div>
      </div>
    );
  };
  
  export default AuthBackground;
  