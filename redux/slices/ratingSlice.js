import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../AxiosClient';

export const fetchRatingSummary = createAsyncThunk(
  'rating/fetchRatingSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/v1/vendor/review/summary/get');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch rating summary');
    }
  }
);

export const fetchReviews = createAsyncThunk(
  'rating/fetchReviews',
  async ({ skip = 0, limit = 10, append = false } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/v1/vendor/review/get', {
        params: { skip, limit },
      });
      const reviews = response.data ?? [];
      return { reviews, limit };
    } catch (error) {
      if (error.response?.status === 404) return { reviews: [], limit };
      return rejectWithValue(error.response?.data || 'Failed to fetch reviews');
    }
  }
);

const initialState = {
  summary: null,
  reviews: [],
  summaryLoading: false,
  summaryError: null,
  reviewsLoading: false,
  reviewsLoadingMore: false,
  reviewsError: null,
  hasMoreReviews: true,
};

const ratingSlice = createSlice({
  name: 'rating',
  initialState,
  reducers: {
    clearRatingData: (state) => {
      state.summary = null;
      state.reviews = [];
      state.summaryError = null;
      state.reviewsError = null;
      state.hasMoreReviews = true;
      state.reviewsLoadingMore = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRatingSummary.pending, (state) => {
        state.summaryLoading = true;
        state.summaryError = null;
      })
      .addCase(fetchRatingSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchRatingSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.summaryError = action.payload;
      })
      .addCase(fetchReviews.pending, (state, action) => {
        const append = action.meta.arg?.append ?? false;
        if (append) {
          state.reviewsLoadingMore = true;
        } else {
          state.reviewsLoading = true;
        }
        state.reviewsError = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        const { reviews, limit } = action.payload;
        const append = action.meta.arg?.append ?? false;
        state.reviewsLoading = false;
        state.reviewsLoadingMore = false;
        state.reviews = append ? [...state.reviews, ...reviews] : reviews;
        state.hasMoreReviews = reviews.length === limit;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        const append = action.meta.arg?.append ?? false;
        state.reviewsLoading = false;
        state.reviewsLoadingMore = false;
        if (!append) state.reviews = [];
        state.reviewsError = action.payload;
      });
  },
});

export const { clearRatingData } = ratingSlice.actions;

export const selectRatingSummary = (state) => state.rating.summary;
export const selectReviews = (state) => state.rating.reviews;
export const selectSummaryLoading = (state) => state.rating.summaryLoading;
export const selectReviewsLoading = (state) => state.rating.reviewsLoading;
export const selectSummaryError = (state) => state.rating.summaryError;
export const selectReviewsError = (state) => state.rating.reviewsError;
export const selectReviewsLoadingMore = (state) => state.rating.reviewsLoadingMore;
export const selectHasMoreReviews = (state) => state.rating.hasMoreReviews;

/** Derived from summary for RatingSummaryBars - single source of truth, no duplicate logic */
export const selectRatingSummaryBars = (state) => {
  const summary = state.rating.summary;
  if (!summary || summary.num_reviews == null) {
    return {
      averageRating: '0',
      totalReviews: 0,
      ratingPercentages: [0, 0, 0, 0, 0],
    };
  }
  const totalReviews = Number(summary.num_reviews);
  const averageRating = summary.avg_rating != null
    ? Number(summary.avg_rating).toFixed(1)
    : '0';
  const counts = [
    summary.five_star_reviews ?? 0,
    summary.four_star_reviews ?? 0,
    summary.three_star_reviews ?? 0,
    summary.two_star_reviews ?? 0,
    summary.one_star_reviews ?? 0,
  ];
  const ratingPercentages = totalReviews
    ? counts.map((c) => (c / totalReviews) * 100)
    : [0, 0, 0, 0, 0];
  return { averageRating, totalReviews, ratingPercentages };
};

export default ratingSlice.reducer;