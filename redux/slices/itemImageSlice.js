import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../AxiosClient';

// Async thunk to fetch item images
export const fetchItemImages = createAsyncThunk(
  'itemImage/fetchItemImages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/v1/vendor/item/image/get");
      console.log("item images response", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch item images');
    }
  }
);

const itemImageSlice = createSlice({
  name: 'itemImage',
  initialState: {
    itemTypes: {}, // Will store { MEAL: { image_url, image_key, id }, BAKED_GOODS: {...}, etc. }
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearItemImageError: (state) => {
      state.error = null;
    },
    resetItemImages: (state) => {
      state.itemTypes = {};
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    },
    updateItemImage: (state, action) => {
      const { item_type, image_url, image_key, id } = action.payload;
      state.itemTypes[item_type] = { image_url, image_key, id };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch item images
      .addCase(fetchItemImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItemImages.fulfilled, (state, action) => {
        state.loading = false;
        // Transform array response into object with item_type as keys
        const itemTypesObj = {};
        action.payload.forEach(item => {
          itemTypesObj[item.item_type] = {
            image_url: item.image_url,
            image_key: item.image_key,
            id: item.id,
            vendor_id: item.vendor_id
          };
        });
        state.itemTypes = itemTypesObj;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchItemImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearItemImageError, resetItemImages, updateItemImage } = itemImageSlice.actions;
export default itemImageSlice.reducer;

