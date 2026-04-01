import { OffersList } from "../../types/offer"
import { CitiesCard } from "../cities-card/cities-card";

type CitiesCardListProps = {
    offersList: OffersList[];
    onOfferMouseEnter: ((id: string) => void) | (() => void);
    onOfferMouseLeave: (() => void) | undefined;
}

function CitiesCardList({offersList, onOfferMouseEnter, onOfferMouseLeave}: CitiesCardListProps){
    return(
        <div className="cities__places-list places__list tabs__content" style={{ overflow: 'hidden' }}>
            {offersList.length === 0 ? 
                <div className="cities" style={{ overflow: 'hidden' }}>
                    <div className="cities__places-container cities__places-container--empty container" style={{ overflow: 'hidden' }}>
                        <section className="cities__no-places">
                            <div className="cities__status-wrapper tabs__content">
                                <b className="cities__status">No places to stay available</b>
                                <p className="cities__status-description">We could not find any property available at the moment in this city</p>
                            </div>
                        </section>
                    </div>
                </div> : 
                Array.from(offersList, (item) =>
                    <article key={item.id} onMouseEnter={() => onOfferMouseEnter(item.id)} onMouseLeave={onOfferMouseLeave}>
                        <CitiesCard id={item.id} title={item.title} type={item.type} 
                            price={item.price} previewImage={item.previewImage} isPremium={item.isPremium} rating={item.rating} isFavorite={item.isFavorite}
                        />
                    </article>
                )
            }
        </div>
    );
}
export {CitiesCardList};