import { JSX } from "react";

type OfferInsideItemProps = {
  name: string;
}

function OfferInsideItem({name}: OfferInsideItemProps): JSX.Element{
    return(<li className="offer__inside-item">
              {name}
            </li>)
}
export {OfferInsideItem};