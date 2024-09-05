import React from "react";

const DrawerHeader = ({ dealTitle, setDealTitle, onAddClick }) => {
  return (
    <>
      <input
        type="text"
        value={dealTitle}
        onChange={(e) => setDealTitle(e.target.value)}
        placeholder="Bag Deal Title"
        className="placeholder-grayThree text-lg placeholder:font-bold focus:outline-none"
      />
      <button
        onClick={onAddClick}
        className="flex text-center justify-between bg-pinkBgDark text-white font-semibold py-2 px-7 rounded hover:bg-pinkBgDarkHover gap-2 lg:w-[25%]"
      >
        Add
      </button>
    </>
  );
};

export default DrawerHeader;
