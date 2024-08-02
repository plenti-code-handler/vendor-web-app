import { arrowDownGray } from "../../svgs";

const BagsFilter = () => {
  return (
    <form className="max-w-lg mx-12 w-60">
      <div className="relative">
        <select
          id="bags"
          className="bg-white border  border-grayTwo text-grayThree text-sm font-semibold rounded-lg focus:ring-grayTwo focus:border-grayTwo block w-full p-2.5 appearance-none"
        >
          <option className="text-base">All Bags</option>
          <option value="large" className="text-base">
            Large Bags
          </option>
          <option value="surprise" className="text-base">
            Surprise Bags
          </option>
          <option value="small" className="text-base">
            Small Bags
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
