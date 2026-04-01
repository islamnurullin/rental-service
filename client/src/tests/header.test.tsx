import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { HeaderComponent } from '../components/header/header-component';
import { renderWithProviders } from './render-with-providers';
import { AuthorizationStatus } from '../const';
import { makeFakeOffer } from './mocks';

const fakeUserInfo = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  avatarURl: 'https://example.com/avatar.jpg',
  isPro: false,
  token: 'fake-token',
};

const fakeFavoriteOffers = [
  makeFakeOffer(),
  makeFakeOffer(),
];

describe('Header — неавторизованный пользователь', () => {
  it('отображает ссылку Sign in', () => {
    renderWithProviders(<HeaderComponent />);
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });


  it('не отображает Sign out', () => {
    renderWithProviders(<HeaderComponent />);
    expect(screen.queryByText(/sign out/i)).not.toBeInTheDocument();
  });
});



describe('Header — авторизованный пользователь', () => {
  it('отображает email пользователя', () => {
    renderWithProviders(<HeaderComponent />, {
      storeOverrides: {
        app: {
          authorizationStatus: AuthorizationStatus.Auth,
          userData: fakeUserInfo,
          favoriteOffers: fakeFavoriteOffers,
        },
      },
    });

    expect(screen.getByText(fakeUserInfo.email)).toBeInTheDocument();
    expect(screen.getByText(fakeUserInfo.email)).toHaveClass('header__user-name');
  });

  it('отображает количество избранных предложений', () => {
    renderWithProviders(<HeaderComponent />, {
      storeOverrides: {
        app: {
          authorizationStatus: AuthorizationStatus.Auth,
          userData: fakeUserInfo,
          favoriteOffers: fakeFavoriteOffers,
        },
      },
    });
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('2')).toHaveClass('header__favorite-count');
  });

  it('отображает ссылку "Sign out" вместо "Sign in"', () => {
    renderWithProviders(<HeaderComponent />, {
      storeOverrides: {
        app: {
          authorizationStatus: AuthorizationStatus.Auth,
          userData: fakeUserInfo,
        },
      },
    });

    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
    expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
  });

  it('ссылка на /favorites присутствует в профиле', () => {
    renderWithProviders(<HeaderComponent />, {
      storeOverrides: {
        app: {
          authorizationStatus: AuthorizationStatus.Auth,
          userData: fakeUserInfo,
        },
      },
    });
    const email = fakeUserInfo.email;
    expect(screen.getByText(email)).toBeInTheDocument();
  });

  it('отображает обертку аватара пользователя', () => {
  const { container } = renderWithProviders(<HeaderComponent />, {
    storeOverrides: {
      app: {
        authorizationStatus: AuthorizationStatus.Auth,
        userData: fakeUserInfo,
      },
    },
  });

  const avatarWrapper = container.querySelector('.header__avatar-wrapper');
  expect(avatarWrapper).toBeInTheDocument();
});
})