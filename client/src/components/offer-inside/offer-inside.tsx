import { JSX } from "react";
import { OfferInsideItem } from "../offer-inside-item/offer-inside-item";

type OfferInsideProps = {
  names: string[];
}

function OfferInside({names}: OfferInsideProps): JSX.Element{
    return(<div className="offer__inside">
          <h2 className="offer__inside-title">What&apos;s inside</h2>
          <ul className="offer__inside-list">
            {Array.from(names, (item) =>
              <OfferInsideItem name={item} key={item} /> )}
          </ul>
        </div>)
}
export {OfferInside};