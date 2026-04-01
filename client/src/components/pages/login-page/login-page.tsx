import { FormEvent, useRef, useEffect } from "react"; 
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { getAuthorizationStatus, getAuthorizationError } from "../../../store/selectors"; 
import { AppRoute, AuthorizationStatus } from "../../../const";
import { Link, Navigate } from "react-router-dom";
import { loginAction } from "../../../store/api-actions";
import { AuthData } from "../../../types/user-data";
import { Logo } from "../../logo/logo";
import { setError } from "../../../store/action";

function LoginPage(){
  const loginRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useAppDispatch();

  const userAuthorizationStatus = useAppSelector(getAuthorizationStatus);
  const authorizationError = useAppSelector(getAuthorizationError); 

  useEffect(() => {
    return () => {
      dispatch(setError(null));
    };
  }, [dispatch]);

  if (userAuthorizationStatus === AuthorizationStatus.Auth) {
    return <Navigate to={ AppRoute.Main }/>;
  }

  const onSubmit = (authData: AuthData) => {
    dispatch(loginAction(authData));
  };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (loginRef.current && passwordRef.current) {
      onSubmit({
        email: loginRef.current.value,
        password: passwordRef.current.value,
      });
    }
  };

  return(
    <div className="page page--gray page--login">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Logo />
            </div>
          </div>
        </div>
      </header>

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form className="login__form form" action="#" method="post" onSubmit={ handleSubmit }>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input 
                  ref={ loginRef } 
                  className="login__input form__input" 
                  type="email" 
                  name="email" 
                  id="email" 
                  placeholder="Email" 
                  required
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input 
                  ref={ passwordRef } 
                  className="login__input form__input" 
                  type="password" 
                  name="password" 
                  id="password" 
                  placeholder="Password" 
                  required
                />
              </div>

              {authorizationError && (
                <div 
                  className="form__error-message" 
                  style={{ 
                    color: '#df3838', 
                    marginBottom: '15px', 
                    fontSize: '14px',
                    fontWeight: 500 
                  }}
                  role="alert"
                >
                  {authorizationError}
                </div>
              )}

              <button 
                className="login__submit form__submit button" 
                type="submit"
                disabled={authorizationError !== null} 
              >
                Sign in
              </button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <Link className="locations__item-link" to={ AppRoute.Main }>
                <span>Amsterdam</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export { LoginPage };