"use client";

import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { setActivePage } from "../../../../redux/slices/headerSlice";
import SecondaryButton from "../../../buttons/SecondaryButton";

/**
 * Vendor-only entry to Reports (BETA). Replaces the greeting strip in the breadcrumb row.
 * Hidden on the reports route and outside /business.
 */
export default function ReportsButton({ className = "" }) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const dispatch = useDispatch();

  if (!pathname.startsWith("/business")) return null;
  if (pathname.startsWith("/business/reports")) return null;

  return (
    <SecondaryButton
      type="button"
      onClick={() => {
        dispatch(setActivePage("Reports"));
        router.push("/business/reports");
      }}
      className={`px-4 py-2 rounded-lg ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-lg bg-sky-600 p-1.5 text-[10px] font-bold leading-none tracking-wide text-sky-100">
          beta
        </span>
        <span>Go to Reports</span>
        <ArrowRightIcon className="h-4 w-4 shrink-0 text-[#5f22d9]" aria-hidden />
      </div>
    </SecondaryButton>
  );
}
