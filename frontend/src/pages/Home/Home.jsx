import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="app">
      <main className="main">
        <div className="content">
          <h2 className="subtitle">Where Finance Meets Unique</h2>
          <p className="description">
            Your modern banking partner. With advanced technology and personalized solutions, we help you save, invest, and manage your wealth effortlessly. Simple, secure, and uniquely yours.
          </p>
          <Link to="/login">
            <button className="get-started-button">Get Started</button>
          </Link>
        </div>
        <div className="illustration">
          <img src="/homeimage.png" alt="Finance Illustration" />
        </div>
      </main>
    </div>
  );
};

export default Home;  // Capitalized
