import { arrowDownGray } from "../../svgs";

const BagsFilter = ({ selectedFilter, onFilterChange }) => {
  return (
    <form className="max-w-lg w-full lg:w-60">
      <div className="relative">
        <select
          id="bags"
          className="bg-grayFive text-grayThree text-sm font-semibold rounded-lg focus:ring-grayTwo focus:border-grayTwo block w-full p-2.5 appearance-none"
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="All Bags" className="text-base">
            All Bags
          </option>
          <option value="Scheduled Bags" className="text-base">
            Scheduled Bags
          </option>
          <option value="Active Bags" className="text-base">
            Active Bags
          </option>
          <option value="Past Bags" className="text-base">
            Past Bags
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
