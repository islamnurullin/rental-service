import { JSX } from "react";
import { OfferHost } from "../../offer-host/offer-host";
import { OfferInside } from "../../offer-inside/offer-inside";
import { NotFoundPage } from "../not-found-page/not-found-page";
import { CitiesCardList } from "../../cities-card-list/cities-card-list";
import Map from "../../map/map";
import { useActiveOffer } from "../../map/activeMarker";
import { ReviewsList } from "../../reviews-list/reviews-list";
import { useAppDispatch, useAppSelector, useOfferPage } from "../../../hooks";
import { LoadingPage } from "../loading-page/loading-page";
import { HeaderComponent } from "../../header/header-component";
import { useNavigate } from "react-router-dom";
import { AppRoute, AuthorizationStatus } from "../../../const";
import { toggleFavoriteAction } from "../../../store/api-actions";

function OfferPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector((state) => state.app.authorizationStatus);

  const offersList = useAppSelector((state) => state.app.offers);
  const { activeOfferId, handleOfferMouseEnter, handleOfferMouseLeave } = useActiveOffer();
  const { fullOffer, reviews, isFullOffersDataLoading } = useOfferPage();
  const offer = fullOffer

  const handleFavoriteClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    evt.stopPropagation();

    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate(AppRoute.Login);
      return;
    }

    if (offer) {
      const newStatus = offer.isFavorite ? 0 : 1;
      dispatch(toggleFavoriteAction({ offerId: offer.id, status: newStatus }));
    }
  };

  if (isFullOffersDataLoading) {
    return <LoadingPage />;
  }
  
  if (!offer && !isFullOffersDataLoading) {
    return <NotFoundPage />;
  }

  const showActiveBookmark = authorizationStatus === AuthorizationStatus.Auth && offer?.isFavorite;

  return (
    <div className="page">
      <div className="visually-hidden">
        <svg xmlns="http://www.w3.org/2000/svg">
          <symbol id="icon-star" viewBox="0 0 13 12">
            <path fillRule="evenodd" clipRule="evenodd" 
            d="M6.5 9.644L10.517 12 9.451 7.56 13 4.573l-4.674-.386L6.5 0 4.673 4.187 0 4.573 3.549 7.56 2.483 12 6.5 9.644z">
            </path>
          </symbol>
        </svg>
      </div>
      
      <div style={{ display: 'none' }}>
        <svg xmlns="http://www.w3.org/2000/svg">
          <symbol id="icon-arrow-select" viewBox="0 0 7 4">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 0l3.5 2.813L7 0v1.084L3.5 4 0 1.084V0z"></path>
          </symbol>
          <symbol id="icon-bookmark" viewBox="0 0 17 18">
            <path d="M3.993 2.185l.017-.092V2c0-.554.449-1 .99-1h10c.522 0 .957.41.997.923l-2.736 14.59-4.814-2.407-.39-.195-.408.153L1.31 16.44 3.993 2.185z"></path>
          </symbol>
          <symbol id="icon-star" viewBox="0 0 13 12">
            <path fillRule="evenodd" clipRule="evenodd" d="M6.5 9.644L10.517 12 9.451 7.56 13 4.573l-4.674-.386L6.5 0 4.673 4.187 0 4.573 3.549 7.56 2.483 12 6.5 9.644z"></path>
          </symbol>
        </svg>
      </div>

      <HeaderComponent />
     
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {offer?.images.map((item) => (
                <div key={item} className="offer__image-wrapper">
                  <img className="offer__image" src={item} alt="Photo studio" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="offer__container container">
            <div className="offer__wrapper">
              {offer?.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{offer?.title}</h1>
                
                <button 
                  className={`offer__bookmark-button button${showActiveBookmark ? ' offer__bookmark-button--active' : ''}`} 
                  type="button"
                  onClick={handleFavoriteClick}
                  aria-label={showActiveBookmark ? "Remove from bookmarks" : "Add to bookmarks"}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use href="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
                
              </div>
              
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: `${(offer?.rating || 0) * 20}%` }} />
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{offer?.rating}</span>
              </div>
              
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">{offer?.type}</li>
                <li className="offer__feature offer__feature--bedrooms">{`${offer?.rooms} Bedrooms`}</li>
                <li className="offer__feature offer__feature--adults">{`Max ${offer?.guests} adults`}</li>
              </ul>
              
              <div className="offer__price">
                <b className="offer__price-value">&euro;{offer?.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              
              {offer?.goods && <OfferInside names={offer.goods} />}
              {offer?.host && <OfferHost host={offer.host} />}
              
              <ReviewsList reviews={reviews} offerId={offer.id} />
            </div>
          </div>

          <section className="offer__map map">
            <Map 
              city={offersList[0]?.city}
              points={offersList}
              selectedPoint={activeOfferId}
            />
          </section>
        </section>

        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <div className="near-places__list places__list">
              <CitiesCardList 
                offersList={offersList.slice(0, 3)} 
                onOfferMouseEnter={handleOfferMouseEnter} 
                onOfferMouseLeave={handleOfferMouseLeave}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export { OfferPage };