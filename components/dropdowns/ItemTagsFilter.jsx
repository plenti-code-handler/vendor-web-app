import { useState } from "react";

const ItemTagsFilter = ({ selectedFilter, onFilterChange }) => {
  const options = [
    { value: "GLUTEN_FREE", label: "Gluten Free" },
    { value: "VEGAN", label: "Vegan" },
    { value: "VEGETARIAN", label: "Vegetarian" },
    { value: "HALAL", label: "Halal" },
    { value: "KOSHER", label: "Kosher" },
    { value: "ORGANIC", label: "Organic" },
    { value: "NON_GMO", label: "Non GMO" },
    { value: "LOW_CALORIES", label: "Low Calories" },
  ];

  const [selectedFilters, setSelectedFilters] = useState(selectedFilter || []);

  const handleSelectionChange = (value) => {
    let updatedFilters;
    if (selectedFilters.includes(value)) {
      // Remove if already selected
      updatedFilters = selectedFilters.filter((tag) => tag !== value);
    } else {
      // Add new selection
      updatedFilters = [...selectedFilters, value];
    }
    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <form className="w-full space-y-2 mt-3">
      <div className="flex flex-col">
        <p className="text-black font-bold text-xl">Choose Item Tags</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              value={option.value}
              checked={selectedFilters.includes(option.value)}
              onChange={() => handleSelectionChange(option.value)}
              className="w-4 h-4 text-grayTwo bg-grayFive border-grayThree rounded focus:ring-grayTwo"
            />
            <span className="text-sm text-grayThree">{option.label}</span>
          </label>
        ))}
      </div>
    </form>
  );
};

export default ItemTagsFilter;
