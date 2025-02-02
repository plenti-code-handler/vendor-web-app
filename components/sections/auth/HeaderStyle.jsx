import React from "react";
import {
  headerTopLeftSvg,
  headerTopLeftSvgInnerTop,
  headerTopRightSvg,
} from "../../../svgs";

const HeaderStyle = () => {
  return (
    <div className="relative w-full min-h-[100px] rounded-[24px]">
      <div
        className="absolute rounded-2xl"
        style={{
          right: "0px",
        }}
      >
        {headerTopRightSvg}
      </div>
      <div className="absolute">{headerTopLeftSvg}</div>
      <div className="absolute">{headerTopLeftSvgInnerTop}</div>
    </div>
  );
};

export default HeaderStyle;
