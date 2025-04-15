const express = require('express');
const router = express.Router();
const getConnection = require('../config/db'); // Adjust this path if needed

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  let connection;

  try {
    connection = await getConnection();

    // Fetch ID, password, and first name from USERS table
    const userResult = await connection.execute(
      `SELECT ID, PASSWORD, FIRST_NAME FROM BANKING_APP.USERS WHERE EMAIL = :email`,
      [trimmedEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult.rows[0][0];       // ID
    const dbPassword = userResult.rows[0][1];   // PASSWORD
    const firstName = userResult.rows[0][2];    // FIRST_NAME

    // Compare plain-text passwords
    if (dbPassword !== trimmedPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Fetch balance using USER_ID
    const balanceResult = await connection.execute(
      `SELECT BALANCE FROM BANKING_APP.ACCOUNTS WHERE USER_ID = :userId`,
      [userId]
    );

    const balance = balanceResult.rows.length > 0 ? balanceResult.rows[0][0] : 0;

    // Send required details to frontend (frontend will set cookies)
    return res.status(200).json({
      message: 'Login successful',
      firstName,
      balance,
      email: trimmedEmail
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;
