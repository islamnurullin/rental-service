import { MainPage } from "../pages/main-page/main-page";
import { NotFoundPage } from "../pages/not-found-page/not-found-page";
import { FavoritesPage } from "../pages/favorites-page/favorites-page";
import { LoginPage } from "../pages/login-page/login-page"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "../private-route/private-route";
import { useAppSelector } from "../../hooks";
import { AppRoute} from "../../const";
import { OfferPage } from "../pages/offer-page/offer-page";

function App(){
  const authorizationStatus = useAppSelector((state) => state.app.authorizationStatus);

  return(
    <BrowserRouter>
      <Routes>
        <Route 
          path={AppRoute.Main}
          element={<MainPage />} 
        />
        <Route path={`${AppRoute.Offer}/:id`} element={<OfferPage/>} />
        <Route
          path={AppRoute.Favorites}
          element={
            <PrivateRoute authorizationStatus={authorizationStatus}>
              <FavoritesPage />
            </PrivateRoute>
          }
        />
        <Route path={AppRoute.Login} element={<LoginPage/>} />
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export { App };