"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ExpandableSearchButton = ({
  value = "",
  onChange,
  onSubmit,
  onClear,
  placeholder = "Search…",
  debounceMs = 300,
  minChars = 2,
  disabled = false,
  className = "",
  expandedClassName = "w-60 sm:w-60",
  "aria-label": ariaLabel = "Search",
}) => {
  const inputId = useId();
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const [expanded, setExpanded] = useState(Boolean(value));
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
    if (value) setExpanded(true);
  }, [value]);

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const emitChange = useCallback(
    (next) => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onChange?.(next), debounceMs);
    },
    [debounceMs, onChange]
  );

  const clear = useCallback(() => {
    clearTimeout(debounceRef.current);
    setDraft("");
    setExpanded(false);
    onChange?.("");
    onClear?.();
  }, [onChange, onClear]);

  const handleDraftChange = (next) => {
    setDraft(next);
    const trimmed = next.trim();
    if (!trimmed || trimmed.length >= minChars) emitChange(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      draft.trim() ? clear() : setExpanded(false);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      clearTimeout(debounceRef.current);
      const trimmed = draft.trim();
      if (trimmed.length >= minChars) {
        onChange?.(trimmed);
        onSubmit?.(trimmed);
      }
    }
  };

  return (
    <div
      className={`relative flex h-9 items-center overflow-hidden rounded-lg border border-blue-200 bg-gray-50 transition-[width] duration-300 ease-out ${
        expanded ? `${expandedClassName} shadow-sm` : "w-9"
      } ${className}`}
    >
      <button
        type="button"
        onClick={() => !disabled && setExpanded(true)}
        disabled={disabled || expanded}
        tabIndex={expanded ? -1 : 0}
        aria-label={ariaLabel}
        aria-expanded={expanded}
        title={ariaLabel}
        className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-200 ${
          expanded ? "pointer-events-none opacity-0" : "opacity-100 hover:bg-gray-100"
        } ${disabled ? "cursor-not-allowed" : ""}`}
      >
        <MagnifyingGlassIcon className="h-5 w-5 text-blue-600" />
      </button>

      <MagnifyingGlassIcon
        aria-hidden
        className={`pointer-events-none absolute left-2.5 h-4 w-4 text-blue-400 transition-opacity duration-200 ${
          expanded ? "opacity-100" : "opacity-0"
        }`}
      />

      <label htmlFor={inputId} className="sr-only">
        {ariaLabel}
      </label>
      <input
        id={inputId}
        ref={inputRef}
        type="search"
        value={draft}
        disabled={disabled || !expanded}
        placeholder={placeholder}
        autoComplete="off"
        enterKeyHint="search"
        tabIndex={expanded ? 0 : -1}
        onChange={(e) => handleDraftChange(e.target.value)}
        onBlur={() => !draft.trim() && setExpanded(false)}
        onKeyDown={handleKeyDown}
        className={`h-full w-full bg-transparent py-2 pl-8 pr-8 text-sm text-blue-600 placeholder:text-gray-400 focus:outline-none transition-opacity duration-200 ${
          expanded ? "opacity-100 delay-75" : "pointer-events-none opacity-0"
        }`}
      />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={clear}
        tabIndex={expanded ? 0 : -1}
        disabled={!expanded}
        aria-label="Clear search"
        title="Clear search"
        className={`absolute right-1.5 rounded-md p-1 text-blue-400 transition-opacity duration-200 hover:bg-blue-200 hover:text-blue-600 ${
          expanded ? "opacity-100 delay-100" : "pointer-events-none opacity-0"
        }`}
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ExpandableSearchButton;
