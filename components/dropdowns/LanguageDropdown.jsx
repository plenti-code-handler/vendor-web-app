import { arrowDown } from "../../svgs";

const LanguageDropdown = () => {
  return (
    <form className="max-w-lg mx-12 w-60">
      <div className="relative">
        <select
          id="countries"
          className="bg-mainLight border border-mainLight text-textLight text-sm rounded-lg focus:ring-main focus:border-main block w-full p-2.5 dark:bg-main dark:border-main dark:placeholder-main dark:text-white dark:focus:ring-main dark:focus:border-main appearance-none"
        >
          <option className="text-base">Choose Language</option>
          <option value="US" className="text-base">
            English
          </option>
          <option value="CA" className="text-base">
            Sindhi
          </option>
          <option value="FR" className="text-base">
            Urdu
          </option>
          <option value="DE" className="text-base">
            Punjabi
          </option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          {arrowDown}
        </div>
      </div>
    </form>
  );
};

export default LanguageDropdown;
