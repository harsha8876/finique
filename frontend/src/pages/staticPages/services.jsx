import React from 'react';
import './services.css';

const Services = () => {
  return (
    <div className="services-page">
      <h1>Our Services</h1>
      <div className="services-list">
        <div className="service-card">
          <h2>Secure Banking</h2>
          <p>Experience seamless, encrypted banking transactions from anywhere.</p>
        </div>
        <div className="service-card">
          <h2>Instant Transfers</h2>
          <p>Send and receive money instantly with our lightning-fast transfer system.</p>
        </div>
        <div className="service-card">
          <h2>24/7 Support</h2>
          <p>We're here for you anytime with our dedicated customer support team.</p>
        </div>
      </div>
    </div>
  );
};

export default Services;
