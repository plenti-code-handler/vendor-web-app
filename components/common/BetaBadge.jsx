"use client";
import { SparklesIcon } from "@heroicons/react/24/solid";


/**
 * Small blue “beta” pill used for Reports and other pre-GA surfaces.
 */
export default function BetaBadge({ className = "", children = "new" }) {
  return (
      <span
      className={`shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.1 text-[10px] font-semibold tracking-wide text-green-700 ring-1 ring-inset ring-green-600/20 flex items-center gap-0.5 ${className}`}
        aria-label="Beta"
      >
        {children}
      <SparklesIcon className="w-3 h-3 text-green-700" />
      </span>
  );
}
