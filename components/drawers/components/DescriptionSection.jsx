import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import InfoIcon from "../../common/InfoIcon";

const MAX_DESCRIPTION_LENGTH = 255;
const MOBILE_FONT_SIZE = "16px";
const MENU_PORTAL_Z_INDEX = 10000000;

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "48px",
    borderColor: state.isFocused ? "#5F22D9" : "#e5e7eb",
    borderRadius: "0.5rem",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(95, 34, 217, 0.2)" : "none",
    WebkitTapHighlightColor: "transparent",
    touchAction: "manipulation",
    "&:hover": {
      borderColor: "#5F22D9",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "8px 12px",
  }),
  option: (base, state) => ({
    ...base,
    minHeight: "44px",
    padding: "12px 16px",
    fontSize: MOBILE_FONT_SIZE,
    lineHeight: "1.25",
    whiteSpace: "normal",
    wordBreak: "break-word",
    backgroundColor: state.isSelected
      ? "#5F22D9"
      : state.isFocused
        ? "#f3f0ff"
        : "white",
    color: state.isSelected ? "white" : "#1f2937",
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
    fontSize: MOBILE_FONT_SIZE,
  }),
  input: (base) => ({
    ...base,
    fontSize: MOBILE_FONT_SIZE,
    color: "#111827",
    margin: 0,
    padding: 0,
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: MOBILE_FONT_SIZE,
    color: "#111827",
    whiteSpace: "normal",
    wordBreak: "break-word",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "0.5rem",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: MENU_PORTAL_Z_INDEX,
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: "min(240px, 40vh)",
    WebkitOverflowScrolling: "touch",
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: "8px",
    cursor: "pointer",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "8px",
    cursor: "pointer",
  }),
};

const DescriptionSection = ({
  description,
  setDescription,
  availableDescriptions,
  pricingId = "default",
}) => {
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);
  const allowCustomDescription = pricingId === "default" || pricingId == null;

  useEffect(() => {
    setMenuPortalTarget(document.body);
  }, []);

  const options = useMemo(
    () => availableDescriptions.map((desc) => ({ value: desc, label: desc })),
    [availableDescriptions]
  );

  const value = description ? { value: description, label: description } : null;

  const handleChange = (option) => {
    setDescription(option?.value ?? "");
  };

  const handleCreate = (inputValue) => {
    setDescription(inputValue.trim());
  };

  const commonProps = {
    options,
    value,
    onChange: handleChange,
    styles: selectStyles,
    classNamePrefix: "description-select",
    placeholder: allowCustomDescription
      ? "Search, select, or type a new description..."
      : "Search and select a description...",
    isClearable: true,
    isSearchable: true,
    blurInputOnSelect: true,
    closeMenuOnSelect: true,
    menuShouldScrollIntoView: true,
    menuShouldBlockScroll: true,
    menuPlacement: "auto",
    maxMenuHeight: 240,
    menuPortalTarget,
    menuPosition: "fixed",
    inputProps: {
      autoComplete: "off",
      autoCorrect: "off",
      spellCheck: "false",
      enterKeyHint: allowCustomDescription ? "done" : "search",
    },
    noOptionsMessage: ({ inputValue }) =>
      allowCustomDescription && inputValue.trim()
        ? "Tap Add below or press Done on keyboard"
        : "No matching descriptions",
    "aria-label": "Item description",
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Item Description</h3>
        <InfoIcon content="Describe your item to attract customers" />
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
        {availableDescriptions.length === 0 && !allowCustomDescription ? (
          <p className="text-sm text-gray-600">
            No descriptions available for this pricing. Add descriptions in Pricing
            Management first.
          </p>
        ) : allowCustomDescription ? (
          <>
            <CreatableSelect
              {...commonProps}
              onCreateOption={handleCreate}
              formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
              isValidNewOption={(inputValue) => {
                const trimmed = inputValue.trim();
                return (
                  trimmed.length > 0 &&
                  trimmed.length <= MAX_DESCRIPTION_LENGTH &&
                  !availableDescriptions.some(
                    (desc) => desc.toLowerCase() === trimmed.toLowerCase()
                  )
                );
              }}
            />
            {description && (
              <p className="mt-2 text-xs text-gray-500">
                {description.length}/{MAX_DESCRIPTION_LENGTH} characters
              </p>
            )}
          </>
        ) : (
          <Select {...commonProps} />
        )}
      </div>
    </div>
  );
};

export default DescriptionSection;
