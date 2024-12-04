import { useEffect, useState } from "react";
import { arrowDownGray } from "../../svgs";

const BagsFilter = ({ selectedFilter, onFilterChange }) => {
  const [currLang, setCurrLang] = useState("en");

    useEffect(() => {
      if (typeof window !== "undefined") {
        const updateLangFromStorage = () => {
          const storedLang = localStorage.getItem("lang");
          if (storedLang) {
            setCurrLang(storedLang);
          }
        };

        const timeoutId = setTimeout(() => {
          updateLangFromStorage();
          window.addEventListener("storage", updateLangFromStorage);
        }, 2000);
        return () => {
          clearTimeout(timeoutId);
          window.removeEventListener("storage", updateLangFromStorage);
        };
      }
    }, []);

    useEffect(() => {
      if (typeof window !== "undefined" && document.body) {
        document.body.setAttribute("lang", currLang);
      }
    }, [currLang]);

  return (
    <form className="max-w-lg w-full lg:w-60">
      <div className="relative">
        <select
          id="bags"
          className="bg-grayFive text-grayThree text-sm font-semibold rounded-lg focus:ring-grayTwo focus:border-grayTwo block w-full p-2.5 appearance-none"
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="" className="text-base">
            {`All ${currLang === "en" ? "Bags" : "Pouches"}`}
          </option>
          <option value="scheduled" className="text-base">
            {`Scheduled ${currLang === "en" ? "Bags" : "Pouches"}`}
          </option>
          <option value="active" className="text-base">
            {`Active ${currLang === "en" ? "Bags" : "Pouches"}`}
          </option>
          <option value="past" className="text-base">
            {`Past ${currLang === "en" ? "Bags" : "Pouches"}`}
          </option>
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          {arrowDownGray}
        </div>
      </div>
    </form>
  );
};

export default BagsFilter;
