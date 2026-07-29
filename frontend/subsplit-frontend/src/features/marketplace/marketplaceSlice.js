import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {

  fetchMarketplaceListingsApi,
  fetchMarketplaceCategoriesApi,
  fetchTopHostsApi,
  fetchListingByIdApi,
  createListingApi,
  fetchMyListingsApi,
  fetchSimilarListingsApi,
  fetchListingReviewsApi,
  submitJoinRequestApi,
  checkJoinStatusApi,
  fetchMyJoinRequestsApi,
  fetchHostJoinRequestsApi,
  acceptJoinRequestApi,
  rejectJoinRequestApi,
} from './api/marketplaceApi';
import { normalizeListing } from './utils/normalizeListing';

export const fetchMyJoinRequests = createAsyncThunk(
  'marketplace/fetchMyJoinRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchMyJoinRequestsApi();
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch join requests');
    }
  }
);

export const fetchHostJoinRequests = createAsyncThunk(
  'marketplace/fetchHostJoinRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchHostJoinRequestsApi();
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch host join requests');
    }
  }
);

export const acceptJoinRequest = createAsyncThunk(
  'marketplace/acceptJoinRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await acceptJoinRequestApi(requestId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept join request');
    }
  }
);

export const rejectJoinRequest = createAsyncThunk(
  'marketplace/rejectJoinRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await rejectJoinRequestApi(requestId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject join request');
    }
  }
);




export const fetchMarketplaceListings = createAsyncThunk(
  'marketplace/fetchListings',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await fetchMarketplaceListingsApi(filters);
      const rawListings = response.data?.content || response.data || [];
      const normalized = rawListings.map(normalizeListing).filter(Boolean);

      return {
        listings: normalized,
        pagination: {
          pageNumber: response.data?.pageNumber || 0,
          pageSize: response.data?.pageSize || 10,
          totalElements: response.data?.totalElements || normalized.length,
          totalPages: response.data?.totalPages || 1,
          last: response.data?.last ?? true,
        },
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch listings');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'marketplace/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchMarketplaceCategoriesApi();
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchTopHosts = createAsyncThunk(
  'marketplace/fetchTopHosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchTopHostsApi();
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch top hosts');
    }
  }
);

export const fetchListingDetails = createAsyncThunk(
  'marketplace/fetchListingDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchListingByIdApi(id);
      if (response.data) {
        return normalizeListing(response.data);
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch listing details');
    }
  }
);

export const createNewListing = createAsyncThunk(
  'marketplace/createListing',
  async (listingData, { rejectWithValue }) => {
    try {
      const response = await createListingApi(listingData);
      return normalizeListing(response.data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create listing');
    }
  }
);

export const fetchMyListings = createAsyncThunk(
  'marketplace/fetchMyListings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchMyListingsApi();
      const raw = response.data || [];
      return raw.map(normalizeListing).filter(Boolean);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user listings');
    }
  }
);

export const fetchSimilarListings = createAsyncThunk(
  'marketplace/fetchSimilarListings',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchSimilarListingsApi(id);
      const raw = response.data || [];
      return raw.map(normalizeListing).filter(Boolean);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch similar listings');
    }
  }
);

export const fetchListingReviews = createAsyncThunk(
  'marketplace/fetchListingReviews',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchListingReviewsApi(id);
      return response.data || null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const submitJoinRequest = createAsyncThunk(
  'marketplace/submitJoinRequest',
  async ({ listingId, message }, { rejectWithValue }) => {
    try {
      const response = await submitJoinRequestApi(listingId, { message });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit join request');
    }
  }
);

export const checkJoinStatus = createAsyncThunk(
  'marketplace/checkJoinStatus',
  async (listingId, { rejectWithValue }) => {
    try {
      const response = await checkJoinStatusApi(listingId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check join status');
    }
  }
);

const initialState = {
  listings: [],
  categories: [],
  topHosts: [],
  myListings: [],
  myJoinRequests: [],
  hostJoinRequests: [],
  selectedListing: null,
  similarListings: [],

  currentReviews: null,
  joinRequestStatus: null,
  loading: false,
  detailsLoading: false,
  error: null,
  pagination: {
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 1,
    last: true,
  },
  filters: {
    search: '',
    category: 'All',
    platforms: [],
    priceRange: 600,
    verifiedOnly: false,
    instantOnly: false,
    sortBy: 'trending',
  },
};

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSelectedListing: (state, action) => {
      state.selectedListing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMarketplaceListings
      .addCase(fetchMarketplaceListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketplaceListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload.listings;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMarketplaceListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchCategories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // fetchTopHosts
      .addCase(fetchTopHosts.fulfilled, (state, action) => {
        state.topHosts = action.payload;
      })
      // fetchListingDetails
      .addCase(fetchListingDetails.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchListingDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedListing = action.payload;
      })
      .addCase(fetchListingDetails.rejected, (state) => {
        state.detailsLoading = false;
        state.selectedListing = null;
      })
      // createNewListing
      .addCase(createNewListing.fulfilled, (state, action) => {
        state.listings.unshift(action.payload);
        state.myListings.unshift(action.payload);
      })
      // fetchMyListings
      .addCase(fetchMyListings.fulfilled, (state, action) => {
        state.myListings = action.payload;
      })
      // fetchSimilarListings
      .addCase(fetchSimilarListings.fulfilled, (state, action) => {
        state.similarListings = action.payload;
      })
      // fetchListingReviews
      .addCase(fetchListingReviews.fulfilled, (state, action) => {
        state.currentReviews = action.payload;
      })
      // submitJoinRequest
      .addCase(submitJoinRequest.fulfilled, (state, action) => {
        state.joinRequestStatus = action.payload;
      })
      // checkJoinStatus
      .addCase(checkJoinStatus.fulfilled, (state, action) => {
        state.joinRequestStatus = action.payload;
      })
      // fetchMyJoinRequests
      .addCase(fetchMyJoinRequests.fulfilled, (state, action) => {
        state.myJoinRequests = action.payload;
      })
      // fetchHostJoinRequests
      .addCase(fetchHostJoinRequests.fulfilled, (state, action) => {
        state.hostJoinRequests = action.payload;
      })
      // acceptJoinRequest
      .addCase(acceptJoinRequest.fulfilled, (state, action) => {
        const updated = action.payload;
        state.hostJoinRequests = state.hostJoinRequests.map((r) =>
          r.id === updated.id ? { ...r, status: 'APPROVED' } : r
        );
      })
      // rejectJoinRequest
      .addCase(rejectJoinRequest.fulfilled, (state, action) => {
        const updated = action.payload;
        state.hostJoinRequests = state.hostJoinRequests.map((r) =>
          r.id === updated.id ? { ...r, status: 'REJECTED' } : r
        );
      });
  },
});



export const { setFilter, resetFilters, setSelectedListing } = marketplaceSlice.actions;
export default marketplaceSlice.reducer;

