import { arrowDownGray } from "../../svgs";

const ApprovalsFilter = () => {
  return (
    <form className="max-w-lg mx-12 w-60">
      <div className="relative">
        <select
          id="bags"
          className="bg-grayFive text-grayThree text-sm font-semibold rounded-lg focus:ring-grayTwo focus:border-grayTwo block w-full p-2.5 appearance-none"
        >
          <option value="All People" className="text-base">
            All People
          </option>
          <option value="Newest First" className="text-base">
            Newest First
          </option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          {arrowDownGray}
        </div>
      </div>
    </form>
  );
};

export default ApprovalsFilter;
