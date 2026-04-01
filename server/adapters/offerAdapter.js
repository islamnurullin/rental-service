const cityCoordinates = {
   Paris: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
   Cologne: { latitude: 50.9375, longitude: 6.9603, zoom: 13 },
   Brussels: { latitude: 50.8503, longitude: 4.3517, zoom: 13 },
   Amsterdam: { latitude: 52.3676, longitude: 4.9041, zoom: 13 },
   Hamburg: { latitude: 53.5511, longitude: 9.9937, zoom: 13 },
   Dusseldorf: { latitude: 51.2277, longitude: 6.7735, zoom: 13 }
 };
  const getBaseUrl = () => `${process.env.HOST}:${process.env.PORT || 5000}`;
  const adaptOfferToClient = (offer) => {
   const baseUrl = getBaseUrl();
   const cityLocation = cityCoordinates[offer.city];
   let previewImage = offer.previewImage;
    if (previewImage && !previewImage.startsWith('http')) {
     previewImage = `${baseUrl}${previewImage.startsWith('/') ? '' : '/'}${previewImage}`;
   }
    return {
     id: String(offer.id),
     title: offer.title,
     type: offer.type,
     price: offer.price,
     city: {
       name: offer.city,
       location: cityLocation
     },
     location: offer.latitude && offer.longitude ? {
       latitude: offer.latitude,
       longitude: offer.longitude
     } : { latitude: 0, longitude: 0 },
     isFavorite: offer.isFavorite,
     isPremium: offer.isPremium,
     rating: parseFloat(offer.rating),
     previewImage
   };
 };

const adaptFullOfferToClient = (offer, author) => {
  const baseUrl = getBaseUrl();
  let previewImage = offer.previewImage;
    if (previewImage && !previewImage.startsWith('http')) {
     previewImage = `${baseUrl}${previewImage.startsWith('/') ? '' : '/'}${previewImage}`;
   }
   let photosList = [];
   offer.photos.forEach(element => {
    element = `${baseUrl}${element.startsWith('/') ? '' : '/'}${element}`;
    photosList.push(element);
   });
    return{
  id: offer.id.toString(),
  title: offer.title,
  type: offer.type,
  price: offer.price,
  city: {
    name: offer.cityName || 'Paris', // или получай из данных оффера
    location: {
      latitude: offer.cityLatitude || 48.8566,
      longitude: offer.cityLongitude || 2.3522,
      zoom: offer.cityZoom || 13
    }
  },
  location: {
    latitude: offer.latitude || 48.5112,
    longitude: offer.longitude || 2.2055
  },
  isFavorite: offer.isFavorite || false,
  isPremium: offer.isPremium || false,
  rating: offer.rating || 0,
  previewImage: previewImage,
  images: photosList,
  goods: offer.goods,
  author: author ? {
    id: author.id,
    name: `${author.firstName || ''} ${author.lastName || ''}`.trim() || author.name,
    avatar: author.avatar,
    email: author.email,
    isPro: author.isPro || false
  } : null
}};


 export {adaptOfferToClient, adaptFullOfferToClient};
