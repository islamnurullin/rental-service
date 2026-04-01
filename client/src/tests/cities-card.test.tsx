import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CitiesCard } from '../components/cities-card/cities-card';
import { AppRoute } from '../const';

const mockCardProps = {
  id: 'test-offer-123',
  title: 'Beautiful Apartment in City',
  type: 'apartment',
  price: 250,
  previewImage: 'https://example.com/image.jpg',
  rating: 4.5,
  isPremium: false,
  isFavorite: false,
};

describe('CitiesCard', () => {
  const renderCard = (overrides = {}) => {
    const props = { ...mockCardProps, ...overrides };
    return render(
      <MemoryRouter>
        <CitiesCard {...props} />
      </MemoryRouter>
    );
  };

  describe('Базовая информация', () => {
    it('1. Заголовок объявления отображается на карточке', () => {
      renderCard();
      const titleElement = screen.getByText(mockCardProps.title);
      expect(titleElement).toBeInTheDocument();
    });

    it('2. Цена объявления присутствует в разметке', () => {
      renderCard();
      expect(screen.getByText(`€${mockCardProps.price}`)).toBeInTheDocument();
      expect(screen.getByText(/night/i)).toBeInTheDocument();
    });

    it('отображает тип жилья', () => {
      renderCard();
      
      expect(screen.getByText(mockCardProps.type)).toBeInTheDocument();
      expect(screen.getByText(mockCardProps.type)).toHaveClass('place-card__type');
    });
  });

  describe('Метка Premium', () => {
    it('3. Метка "Premium" отображается когда isPremium = true', () => {
      renderCard({ isPremium: true });
      expect(screen.getByText('Premium')).toBeInTheDocument();
    });

    it('4. Метка "Premium" отсутствует когда isPremium = false', () => {
      renderCard({ isPremium: false });
      expect(screen.queryByText('Premium')).not.toBeInTheDocument();
    });
  });

  describe('Навигация', () => {
    it('5. Ссылка на страницу объявления содержит id в href (/offer/id)', () => {
      renderCard();
      const { container } = renderCard();
      const link = container.querySelector(`a[href="${AppRoute.Offer}/${mockCardProps.id}"]`);
      
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `${AppRoute.Offer}/${mockCardProps.id}`);
    });

    it('изображение имеет правильный src', () => {
      renderCard();
      const image = screen.getByRole('img', { name: /place image/i });
      expect(image).toHaveAttribute('src', mockCardProps.previewImage);
      expect(image).toHaveAttribute('alt', 'Place image');
    });
  });
});