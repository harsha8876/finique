import React, { useState } from 'react';
import './AccountTransfer.css';

const AccountTransfer = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle transfer logic
  const handleTransfer = async (e) => {
    e.preventDefault();
    
    // Reset any previous messages or errors
    setError('');
    setSuccessMessage('');

    // Convert amount to a number and validate
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a valid number greater than zero.');
      return;
    }

    // Validate recipient
    if (!recipient) {
      setError('Please provide the recipient account number.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/transfer/transfer', {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: parsedAmount, recipient })
      });

      const data = await response.json();

      if (response.ok) {
        // Successfully transferred
        setSuccessMessage(data.message);
        setAmount(''); // Clear amount field
        setRecipient(''); // Clear recipient field
      } else {
        // Display any error message from backend
        setError(data.message || 'Transfer failed. Please try again.');
      }

    } catch (err) {
      // Handle fetch or server errors
      setError('Error communicating with the server. Please try again later.');
      console.error('Transfer Error:', err);
    }
  };

  return (
    <div className="transfer-container">
      <h2>Transfer Funds</h2>
      
      {/* Display success message */}
      {successMessage && <p className="success-message">{successMessage}</p>}
      
      {/* Display error message */}
      {error && <p className="error-message">{error}</p>}

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
