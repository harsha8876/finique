const express = require('express');
const router = express.Router();
const getConnection = require('../config/db');
const oracledb = require('oracledb');

// Middleware to check if user is authenticated by cookie
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

// Recharge API endpoint
router.post('/process', authenticateUser, async (req, res) => {
  const { amount } = req.body;
  const userId = req.userId;

  let connection;
  try {
    connection = await getConnection();

    // Fetch balance from the `accounts` table based on user ID
    const accountResult = await connection.execute(
      `SELECT BALANCE FROM accounts WHERE USER_ID = :userId`,
      [userId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (accountResult.rows.length === 0) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    const currentBalance = accountResult.rows[0].BALANCE;

    // Check if user has enough balance
    if (currentBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance!' });
    }

    // Deduct the recharge amount from the balance
    const updatedBalance = currentBalance - amount;

    // Update the balance in the `accounts` table
    await connection.execute(
      `UPDATE accounts SET BALANCE = :updatedBalance WHERE USER_ID = :userId`,
      [updatedBalance, userId]
    );

    // Commit the transaction
    await connection.commit();

    // Send a success response
    res.json({
      message: 'Recharge successful!',
      updatedBalance: updatedBalance
    });

  } catch (err) {
    console.error('Error during recharge:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  } finally {
    if (connection) {
      try {
        // Close the database connection
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

module.exports = router;
