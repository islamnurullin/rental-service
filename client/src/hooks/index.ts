
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'; 
import type {State, AppDispatch} from '../types/state';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchFullOfferAction, fetchReviewsAction } from '../store/api-actions';
import { clearOfferData } from '../store/offers-reducer';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<State>= useSelector;

export const useOfferPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  
  const { 
    fullOffer, 
    reviews, 
    isFullOfferLoading
  } = useAppSelector((state) => state.offers);

  useEffect(() => {
    if (id) {
      dispatch(fetchFullOfferAction(id));
      dispatch(fetchReviewsAction(id));
    }

    return () => {
      dispatch(clearOfferData());
    };
  }, [id, dispatch]);

  return {
    fullOffer: fullOffer,
    reviews,
    isFullOffersDataLoading: isFullOfferLoading
  };
};