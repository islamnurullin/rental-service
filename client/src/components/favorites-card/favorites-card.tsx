import { JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppRoute, AuthorizationStatus } from "../../const";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { toggleFavoriteAction } from "../../store/api-actions";

type FavoritesCardProps = {
  id: string;
  title: string;
  type: string;
  price: number;
  isPremium: boolean;
  previewImage: string;
  rating: number;
  isFavorite?: boolean; 
}

function FavoritesCard({id, title, type, price, previewImage, isPremium, rating}: FavoritesCardProps): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector((state) => state.app.authorizationStatus);

  const handleFavoriteClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    evt.stopPropagation();

    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate(AppRoute.Login);
      return;
    }

    dispatch(toggleFavoriteAction({ offerId: id, status: 0 }));
  };

  return (
    <article className="favorites__card place-card">
      {isPremium && (
        <div className="place-card__mark">
          <div className="offer__mark">
            <span>Premium</span>
          </div>
        </div>
      )}

      <div className="favorites__image-wrapper place-card__image-wrapper">
        <Link to={`${AppRoute.Offer}/${id}`} onClick={() => window.scrollTo(0, 0)}>
          <img 
            className="place-card__image" 
            src={previewImage} 
            alt="Place image"
          />
        </Link>
      </div>
      
      <div className="favorites__card-info place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          
          <button 
            className="place-card__bookmark-button place-card__bookmark-button--active button" 
            type="button"
            onClick={handleFavoriteClick}
            aria-label="Remove from bookmarks"
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use href="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">In bookmarks</span>
          </button>
        </div>
        
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: `${rating * 20}%` }} />
            <span className="visually-hidden">{rating}</span>
          </div>
        </div>
        
        <h2 className="place-card__name">
          <Link to={`${AppRoute.Offer}/${id}`} onClick={() => window.scrollTo(0, 0)}>
            {title}
          </Link>
        </h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
}

export { FavoritesCard };