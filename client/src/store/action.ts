
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CityOffer, FullOffer, OffersList, Review, ToggleFavoriteData } from '../types/offer';
import { AuthorizationStatusType } from '../types/authorization-status';
import { UserData } from '../types/user-data';
import { AppDispatch } from '.';
import { State } from '../types/state';
import { AxiosInstance } from 'axios';
import { APIRoute } from '../const';


const changeCity = createAction( 'offers/changeCity', (city: CityOffer) => ({ payload: city}));
const offersCityList = createAction( 'offers/offersCityList', (offers: OffersList[]) => ({ payload: offers}));
const reviewsList = createAction( 'offers/reviews', (reviews: Review[]) => ({ payload: reviews}));
const addReview = createAction<Review>('offersreviews/add');
const requireAuthorization = createAction<AuthorizationStatusType>('user/requireAuthorization');
const setError = createAction('setError', (error: string | null) =>({
    payload: error
}));
const setOffersDataLoadingStatus = createAction<boolean>('data/setOffersDataLoadingStatus');
const getFullOFfer = createAction('data/fetchFullOffer', (fullOffer: FullOffer) => ({ payload: fullOffer}));
const setFullOffersDataLoadingStatus = createAction<boolean>('data/setFullOffersDataLoadingStatus');
const getReviews = createAction( 'comments/getReviews', (reviews: Review[]) => ({ payload: reviews}));
const setReviewLoadingStatus = createAction<boolean>('data/isReviewsLoading');
const getUserInfo = createAction('login/getUserInfo', (userData: UserData) => ({ payload: userData}));
const favoriteOffersCityList = createAction(
  'offers/favoriteOffersCityList', 
  (favoriteOffers: OffersList[]) => {
    return { payload: favoriteOffers };
  }
);
const toggleFavoriteAction = createAsyncThunk<
  ToggleFavoriteData, 
  ToggleFavoriteData,
  {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
  }
>(
  'user/toggleFavorite',
  async ({ offerId, status }, { extra: api }) => {
    await api.post(`${APIRoute.Favorite}/${offerId}/${status}`);
    
    return { offerId, status };
  }
);
export {changeCity, reviewsList, addReview, requireAuthorization, setError, 
    setOffersDataLoadingStatus, getFullOFfer, getReviews, setFullOffersDataLoadingStatus,
setReviewLoadingStatus, getUserInfo, favoriteOffersCityList, offersCityList, toggleFavoriteAction };