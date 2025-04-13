import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const [displayBalance, setDisplayBalance] = useState(0);
  const actualBalance = parseFloat(Cookies.get('balance')) || 0;
  const firstName = Cookies.get('firstName') || "User";

  useEffect(() => {
    const duration = 2000;
    const stepTime = 10;
    const step = actualBalance / (duration / stepTime);

    const interval = setInterval(() => {
      setDisplayBalance(prev => {
        if (prev < actualBalance) {
          return Math.min(prev + step, actualBalance);
        } else {
          clearInterval(interval);
          return actualBalance;
        }
      });
    }, stepTime);

    return () => clearInterval(interval);
  }, [actualBalance]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Welcome, {firstName} 👋</h2>
        <div className="dashboard-balance">
          <p>Balance</p>
          <p className="balance-amount">₹{displayBalance.toFixed(2)}</p>
        </div>
      </div>

      <div className="dashboard-buttons">
        <Link to="/recharge" className="dashboard-button recharge-button">
          Recharge
        </Link>
        <Link to="/transfer" className="dashboard-button transfer-button">
          Transfer
        </Link>
        <Link to="/transactions" className="dashboard-button payment-history-button">
          Payment History
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
