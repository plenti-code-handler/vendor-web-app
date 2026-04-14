"use client";

/**
 * Small blue “beta” pill used for Reports and other pre-GA surfaces.
 */
export default function BetaBadge({ className = "", children = "beta" }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white ${className}`}
      aria-label="Beta"
    >
      {children}
    </span>
  );
}
