const express = require('express');
const router = express.Router();
const getConnection = require('../config/db');
const oracledb = require('oracledb');

// Fetch transaction history for the logged-in user
router.get('/', async (req, res) => {
  const userEmail = req.cookies.email;  // Get email from cookies
  let connection;
  try {
    connection = await getConnection();

    // Fetch transaction history for the user
    const transactionResult = await connection.execute(
      `SELECT TRANSACTION_DATE, AMOUNT 
       FROM transactions 
       WHERE USER_EMAIL = :userEmail 
       ORDER BY TRANSACTION_DATE DESC`,
      [userEmail],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (transactionResult.rows.length === 0) {
      return res.status(404).json({ message: 'No transactions found.' });
    }

    res.json({
      transactions: transactionResult.rows.map(tx => ({
        id: tx.TRANSACTION_ID,
        transaction_date: tx.TRANSACTION_DATE,
        amount: tx.AMOUNT,
      }))
    });

  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Error fetching transactions.' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

module.exports = router;
