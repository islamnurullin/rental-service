import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FullOffer, Review, OffersList, ToggleFavoriteData } from '../types/offer';
import { getFullOFfer, getReviews, setFullOffersDataLoadingStatus } from './action';

type OffersState = {
  fullOffer: FullOffer | null;
  reviews: Review[];
  nearbyOffers: OffersList[];
  isFullOfferLoading: boolean;
  isReviewsLoading: boolean;
  error: string | null;
};

const initialState: OffersState = {
  fullOffer: null,
  reviews: [],
  nearbyOffers: [],
  isFullOfferLoading: false,
  isReviewsLoading: false,
  error: null
};

export const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    clearOfferData: (state) => {
      state.fullOffer = null;
      state.reviews = [];
      state.nearbyOffers = [];
      state.error = null;
    },
    setOfferError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(getFullOFfer, (state, action) => {
        state.fullOffer = action.payload;
      })
    .addCase(setFullOffersDataLoadingStatus, (state, action) => {
           state.isFullOfferLoading = action.payload;
    })
    .addCase(getReviews, (state, action) => {
        state.reviews = action.payload;
      })
    .addMatcher(
        (action) => action.type === `user/toggleFavorite/fulfilled`,
        (state, action: PayloadAction<ToggleFavoriteData>) => {
          const { offerId, status } = action.payload;
          // Обновляем fullOffer, если это тот же оффер
          if (state.fullOffer && state.fullOffer.id === offerId) {
            state.fullOffer.isFavorite = status === 1;
          }
        }
      );
  }
});

export const { clearOfferData, setOfferError } = offersSlice.actions;

export default offersSlice.reducer;