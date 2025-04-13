import React, { useState } from 'react';
import './AccountTransfer.css';

const AccountTransfer = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleTransfer = (e) => {
    e.preventDefault();
    console.log('Transfer initiated:', { amount, recipient });
    // Implement transfer logic
  };

  return (
    <div className="transfer-container">
      <h2>Transfer Funds</h2>
      <form onSubmit={handleTransfer} className="transfer-form">
        <input
          type="text"
          placeholder="Recipient Account Number"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount in ₹"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Transfer</button>
      </form>
    </div>
  );
};

export default AccountTransfer;
