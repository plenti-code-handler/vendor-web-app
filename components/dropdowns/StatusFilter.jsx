import { arrowDownGray } from "../../svgs";

const StatusFilter = ({ selectedFilter, onFilterChange }) => {
  return (
    <form className="w-full sm:w-[125px] lg:w-[200px]">
      <div className="relative">
        <select
          id="status"
          className="bg-grayFive text-grayThree text-sm font-semibold rounded-lg focus:ring-grayTwo focus:border-grayTwo block w-full p-2.5 appearance-none"
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="both" className="text-base">
            Both Status
          </option>
          <option value="cancel" className="text-base">
            Cancel
          </option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 lg:pr-1">
          {arrowDownGray}
        </div>
      </div>
    </form>
  );
};

export default StatusFilter;
