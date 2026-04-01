import { useState } from "react";
import { AppRoute, AuthorizationStatus } from "../../const";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { toggleFavoriteAction } from "../../store/api-actions"; 

type CitiesCardProps = {
  id: string;
  title: string;
  type: string;
  price: number;
  isPremium: boolean;
  previewImage: string;
  rating: number;
  isFavorite: boolean;
}

function CitiesCard({id, title, type, price, previewImage, isPremium, rating, isFavorite}: CitiesCardProps) {
  const [, setOfferId] = useState('');
  
  const authorizationStatus = useAppSelector((state) => state.app.authorizationStatus);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // 👇 Показываем активную закладку ТОЛЬКО если пользователь авторизован И оффер в избранном
  const showActiveBookmark = authorizationStatus === AuthorizationStatus.Auth && isFavorite;

  const handleFavoriteClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    evt.stopPropagation(); 

    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate(AppRoute.Login);
      return;
    }

    const newStatus = isFavorite ? 0 : 1;
    
    dispatch(toggleFavoriteAction({
      offerId: id,
      status: newStatus
    }));
  };

  return (
    <article 
      className="cities__card place-card" 
      onMouseOver={() => setOfferId(id)} 
      onMouseOut={() => setOfferId('')}
    >
      {isPremium && (
        <div className="place-card__mark">
          <div className="offer__mark">
            <span>Premium</span>
          </div>
        </div>
      )}
      
      <div className="cities__image-wrapper place-card__image-wrapper">
        <Link to={`${AppRoute.Offer}/${id}`} onClick={() => window.scrollTo(0, 0)}>
          <img 
            className="place-card__image" 
            src={previewImage} 
            width="260" 
            height="200" 
            alt="Place image" 
            style={{ objectFit: 'cover' }} 
          />
        </Link>
      </div>
      
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          
          {/* 👇 Используем showActiveBookmark вместо isFavorite */}
          <button 
            className={`place-card__bookmark-button button${showActiveBookmark ? ' place-card__bookmark-button--active' : ''}`} 
            type="button"
            onClick={handleFavoriteClick}
            aria-label={showActiveBookmark ? "Remove from bookmarks" : "Add to bookmarks"}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use href="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">To bookmarks</span>
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

export { CitiesCard };