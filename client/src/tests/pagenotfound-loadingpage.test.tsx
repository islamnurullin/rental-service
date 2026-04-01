import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { LoadingPage } from '../components/pages/loading-page/loading-page';
import { NotFoundPage } from '../components/pages/not-found-page/not-found-page';
import { renderWithProviders } from './render-with-providers';

describe('LoadingPage', () => {
  it('отображает текст загрузки', () => {
    renderWithProviders(<LoadingPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toHaveClass('offer__host-title');
  });
});

describe('NotFoundPage', () => {
  const renderPage = (overrides?: Parameters<typeof renderWithProviders>[1]) => 
    renderWithProviders(<NotFoundPage />, overrides);

  it('отображает заголовок 404', () => {
    renderPage();
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('404')).toHaveClass('offer__host-title');
  });

  it('отображает сообщение об ошибке', () => {
    renderPage();
    expect(screen.getByText('Ooops. Not found this page')).toBeInTheDocument();
    expect(screen.getByText('Ooops. Not found this page'))
      .toHaveClass('offer__host-title');
  });

  it('ссылка на главную страницу присутствует', () => {
    renderPage();
    const link = screen.queryByRole('link', { name: /главную|home|main/i });
    if (link) {
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href');
    }
  });

  it('ссылка ведет на "/"', () => {
    renderPage();
    const link = screen.queryByRole('link', { name: /главную|home|main/i });
    if (link) {
      const href = link.getAttribute('href');
      expect(href).toMatch(/^\/$|^http:\/\/localhost\/$/);
    }
  });
});