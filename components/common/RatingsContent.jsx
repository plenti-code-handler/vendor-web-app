import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { StarIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import {
  fetchReviews,
  selectRatingSummaryBars,
  selectRatingSummary,
  selectReviews,
  selectReviewsLoading,
  selectHasMoreReviews,
  selectReviewsLoadingMore,
} from "../../redux/slices/ratingSlice";
import RatingSummaryBars from "./RatingsSummarBars";

const RatingsContent = ({ reviewsSectionTitle = "All reviews", pageSize = 10 }) => {
  const dispatch = useDispatch();
  const summaryBars = useSelector(selectRatingSummaryBars);
  const summary = useSelector(selectRatingSummary);
  const reviews = useSelector(selectReviews);
  const loading = useSelector(selectReviewsLoading);
  const hasMoreReviews = useSelector(selectHasMoreReviews);
  const loadingMore = useSelector(selectReviewsLoadingMore);

  const handleLoadMore = () => {
    if (loadingMore || !hasMoreReviews) return;
    dispatch(fetchReviews({ skip: reviews.length, limit: pageSize, append: true }));
  };

  return (
    <>
      <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
        <RatingSummaryBars
          averageRating={summaryBars.averageRating}
          totalReviews={summaryBars.totalReviews}
          ratingPercentages={summaryBars.ratingPercentages}
        />
        {summary && (
          <>
            <div className="text-sm text-gray-600 mt-3">
              Last week avg: {summary.lagging_rating != null ? Number(summary.lagging_rating).toFixed(1) : "—"}
            </div>
            {summary.tags?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {summary.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-gray-200 text-xs text-gray-700">
                    {tag} {summary.tag_counts?.[i] != null ? `(${summary.tag_counts[i]})` : ""}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <h3 className="text-sm font-semibold text-gray-700 mb-3">{reviewsSectionTitle}</h3>
      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex gap-3">
                  <div className="shrink-0">
                    {r.user_profile_picture_url ? (
                      <img src={r.user_profile_picture_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-500">
                        {r.user_name?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-gray-900">{r.user_name}</span>
                      <span className="text-xs text-gray-500">
                        {r.created_at != null ? format(new Date(r.created_at * 1000), "MMM d, yyyy") : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarIcon
                          key={s}
                          className={`w-4 h-4 ${s <= r.rating ? "text-amber-500 fill-amber-500" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                    {r.review && <p className="text-sm text-gray-600 mt-1">{r.review}</p>}
                    {r.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {r.tags.map((t, i) => (
                          <span key={i} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {hasMoreReviews && (
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className={`px-4 py-2 rounded-md text-sm font-normal transition-colors duration-200 ${
                  loadingMore
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {loadingMore ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Load more"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default RatingsContent;