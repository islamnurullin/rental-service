import { JSX } from "react";
import { FavoritesCard } from "../favorites-card/favorites-card";
import { OffersList } from "../../types/offer";

type FavoritesCardListProps = {
    offersList: OffersList[];
}

function FavoritesList({offersList}: FavoritesCardListProps): JSX.Element{
    return(
      <div>
      {(Array.from(offersList).filter(offer => offer.city?.name === "Paris").length > 0) ?
            <li className="favorites__locations-items">
                <div className="favorites__locations locations locations--current">
                  <div className="locations__item">
                    <a className="locations__item-link" href="#">
                      <span>Paris</span>
                    </a>
                  </div>
                </div>
                <div className="favorites__places">
                  {Array.from(offersList, (item) =>
                    (item.isFavorite&&item.city.name === "Paris")? <FavoritesCard key={item.id} id={item.id} title={item.title} type={item.type} 
                    price={item.price} previewImage={item.previewImage} isPremium={item.isPremium} rating={item.rating} />
                  : null)}
                </div>
              </li>:
              null
                  }
                              {Array.from(offersList).filter(offer => offer.city?.name === "Cologne").length > 0 ?
            <li className="favorites__locations-items">
                <div className="favorites__locations locations locations--current">
                  <div className="locations__item">
                    <a className="locations__item-link" href="#">
                      <span>Cologne</span>
                    </a>
                  </div>
                </div>
                <div className="favorites__places">
                  {Array.from(offersList, (item) =>
                    (item.isFavorite&&item.city.name === "Cologne")? <FavoritesCard key={item.id} id={item.id} title={item.title} type={item.type} 
                    price={item.price} previewImage={item.previewImage} isPremium={item.isPremium} rating={item.rating} />
                  : null)}
                </div>
              </li>:
              null
          }
          {Array.from(offersList).filter(offer => offer.city?.name === "Brussels").length > 0 ?
            <li className="favorites__locations-items">
                <div className="favorites__locations locations locations--current">
                  <div className="locations__item">
                    <a className="locations__item-link" href="#">
                      <span>Brussels</span>
                    </a>
                  </div>
                </div>
                <div className="favorites__places">
                {Array.from(offersList, (item) =>
                    (item.isFavorite&&item.city.name === "Brussels")? <FavoritesCard key={item.id} id={item.id} title={item.title} type={item.type} 
                    price={item.price} previewImage={item.previewImage} isPremium={item.isPremium} rating={item.rating} />
                  : null)}
                </div>
              </li>:
              null
          }
            {Array.from(offersList).filter(offer => offer.city?.name === "Amsterdam").length > 0 ?
            <li className="favorites__locations-items">
                <div className="favorites__locations locations locations--current">
                  <div className="locations__item">
                    <a className="locations__item-link" href="#">
                      <span>Amsterdam</span>
                    </a>
                  </div>
                </div>
                <div className="favorites__places">
                  {Array.from(offersList, (item) =>
                    (item.isFavorite&&item.city.name === "Amsterdam")? <FavoritesCard key={item.id} id={item.id} title={item.title} type={item.type} 
                    price={item.price} previewImage={item.previewImage} isPremium={item.isPremium} rating={item.rating} />
                  : null)}
                </div>
              </li>:
              null
          }
          {Array.from(offersList).filter(offer => offer.city?.name === "Hamburg").length > 0 ?
            <li className="favorites__locations-items">
                <div className="favorites__locations locations locations--current">
                  <div className="locations__item">
                    <a className="locations__item-link" href="#">
                      <span>Hamburg</span>
                    </a>
                  </div>
                </div>
                <div className="favorites__places">
                  {Array.from(offersList, (item) =>
                    (item.isFavorite&&item.city.name === "Hamburg")? <FavoritesCard key={item.id} id={item.id} title={item.title} type={item.type} 
                    price={item.price} previewImage={item.previewImage} isPremium={item.isPremium} rating={item.rating} />
                  : null)}
                </div>
              </li>:
              null
          }
          {Array.from(offersList).filter(offer => offer.city?.name === "Dusseldorf").length > 0 ?
            <li className="favorites__locations-items">
                <div className="favorites__locations locations locations--current">
                  <div className="locations__item">
                    <a className="locations__item-link" href="#">
                      <span>Dusseldorf</span>
                    </a>
                  </div>
                </div>
                <div className="favorites__places">
                  {Array.from(offersList, (item) =>
                    (item.isFavorite&&item.city.name === "Dusseldorf")? <FavoritesCard key={item.id} id={item.id} title={item.title} type={item.type} 
                    price={item.price} previewImage={item.previewImage} isPremium={item.isPremium} rating={item.rating} />
                  : null)}
                </div>
              </li>:
              null
          }
      </div>
    )
}
export {FavoritesList};