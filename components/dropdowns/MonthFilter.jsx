import { arrowDownGray } from "../../svgs";

const MonthFilter = () => {
  return (
    <form className="w-full md:w-auto lg:w-[174px]">
      <div className="relative">
        <select
          id="months"
          className="bg-grayFive text-grayThree text-sm font-semibold rounded-lg focus:ring-grayTwo focus:border-grayTwo block w-full p-2.5 appearance-none"
        >
          <option value="This Month" className="text-base">
            This Month
          </option>
          <option value="Previous Month" className="text-base">
            Previous Month
          </option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          {arrowDownGray}
        </div>
      </div>
    </form>
  );
};

export default MonthFilter;
