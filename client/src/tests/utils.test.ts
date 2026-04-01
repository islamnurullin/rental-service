import { 
  getCity, 
  getOffersByCity, 
  getReviewsByPlaceId, 
  sortOffersByType
} from '../utils'; 
import { CITIES_LOCATION } from '../const';
import { describe, expect, it } from 'vitest';
import { makeFakeOffer, makeFakeReview } from './mocks';
import { OffersList } from '../types/offer';

const createCityOffer = (name: string) => ({
  name,
  location: { latitude: 50, longitude: 50, zoom: 10 }, 
});

describe('Utility Functions', () => {
  describe('getCity', () => {
    it('should return the city object when name matches', () => {
      const targetCityName = CITIES_LOCATION[0].name;
      const cityOffers = [
        createCityOffer(targetCityName),
        createCityOffer('Different City'),
      ];

      const result = getCity(targetCityName, cityOffers);

      expect(result).toBeDefined();
      expect(result?.name).toBe(targetCityName);
    });

    it('should return undefined when no city matches', () => {
      const cityOffers = [createCityOffer('Paris'), createCityOffer('Berlin')];

      const result = getCity('Tokyo', cityOffers);

      expect(result).toBeUndefined();
    });

    it('should return undefined for an empty list', () => {
      const result = getCity('Any City', []);
      expect(result).toBeUndefined();
    });
  });

  describe('getOffersByCity', () => {
    it('should return all offers if city is undefined', () => {
      const offers = [makeFakeOffer(), makeFakeOffer()];
    
      const result = getOffersByCity(undefined, offers);

      expect(result).toHaveLength(offers.length);
      expect(result).toEqual(offers);
    });

    it('should filter offers by city name', () => {
      const city = CITIES_LOCATION[0];
      const otherCity = CITIES_LOCATION[1] || { name: 'Other', location: { latitude: 0, longitude: 0, zoom: 10 } };
      const offerInCity = { ...makeFakeOffer(), city: city };
      const offerNotInCity = { ...makeFakeOffer(), city: otherCity };
      const offersList = [offerInCity, offerNotInCity];
      const result = getOffersByCity(city, offersList);
      expect(result).toHaveLength(1);
      expect(result[0].city.name).toBe(city.name);
    });

    it('should return empty array if no offers match the city', () => {
      const city = { name: 'NonExistentCity', location: { latitude: 0, longitude: 0, zoom: 10 } };
      const offersList = [makeFakeOffer()];

      const result = getOffersByCity(city, offersList);

      expect(result).toHaveLength(0);
    });
  });


  describe('sortOffersByType', () => {
    it('сортирует от дешёвых к дорогим (PriceToHigh)', () => {
    const offers = [
      { ...makeFakeOffer(), price: 300 },
      { ...makeFakeOffer(), price: 100 },
      { ...makeFakeOffer(), price: 200 },
    ];
    const result = sortOffersByType([...offers], "PriceToHigh");
    expect(result[0].price).toBe(100);
    expect(result[2].price).toBe(300);
  });


  it('сортирует от дорогих к дешёвым (PriceToLow)', () => {
    const offers = [
      { ...makeFakeOffer(), price: 100 },
      { ...makeFakeOffer(), price: 300 },
    ];
    const result = sortOffersByType([...offers], "PriceToLow");
    expect(result[0].price).toBe(300);
  });


  it('сортирует по рейтингу (TopRated)', () => {
    const offers = [
      { ...makeFakeOffer(), rating: 3 },
      { ...makeFakeOffer(), rating: 5 },
      { ...makeFakeOffer(), rating: 4 },
    ];
    const result = sortOffersByType([...offers], 'TopRated');

    expect(result[0].rating).toBe(5);
  });

    it('empty list', () => {
    const offers = [] as OffersList[];
    const result = sortOffersByType(offers, "PriceToHigh");
    expect(result).toEqual(offers);
  });

  it('should return original order for default type', () => {
    const offers = [
      { ...makeFakeOffer(), price: 100 },
      { ...makeFakeOffer(), price: 200 },
      { ...makeFakeOffer(), price: 300 },
    ];

    const result = sortOffersByType(offers, 'UNKNOWN_TYPE' as any);

    expect(result).toEqual(offers);
  });
});

describe('getRewviewsByPlaceId', () => {
    it('should return all reviews if offerId is undefined', () => {
      const reviews = [makeFakeReview(), makeFakeReview()];
      const result = getReviewsByPlaceId(undefined as any, reviews);
      expect(result).toHaveLength(reviews.length);
    });

    it('should filter reviews by offerId', () => {
      const targetId = 'specific-offer-id';
      const reviewMatch = { ...makeFakeReview(), offerId: targetId };
      const reviewNoMatch = { ...makeFakeReview(), offerId: 'different-id' };
      
      const reviewsList = [reviewMatch, reviewNoMatch];

      const result = getReviewsByPlaceId(targetId, reviewsList);

      expect(result).toHaveLength(1);
      expect(result[0].offerId).toBe(targetId);
    });

    it('should return empty array if no reviews match the ID', () => {
      const reviewsList = [makeFakeReview(), makeFakeReview()];
      
      const result = getReviewsByPlaceId('non-existent-id', reviewsList);

      expect(result).toHaveLength(0);
    });
  });
});