
import { ReviewsItem } from "../reviews-item/reviews-item";
import { SendReviewItem } from "../send-review-component/send-review-component";
import { Review } from "../../types/offer";
import { useAppSelector } from "../../hooks";
import { AuthorizationStatus } from "../../const";

type ReviewsListProps = {
  offerId: string;
    reviews: Review[];
}

function ReviewsList({reviews, offerId}: ReviewsListProps){
  const reviewsList = reviews;
  const authorizationStatus = useAppSelector((state) => state.app.authorizationStatus);
    return(<section className="offer__reviews reviews">
          <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{reviewsList.length}</span></h2>
          <ul className="reviews__list">
            {reviewsList.length == 0 ? null :
            Array.from(reviewsList, (review) => <ReviewsItem key={review.id} review={review} />)}
          </ul>
          {authorizationStatus === AuthorizationStatus.Auth ? <SendReviewItem offerId={offerId}/> : null}
        </section>);
}
export {ReviewsList};