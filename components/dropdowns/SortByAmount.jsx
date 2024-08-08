import { arrowDownGray } from "../../svgs";

const SortByAmount = () => {
  return (
    <form className="md:w-[140%] lg:w-[200%]">
      <div className="relative">
        <select
          id="amounts"
          className="bg-grayFive text-grayThree text-sm font-semibold rounded-lg focus:ring-grayTwo focus:border-grayTwo block w-full p-2.5 appearance-none"
        >
          <option value="Highest to Lowest" className="text-base">
            Highest to Lowest
          </option>
          <option value="Highest to Lowest" className="text-base">
            Lowest to Highest
          </option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          {arrowDownGray}
        </div>
      </div>
    </form>
  );
};

export default SortByAmount;
