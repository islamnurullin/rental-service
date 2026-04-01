import { JSX } from "react";

type SelectCityProps = {
  currentCity: string;
  onCityChange: (city: string) => void;
};

function SelectCity({ currentCity, onCityChange }: SelectCityProps): JSX.Element {
  const cities = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];

  const handleCityClick = (city: string, event: React.MouseEvent) => {
    event.preventDefault();
    onCityChange(city);
  };

  return (
    <ul className="locations__list tabs__list">
      {cities.map((city) => (
        <li key={city} className="locations__item">
          <a
            className={`locations__item-link tabs__item ${
              currentCity === city ? 'tabs__item--active' : ''
            }`}
            href="#"
            onClick={(event) => handleCityClick(city, event)}
          >
            <span>{city}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export { SelectCity };