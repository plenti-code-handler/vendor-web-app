import { Switch } from "@headlessui/react";
import { MapPinIcon } from "@heroicons/react/24/outline";

const BADGE_TONES = {
  live: "bg-blue-50 text-blue-700 ring-blue-200",
  approved: "bg-green-50 text-green-700 ring-green-200",
  muted: "bg-slate-100 text-slate-500 ring-slate-200",
  warn: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
};

function StatusBadge({ tone = "muted", liveDot = false, children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${BADGE_TONES[tone]}`}
    >
      {liveDot ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
        </span>
      ) : null}
      {children}
    </span>
  );
}

function formatAmount(value) {
  if (value == null) return null;
  return value === Number.parseInt(value, 10) ? String(value) : String(value);
}

function couponTitle(coupon) {
  if (coupon.description) return coupon.description;
  const discount = formatAmount(coupon.discount_value);
  const max = formatAmount(coupon.max_discount);
  const site = coupon.site || "your store";
  if (max) return `Get flat ${discount}% off upto ${max} from ${site}`;
  return `Get flat ${discount}% off from ${site}`;
}

function couponMeta(coupon) {
  const parts = [];
  if (coupon.service) parts.push(coupon.service);
  if (coupon.min_order_value) parts.push(`Min ₹${formatAmount(coupon.min_order_value)}`);
  return parts.join(" · ");
}

export default function CouponCard({ coupon, onToggle, toggling }) {
  const active = coupon.is_active;
  const approved = coupon.approved === true;
  const rejected = coupon.approved === false;
  const pending = coupon.approved == null;
  const meta = couponMeta(coupon);
  const siteBadgeClass =
    "inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 ring-1 ring-inset ring-slate-200";

  return (
    <div
      className={`rounded-2xl border bg-white p-4 shadow-sm transition animate-slide-in-right ${
        active
          ? "border-green-600/40 ring-1 ring-green-600/20"
          : "border-slate-200/80 hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium leading-snug text-slate-900">
            {couponTitle(coupon)}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {active ? (
              <StatusBadge tone="live" liveDot>
                Live
              </StatusBadge>
            ) : null}
            {coupon.site ? (
              coupon.address_url ? (
                <a
                  href={coupon.address_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${siteBadgeClass} hover:text-[#5f22d9]`}
                >
                  <MapPinIcon className="h-3 w-3" />
                  {coupon.site}
                </a>
              ) : (
                <span className={siteBadgeClass}>{coupon.site}</span>
              )
            ) : null}
            {approved ? <StatusBadge tone="approved">Approved</StatusBadge> : null}
            {pending ? <StatusBadge tone="warn">Pending</StatusBadge> : null}
            {rejected ? <StatusBadge tone="danger">Rejected</StatusBadge> : null}
          </div>
          {meta ? <p className="text-xs text-slate-500">{meta}</p> : null}
        </div>

        <div className="flex shrink-0 items-center gap-2 pt-0.5">
          <Switch
            checked={active}
            disabled={toggling || (!active && !approved)}
            onChange={() => onToggle(coupon)}
            className="group relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-slate-200 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5f22d9]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-green-600"
          >
            <span className="sr-only">Toggle coupon</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                toggling ? "opacity-60" : ""
              } ${active ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </Switch>
          {toggling ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-green-600" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
