import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import Cookies from 'js-cookie';

const Header = () => {
  // Check if the required cookies (email and balance) are set to determine if the user is logged in
  const isLoggedIn = !!Cookies.get('email') && !!Cookies.get('balance');
  const redirectPath = isLoggedIn ? '/dashboard' : '/';

  return (
    <header className="header">
      <Link to={redirectPath} className="title">
        Finique
      </Link>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/services">Services</Link>
          </li>
          <li>
            <Link to="/aboutus">About Us</Link>
          </li>
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
                  // Remove the cookies during logout
                  Cookies.remove('email');
                  Cookies.remove('balance');
                  Cookies.remove('firstName');
                  window.location.href = '/'; // Redirect to home page after logout
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
