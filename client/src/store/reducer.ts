
import { createReducer, PayloadAction } from '@reduxjs/toolkit'; 

import {changeCity, favoriteOffersCityList, getUserInfo, offersCityList, requireAuthorization, setError, setOffersDataLoadingStatus} from './action'; 
import {AuthorizationStatus, CITIES_LOCATION} from '../const';
import { getCity } from '../utils';
import { AuthorizationStatusType } from '../types/authorization-status';
import { CityOffer, OffersList, ToggleFavoriteData } from '../types/offer';
import { UserData } from '../types/user-data';
import { store } from '.';

const defaultCity = getCity('Paris', CITIES_LOCATION);
export type InitialState = {
    city: CityOffer | undefined;
    offers: OffersList[];
    authorizationStatus: AuthorizationStatusType;
    error: string | null;
    isOffersDataLoading: boolean;
    userData: UserData | undefined;
    favoriteOffers: OffersList[];
}
const initialState: InitialState = {
    city: defaultCity,
    offers: [],
    authorizationStatus: AuthorizationStatus.Unknown,
    error: null,
    isOffersDataLoading: false,
    userData: undefined,
    favoriteOffers: [],
};

const reducer = createReducer(initialState, (builder) => {
    builder
    .addCase(changeCity, (state, action) => {
        state.city = action.payload;
    })
    .addCase(offersCityList, (state, action) => 
        { state.offers = action.payload;
    })
    .addCase(requireAuthorization, (state, action) => {
        state.authorizationStatus = action.payload;
    })
    .addCase(setError, (state, action) => {
        state.error = action.payload;
    })
    .addCase(setOffersDataLoadingStatus, (state, action) => {
           state.isOffersDataLoading = action.payload;
    }).addCase(getUserInfo, (state, action) => {
        state.userData = action.payload;
    })
    .addCase(favoriteOffersCityList, (state, action) => {
        state.favoriteOffers = action.payload;
    })
    .addMatcher(
      (action) => action.type === `user/toggleFavorite/fulfilled`,
      (state, action: PayloadAction<ToggleFavoriteData>) => {
        const { offerId, status } = action.payload;
        const shouldBeFavorite = status === 1;
        
        const offer = state.offers.find((item) => item.id === offerId);
        if (offer) {
          offer.isFavorite = shouldBeFavorite;
        }
        
        const favIndex = state.favoriteOffers.findIndex(
          (item) => item.id === offerId
        );
        
        if (shouldBeFavorite) {
          if (favIndex === -1 && offer) {
            state.favoriteOffers.push({ ...offer });
          }
        } else {
          if (favIndex !== -1) {
            state.favoriteOffers.splice(favIndex, 1);
          }
        }
      }
    );
});
export {reducer};