import { adaptOfferToClient } from "../adapters/offerAdapter.js";
import ApiError from "../error/ApiError.js";
import Offer from "../models/offer.js";
import User from "../models/user.js"
import { adaptFullOfferToClient } from "../adapters/offerAdapter.js";

async function getAllOffers(req, res, next){
    try{
        const offers = await Offer.findAll();
        const adaptedOffers = offers.map(adaptOfferToClient);
        res.status(200).json(adaptedOffers);
    } catch(error){
        next(ApiError.internal('Не удалось получить список предложений'));
    }
}

async function getFavoriteOffers(req, res, next){
    try{
        const offers = await Offer.findAll();
        const adaptedOffers = offers.map(adaptOfferToClient).filter(x => x.isFavorite == true);
        res.status(200).json(adaptedOffers);
    } catch(error){
        next(ApiError.internal('Не удалось получить список предложений'));
    }
}

export async function createOffer(req, res, next) {
 try {
   const {
     title, description, publishDate, city,
     isPremium, isFavorite, rating, type, rooms, guests, price,
     features, commentsCount, latitude, longitude, userId
   } = req.body;


   if (!req.files?.previewImage || req.files.previewImage.length === 0) {
     return next(ApiError.badRequest('Превью изображение обязательно для загрузки'));
   }


   const previewImagePath = `/static/${req.files.previewImage[0].filename}`;


   let processedPhotos = [];
   if (req.files?.photos) {
     processedPhotos = req.files.photos.map(file => `/static/${file.filename}`);
   }


   let parsedFeatures = [];
   if (features) {
     try {
       parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
     } catch {
       parsedFeatures = features.split(',');
     }
   }


   const offer = await Offer.create({
     title,
     description,
     publishDate,
     city,
     previewImage: previewImagePath,
     photos: processedPhotos,
     isPremium,
     isFavorite,
     rating,
     type,
     rooms,
     guests,
     price,
     features: parsedFeatures,
     commentsCount,
     latitude,
     longitude,
     authorId: userId
   });


   return res.status(201).json(offer); 
 } catch (error) {
   next(ApiError.internal('Не удалось добавить предложение: ' + error.message));             
 }
}

const getFullOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    let User;
    try {
      User = require('../models').User;
    } catch (e) {
      User = null;
    }

    const queryOptions = {};
    if (User) {
      queryOptions.include = {
        model: User,
        as: 'author',
        required: false
      };
    }

    const offer = await Offer.findByPk(id, queryOptions);

    if (!offer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Offer not found' 
      });
    }

    const offerData = adaptFullOfferToClient(offer, offer.author);
    
    res.json(offerData); 

  } catch (error) {
    console.error('Error in getFullOffer:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

const toggleFavorite = async (req, res, next) => { try {
  const {offerId, status } = req.params;
  const offer = await Offer.findByPk (offerId);
  if (!offer) {
    return next (ApiError.notFound('Предложение не найдено'));
  }
  
  offer.isFavorite = status === '1';
  await offer.save();
  res.json (offer);
}catch (error) {
  next(ApiError.internal('Ошибка при обновлении статуса избранного'));
}
};

export {getFullOffer, toggleFavorite, getAllOffers, getFavoriteOffers};

