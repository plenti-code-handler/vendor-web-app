import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import RatingsContent from "../../../common/RatingsContent";
import {
  fetchRatingSummary,
  fetchReviews,
  selectSummaryError,
  selectReviewsError,
} from "../../../../redux/slices/ratingSlice";

const Rating = () => {
  const dispatch = useDispatch();
  const summaryError = useSelector(selectSummaryError);
  const reviewsError = useSelector(selectReviewsError);

  useEffect(() => {
    dispatch(fetchRatingSummary());
    dispatch(fetchReviews({ skip: 0, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (summaryError) toast.error(summaryError?.detail ?? "Failed to load rating summary");
  }, [summaryError]);
  useEffect(() => {
    if (reviewsError) toast.error(reviewsError?.detail ?? "Failed to load reviews");
  }, [reviewsError]);

  return (
    <div className="w-full">
      <RatingsContent reviewsSectionTitle="Recent Reviews" />
    </div>
  );
};

export default Rating;