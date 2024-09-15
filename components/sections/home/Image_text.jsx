import React from "react";

export const Image_text = ({ heading, paragraph, image, classname }) => {
  return (
    <div
      className={`flex flex-col-reverse  justify-center items-center gap-[55px]  ${classname}`}
    >
      <div className=" sm:w-full m:w-1/2 l:w-1/2 xl:w-1/2 my-5 flex items-center justify-center">
        <img className="w-full h-full" src={image} />
      </div>
      <div className="  sm:w-full m:w-1/2 l:w-1/2 xl:w-1/2 flex flex-col gap-3">
        <h2 className="text-pinkTextOne text-[2.5em] font-bold">{heading}</h2>
        <p
          className="text-[1em] text-[#222] font-[500]"
          dangerouslySetInnerHTML={{ __html: paragraph }}
        ></p>
      </div>
    </div>
  );
};
export default Image_text; // Default export
