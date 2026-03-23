"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BeatLoader from "react-spinners/BeatLoader";
import { StarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, ShoppingCartIcon, ShoppingBagIcon } from "@heroicons/react/24/solid";
import { BanknotesIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";

import {
  fetchParentStats,
  selectParentStats,
  selectParentStatsLoading,
} from "../../../../redux/slices/parentSlice";
import ParentOutletsContent from "./ParentOutletsContent";

const formatInt = (n) =>
  Number(n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const formatCurrency = (n) =>
  `₹${Number(n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const getTrend = (current, prev) => {
  const safePrev = Number(prev ?? 0);
  const safeCurrent = Number(current ?? 0);

  if (!Number.isFinite(safePrev) || safePrev === 0) {
    return { direction: null, percent: null };
  }

  const pct = ((safeCurrent - safePrev) / safePrev) * 100;
  const rounded = Math.round(pct);

  if (rounded > 0) return { direction: "up", percent: rounded };
  if (rounded < 0) return { direction: "down", percent: rounded };
  return { direction: "flat", percent: 0 };
};

const TrendLine = ({ current, prev }) => {
  const trend = getTrend(current, prev);
  if (trend.direction === null) {
    return <span className="text-xs text-gray-400">—</span>;
  }
  if (trend.direction === "flat") {
    return <span className="text-xs text-gray-500">No change</span>;
  }

  const isUp = trend.direction === "up";
  const colorClass = isUp ? "text-green-600" : "text-red-600";
  const arrow = isUp ? (
    <ArrowTrendingUpIcon className={`w-4 h-4 ${colorClass}`} />
  ) : (
    <ArrowTrendingDownIcon className={`w-4 h-4 ${colorClass}`} />
  );

  const display = `${isUp ? "+" : ""}${trend.percent}%`;

  return (
    <span className={`text-xs flex items-center gap-1 ${colorClass}`}>
      {arrow}
      {display}
    </span>
  );
};

const MetricTile = ({ icon, value, subtext, trend }) => {
  // Keep the trend area width consistent across all tiles so the layout feels uniform.
  const trendBlock = (
    <div className="mt-3 min-w-[70px] flex-shrink-0 flex items-center">
      {trend?.prev != null ? (
        <TrendLine current={trend.current} prev={trend.prev} />
      ) : (
        <span className="text-xs flex items-center gap-1 text-gray-400">
        </span>
      )}
    </div>
  );

  return (
    <div className="border border-gray-200 rounded-xl px-4 sm:px-5 py-4 flex flex-col">
      <div className="flex items-start gap-2">
        <div className="text-gray-600 flex-shrink-0">{icon}</div>
        <div className="text-2xl sm:text-3xl font-semibold text-black leading-none whitespace-nowrap overflow-hidden text-ellipsis max-w-[130px]">
          {value}
        </div>
      </div>
      {trendBlock}
      <div className="mt-2 text-xs sm:text-xs font-semibold text-gray-600 leading-snug break-words">
        {subtext}
      </div>
    </div>
  );
};

const ParentDashboardContent = () => {
  const dispatch = useDispatch();
  const parentStats = useSelector(selectParentStats);
  const statsLoading = useSelector(selectParentStatsLoading);

  useEffect(() => {
    if (!parentStats && !statsLoading) {
      dispatch(fetchParentStats());
    }
  }, [dispatch, parentStats, statsLoading]);

  if (statsLoading && !parentStats) {
    return (
      <div className="flex items-center justify-center py-16">
        <BeatLoader color="#5F22D9" size={10} />
      </div>
    );
  }

  if (!parentStats) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-gray-500">No metrics available.</p>
      </div>
    );
  }

  const {
    avg_rating,
    last_week_avg_rating,
    total_revenue,
    last_week_total_revenue,
    total_orders,
    last_week_total_orders,
    total_bags_created,
    last_week_total_bags_created,
    total_outlets,
  } = parentStats;

  return (
    <div className="px-6 pt-10 pb-8 animate-slide-in-left">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-lg font-semibold text-gray-500 mt-10">Metrics</p>

        <div className="mt-2 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <MetricTile
            icon={<StarIcon className="w-7 h-7 text-pinkTextOne" />}
            value={Number(avg_rating ?? 0).toFixed(1)}
            subtext="Average rating"
            trend={{ current: avg_rating, prev: last_week_avg_rating }}
          />
          <MetricTile
            icon={<BanknotesIcon className="w-7 h-7 text-pinkTextOne" />}
            value={formatCurrency(total_revenue)}
            subtext="Total revenue"
            trend={{ current: total_revenue, prev: last_week_total_revenue }}
          />
          <MetricTile
            icon={<ShoppingCartIcon className="w-7 h-7 text-pinkTextOne" />}
            value={formatInt(total_orders)}
            subtext="Total orders"
            trend={{ current: total_orders, prev: last_week_total_orders }}
          />
          <MetricTile
            icon={<ShoppingBagIcon className="w-7 h-7 text-pinkTextOne" />}
            value={formatInt(total_bags_created)}
            subtext="Total bags created"
            trend={{ current: total_bags_created, prev: last_week_total_bags_created }}
          />
          <MetricTile
            icon={<BuildingStorefrontIcon className="w-7 h-7 text-pinkTextOne" />}
            value={formatInt(total_outlets)}
            subtext="Total outlets"
            trend={null}
          />
        </div>

        <ParentOutletsContent />
      </div>
    </div>
  );
};

export default ParentDashboardContent;

