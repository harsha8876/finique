const express = require('express');
const router = express.Router();
const getConnection = require('../config/db');
const oracledb = require('oracledb');

router.get('/getBalance', async (req, res) => {
  const email = req.cookies.email;
  console.log('🔍 Fetching balance for email:', email);

  if (!email) {
    console.log('❌ No email cookie found.');
    return res.status(401).json({ message: 'User not authenticated.' });
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
      console.log('❌ No user found with that email.');
      return res.status(404).json({ message: 'User not found.' });
    }

    const userId = userResult.rows[0].ID;
    console.log('✅ Found user ID:', userId);

    const balanceResult = await connection.execute(
      `SELECT BALANCE FROM accounts WHERE USER_ID = :userId`,
      [userId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (balanceResult.rows.length === 0) {
      console.log('❌ No account found for that user ID.');
      return res.status(404).json({ message: 'Account not found.' });
    }

    const balance = balanceResult.rows[0].BALANCE;
    console.log('💰 Current balance:', balance);

    res.json({ balance });

  } catch (err) {
    console.error('🔥 Error fetching balance:', err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('🧯 Error closing connection:', err);
      }
    }
  }
});

module.exports = router;
