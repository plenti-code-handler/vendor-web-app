import { useEffect, useState } from "react";
import { arrowDown1, arrowDown2 } from "../../svgs";

const LanguageDropdown = ({ background, textColor, borderColor, width }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default to Swedish

  useEffect(() => {
    // Check if Google Translate cookie exists
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("googtrans="))
      ?.split("=")[1];

    // Set initial language from the cookie if available
    if (cookieValue) {
      setSelectedLanguage(cookieValue.split("/")[2]);
     
    } else {
      // If no cookie, set default language to Swedish
      changeLanguage("en");
    }
  }, []);

  const changeLanguage = (lang) => {
    // Set the Google Translate cookie for the chosen language
    const googleTranslateCookie = `/auto/${lang}`;
    document.cookie = `googtrans=${googleTranslateCookie};path=/`;
    document.cookie = `googtrans=${googleTranslateCookie};domain=.${window.location.hostname};path=/`;

    // Reload the page to apply the translation
    window.location.reload();
  };

  return (
    <form className="">
      <div
        className={`relative ${
          width === "small" ? "lg:w-[120px]" : "lg:w-[160px]"
        }  h-[38px]`}
      >
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={(e) => changeLanguage(e.target.value)}
          className={`${background ? `bg-${background}` : "bg-mainLight"} ${
            textColor ? `text-${textColor}` : "text-textLight"
          } border ${
            borderColor ? `border-${borderColor}` : "border-mainLight"
          }   text-sm rounded-lg w-full p-2.5  appearance-none`}
        >
          <option value="en" className="text-base">
            English
          </option>

          <option value="sv" className="text-base">
            Swedish
          </option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-end pr-2">
          {textColor ? arrowDown1 : arrowDown2}
        </div>
      </div>
    </form>
  );
};

export default LanguageDropdown;
