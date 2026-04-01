import { JSX } from "react";
import { Logo } from "../logo/logo";
import { useAppSelector, useAppDispatch } from "../../hooks"; 
import { AuthorizationStatus } from "../../const";
import { Link, useNavigate } from "react-router-dom"; 
import { logoutAction } from "../../store/api-actions"; 

export function HeaderComponent(): JSX.Element {
  const authorizationStatus = useAppSelector((state) => state.app.authorizationStatus);
  const favoriteOffersList = useAppSelector((state) => state.app.favoriteOffers);
  const userData = useAppSelector((state) => state.app.userData);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); 

  const handleSignOutClick = (evt: React.MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault(); 
    
    dispatch(logoutAction())
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Logo />
          </div>
          <nav className="header__nav">
            <ul className="header__nav-list">
              
              {
                authorizationStatus === AuthorizationStatus.Auth ? 
                <li className="header__nav-item user">
                  <Link to="/favorites" className="header__nav-link header__nav-link--profile">
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                      <img className="user__avatar" src={userData?.avatar} alt="User avatar" />
                    </div>                                       
                  </Link>  
                  <Link to="/favorites" className="header__nav-link header__nav-link--profile">
                    <div>
                      <span className="header__user-name user__name">{userData?.email}</span>
                      <span className="header__favorite-count">{favoriteOffersList.length}</span> 
                    </div>  
                  </Link>        
                </li> :
                <li className="header__nav-item user">
                  <Link to="/favorites" className="header__nav-link header__nav-link--profile">
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                    </div>                   
                  </Link>             
                </li>
              }
              
              {
                authorizationStatus === AuthorizationStatus.Auth ? 
                <li className="header__nav-item">
                  <a 
                    className="header__nav-link" 
                    href="#" 
                    onClick={handleSignOutClick}
                  >
                    <span className="header__signout">Sign out</span>
                  </a>
                </li> :
                <li className="header__nav-item">
                  <Link to="/login" className="header__nav-link header__nav-link--profile">
                    <span className="header__signout">Sign in</span>
                  </Link>
                </li>
              }
              
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}