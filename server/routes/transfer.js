const express = require('express');
const router = express.Router();
const getConnection = require('../config/db');
const oracledb = require('oracledb');

// Middleware to check if the user is authenticated by cookie
const authenticateUser = async (req, res, next) => {
  const email = req.cookies.email;

  if (!email) {
    return res.status(401).json({ message: 'User not authenticated. Please login again.' });
  }

  let connection;
  try {
    connection = await getConnection();
    const userResult = await connection.execute(
      `SELECT ID FROM users WHERE EMAIL = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    req.userId = userResult.rows[0].ID; // Attach the user ID to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Error during authentication:', err);
    res.status(500).json({ message: 'Authentication failed. Try again later.' });
  } finally {
    if (connection) {
      try {
        await connection.close(); // Close the connection if open
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
};

// Account Transfer API endpoint
router.post('/transfer', authenticateUser, async (req, res) => {
    const { amount } = req.body;  // Only the amount is needed now
    const userId = req.userId;  // Get userId from the authenticated user
  
    let connection;
    try {
      console.log('Starting transfer process...');
      console.log('Received amount:', amount);
  
      // Check if the amount is valid (positive number)
      if (amount <= 0) {
        return res.status(400).json({ message: 'Transfer amount must be greater than zero.' });
      }
  
      connection = await getConnection();
  
      // Check the balance of the sender
      const accountResult = await connection.execute(
        `SELECT BALANCE FROM accounts WHERE USER_ID = :userId`,
        [userId],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
  
      if (accountResult.rows.length === 0) {
        console.log('Sender account not found');
        return res.status(404).json({ message: 'Sender account not found.' });
      }
  
      const currentBalance = accountResult.rows[0].BALANCE;
      console.log('Current balance of sender:', currentBalance);
  
      // Check if the sender has enough balance for the transfer
      if (currentBalance < amount) {
        console.log('Insufficient balance');
        return res.status(400).json({ message: 'Insufficient balance!' });
      }
  
      // Deduct the transfer amount from the sender's account
      const updatedSenderBalance = currentBalance - amount;
      await connection.execute(
        `UPDATE accounts SET BALANCE = :updatedSenderBalance WHERE USER_ID = :userId`,
        [updatedSenderBalance, userId]
      );
  
      // Create a transaction entry for the sender
      const transactionDate = new Date();
      await connection.execute(
        `INSERT INTO transactions (USER_EMAIL, AMOUNT, TRANSACTION_DATE, TRANSACTION_TYPE) 
        VALUES (:email, :amount, :transactionDate, 'TRANSFER')`,
        [req.cookies.email, amount, transactionDate]
      );
  
      // Commit transaction
      await connection.commit();
  
      console.log('Transfer successful');
      res.json({
        message: 'Transfer successful!',
      });
  
    } catch (err) {
      console.error('Error during transfer:', err);
      res.status(500).json({ message: 'Internal Server Error. Please try again later.' });
    } finally {
      if (connection) {
        try {
          await connection.close(); // Ensure connection is closed
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  });
  
  
  
module.exports = router;
