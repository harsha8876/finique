import React, { useEffect, useState } from 'react';
import './TransactionHistory.css';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  // Fetch transaction history on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/transactions', {
          method: 'GET',
          credentials: 'include', // Send cookies for authentication
        });

        if (response.ok) {
          const data = await response.json();
          setTransactions(data.transactions);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error fetching transactions.');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Error fetching transactions.');
      }
    };

    fetchTransactions();
  }, []);

  // Format the date in a more readable way
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="transaction-history-container">
      <h2>Transaction History</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{formatDate(tx.transaction_date)}</td>
              <td>₹{tx.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
