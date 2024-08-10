import { arrowDown } from "../../svgs";

const LanguageDropdown = () => {
  return (
    <form className="lg:mr-[8%]">
      <div className="relative w-[229px] h-[38px]">
        <select
          id="countries"
          className="bg-mainLight border border-mainLight text-textLight text-sm rounded-lg focus:ring-main focus:border-main w-full p-2.5 dark:bg-main dark:border-main dark:placeholder-main dark:text-white dark:focus:ring-main dark:focus:border-main appearance-none"
        >
          <option className="text-base">Choose Language</option>
          <option value="US" className="text-base">
            English
          </option>

          <option value="FR" className="text-base">
            Urdu
          </option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-end pr-2">
          {arrowDown}
        </div>
      </div>
    </form>
  );
};

export default LanguageDropdown;
