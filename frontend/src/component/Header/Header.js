import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import Cookies from 'js-cookie';

const Header = () => {
  const isLoggedIn = !!Cookies.get('email'); // Check if logged in
  const redirectPath = isLoggedIn ? '/dashboard' : '/';

  return (
    <header className="header">
      <Link to={redirectPath} className="title">
        Finique
      </Link>
      <nav className="nav">
        <ul>
          <li>Services</li>
          <li>About us</li>
          {!isLoggedIn && (
            <li>
              <Link to="/signup">
                <button className="sign-up-button">Sign Up</button>
              </Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button
                className="logout-button"
                onClick={() => {
                  Cookies.remove('email');
                  Cookies.remove('balance');
                  Cookies.remove('firstName');
                  window.location.href = '/';
                }}
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
