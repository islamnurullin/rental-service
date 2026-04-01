import {AxiosInstance} from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {AppDispatch, State} from '../types/state.js';
import { FullOffer, OffersList, Review } from '../types/offer.js';
import {favoriteOffersCityList, getFullOFfer, getReviews, getUserInfo, offersCityList, requireAuthorization, setError, setFullOffersDataLoadingStatus, setOffersDataLoadingStatus, setReviewLoadingStatus} from './action.js';
import {saveToken, dropToken, getToken} from '../services/token.js';
import {APIRoute, AuthorizationStatus} from '../const.js';
import {AuthData, UserData} from '../types/user-data.js';
import { store } from './index.js';

const TIMEOUT_SHOW_ERROR = 2000;

const fetchOffersAction = createAsyncThunk<void, undefined, {
 dispatch: AppDispatch;
 state: State;
 extra: AxiosInstance;
}>(
 'data/fetchOffers',
 async (_arg, {dispatch, extra: api}) => {
  dispatch(setOffersDataLoadingStatus(true));
   const {data} = await api.get<OffersList[]>(APIRoute.Offers);
   dispatch(setOffersDataLoadingStatus(false));
   dispatch(offersCityList(data));
 },
);

const checkAuthAction = createAsyncThunk<void, undefined, {
   dispatch: AppDispatch;
   state: State;
   extra: AxiosInstance;
 }>(
   'user/checkAuth',
   async (_arg, {dispatch, extra: api}) => {
     try {
      const token = getToken();
      const {data} =  await api.get(
        `${APIRoute.Login}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(requireAuthorization(AuthorizationStatus.Auth));
      dispatch(getUserInfo(data));
     } catch {
       dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
     }
   },
 );


const logoutAction = createAsyncThunk<void, undefined, {
 dispatch: AppDispatch;
 state: State;
 extra: AxiosInstance;
}>(
 'user/logout',
 async (_arg, {dispatch, extra: api}) => {
   await api.delete(APIRoute.Logout);
   dropToken();
   dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
 },
);
const clearErrorAction = createAsyncThunk(
   'clearError',
   () => {
     setTimeout(
       () => store.dispatch(setError(null)),
       TIMEOUT_SHOW_ERROR,
     );
   },
 );
 
const loginAction = createAsyncThunk<
  UserData,       
  AuthData,       
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>(
  'user/login',
  async ({ email, password }, { dispatch, extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.post<UserData>(APIRoute.Login, { email, password });
      saveToken(data.token);
      dispatch(requireAuthorization(AuthorizationStatus.Auth));
      dispatch(setError(null)); 
      return data;
    } catch (err) {
      dropToken();
      dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
      dispatch(setError('Неверный логин или пароль')); 
      return rejectWithValue('Login failed');
    }
  }
);

const fetchFullOfferAction = createAsyncThunk<void, string, {
 dispatch: AppDispatch;
 state: State;
 extra: AxiosInstance;
}>(
 'data/fetchFullOffer',
 async (offerId, {dispatch, extra: api}) => {
  dispatch(setFullOffersDataLoadingStatus(true));
   const { data } = await api.get<FullOffer>(`${APIRoute.Offers}/${offerId}`);
   dispatch(getFullOFfer(data));
   dispatch(setFullOffersDataLoadingStatus(false));
 },
);

const fetchReviewsAction = createAsyncThunk<void, string, {dispatch: AppDispatch;state: State;extra: AxiosInstance;}>(
 'comments/getReviews',
 async (offerId, {dispatch, extra: api}) => {
  dispatch(setOffersDataLoadingStatus(true));
   const { data } = await api.get<Review[]>(`${APIRoute.Comments}/${offerId}`);
   dispatch(getReviews(data));
 },
);

const postReviewAction = createAsyncThunk<
  Review[],
  { offerId: string; reviewData: Review },
  { dispatch: AppDispatch; state: State; extra: AxiosInstance; rejectValue: string }
>(
  'comments/postReview',
  async ({ offerId, reviewData }, { dispatch, extra: api, rejectWithValue }) => {
    try {
      const token = getToken();
      
      if (!token) {
        return rejectWithValue('No authorization token');
      }
      await api.post(
        `${APIRoute.Comments}/${offerId}`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data } = await api.get<Review[]>(`${APIRoute.Comments}/${offerId}`);
      dispatch(getReviews(data));
      return data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('jwt-token');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to post review');
    }
  }
);

const fetchFavoriteOffersAction = createAsyncThunk(
  'data/fetchFavoriteOffers',
  async (_arg, {dispatch, extra: api, rejectWithValue}) => {
    try {
      const {data} = await api.get<OffersList[]>(APIRoute.Favorite);
      dispatch(favoriteOffersCityList(data));
      
    } catch {
      return rejectWithValue('Get favorite failed');
    }
  },
);

const toggleFavoriteAction = createAsyncThunk< { offerId: string; status: 0 | 1 },
  { offerId: string; status: 0 | 1 },
  { dispatch: AppDispatch; state: State; extra: AxiosInstance }
>(
  'user/toggleFavorite',
  async ({ offerId, status }, { extra: api }) => {
    const token = getToken();
    
    await api.post<OffersList>(
      `${APIRoute.Favorite}/${offerId}/${status}`,
      {}, // тело запроса (пустое, если не нужно)
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return { offerId, status };
  }
);

export {fetchOffersAction, checkAuthAction, loginAction, 
  logoutAction, clearErrorAction, fetchFullOfferAction, 
  fetchReviewsAction, postReviewAction, fetchFavoriteOffersAction, toggleFavoriteAction }