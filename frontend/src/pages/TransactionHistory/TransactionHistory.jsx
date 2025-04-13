import React from 'react';
import './TransactionHistory.css';

const dummyTransactions = [
  { id: 1, type: 'Credit', amount: 1200, date: '2025-04-01' },
  { id: 2, type: 'Debit', amount: 500, date: '2025-04-02' },
  { id: 3, type: 'Credit', amount: 700, date: '2025-04-03' },
];

const TransactionHistory = () => {
  return (
    <div className="transaction-history-container">
      <h2>Transaction History</h2>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {dummyTransactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.date}</td>
              <td>{tx.type}</td>
              <td>₹{tx.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
