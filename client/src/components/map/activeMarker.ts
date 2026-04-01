import { useState } from 'react';

export const useActiveOffer = () => {
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);

  const handleOfferMouseEnter = (id: string) => {
    setActiveOfferId(id);
  };

  const handleOfferMouseLeave = () => {
    setActiveOfferId(null);
  };

  return {
    activeOfferId,
    handleOfferMouseEnter,
    handleOfferMouseLeave
  };
};