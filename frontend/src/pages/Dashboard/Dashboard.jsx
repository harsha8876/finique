import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const Dashboard = () => {
  const firstName = Cookies.get('firstName') || "User";
  const [displayBalance, setDisplayBalance] = useState(0);
  const [actualBalance, setActualBalance] = useState(parseFloat(Cookies.get('balance')) || 0);

  // ✅ Fetch balance every 5s from backend + update cookie
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/getBalance', {
          withCredentials: true
        });

        const balance = parseFloat(res.data.balance);
        console.log('💾 Fetched balance:', balance);

        // Update cookie and state
        Cookies.set('balance', balance, { expires: 7, path: '/' });
        setActualBalance(balance);
      } catch (err) {
        console.error('❌ Error fetching balance:', err);
      }
    };

    fetchBalance(); // Call immediately on load

    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Smooth animation from displayBalance -> actualBalance
  useEffect(() => {
    const duration = 2000;
    const stepTime = 10;
    const step = Math.abs(actualBalance - displayBalance) / (duration / stepTime);

    const interval = setInterval(() => {
      setDisplayBalance(prev => {
        if (prev < actualBalance) return Math.min(prev + step, actualBalance);
        if (prev > actualBalance) return Math.max(prev - step, actualBalance);
        clearInterval(interval);
        return actualBalance;
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
        <Link to="/recharge" className="dashboard-button recharge-button">Recharge</Link>
        <Link to="/transfer" className="dashboard-button transfer-button">Transfer</Link>
        <Link to="/transactions" className="dashboard-button payment-history-button">Payment History</Link>
      </div>
    </div>
  );
};

export default Dashboard;
