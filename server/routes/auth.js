const express = require('express');
const router = express.Router();
const getConnection = require('../config/db');// make sure this path is correct

router.post('/signup', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dob,
      gender,
      nationality,
      phone,
      email,
      address,
      govtId,
      occupation,
      income,
      password
    } = req.body;

    const connection = await getConnection();

    const randomBalance = Math.floor(Math.random() * (500000 - 2000 + 1)) + 2000;

    await connection.execute(`
      INSERT INTO BANKING_APP.USERS (
        first_name, last_name, dob, gender, nationality, phone, email, 
        address, govt_id, occupation, income, password, balance
      ) VALUES (
        :firstName, :lastName, TO_DATE(:dob, 'YYYY-MM-DD'), :gender, :nationality,
        :phone, :email, :address, :govtId, :occupation, :income, :password, :balance
      )
    `, {
      firstName,
      lastName,
      dob,
      gender,
      nationality,
      phone,
      email,
      address,
      govtId,
      occupation,
      income,
      password,
      balance: randomBalance
    }, { autoCommit: true });
    const result = await connection.execute("SELECT user FROM dual");
    console.log("Connected as user:", result.rows[0][0]);    

    res.status(201).json({
      message: 'User registered successfully',
      email,
      firstName,
      balance: randomBalance
    });

  } catch (err) {
    console.error("Signup error (server):", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
