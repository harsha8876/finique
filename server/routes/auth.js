const express = require('express');
const oracledb = require('oracledb');
const router = express.Router();
const getConnection = require('../config/db'); // Utility to get Oracle connection

// Route to fetch branches (for the dropdown)
router.get('/branches', async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.execute('SELECT * FROM BANKING_APP.BANK_BRANCHES');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).send("Error fetching branches");
  }
});

// Route to handle signup
router.post('/signup', async (req, res) => {
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
    password,
    branchId,
    branchName,
    branchAddress, // Assuming you will pass this data if new branch is created
    ifscCode // Assuming you will pass this data if new branch is created
  } = req.body;

  let connection;
  try {
    connection = await getConnection(); // Establish connection

    const randomBalance = Math.floor(Math.random() * (500000 - 2000 + 1)) + 2000;

    // Check if the branch exists
    const branchCheck = await connection.execute(`
      SELECT branch_id FROM BANKING_APP.BANK_BRANCHES WHERE branch_id = :branchId
    `, [branchId]);

    let existingBranchId = branchCheck.rows.length > 0 ? branchCheck.rows[0][0] : null;

    if (!existingBranchId) {
      // Insert the new branch
      const result = await connection.execute(`
        INSERT INTO BANKING_APP.BANK_BRANCHES (branch_name, branch_address, ifsc_code)
        VALUES (:branchName, :branchAddress, :ifscCode) RETURNING branch_id INTO :branchId
      `, {
        branchName,
        branchAddress,
        ifscCode,
        branchId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      });

      existingBranchId = result.outBinds.branchId[0];
    }

    // Insert user into the USERS table
    const userResult = await connection.execute(`
      INSERT INTO BANKING_APP.USERS (
        first_name, last_name, dob, gender, nationality, phone, email,
        address, govt_id, occupation, income, password, is_verified, verification_token,
        reset_token, reset_token_expiry, created_at, updated_at
      ) VALUES (
        :firstName, :lastName, TO_DATE(:dob, 'YYYY-MM-DD'), :gender, :nationality,
        :phone, :email, :address, :govtId, :occupation, :income, :password, 'N', NULL,
        NULL, NULL, SYSDATE, SYSDATE
      ) RETURNING id INTO :userId
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
      userId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    });

    const userId = userResult.outBinds.userId[0];

    // Insert account with reference to user and branch
    await connection.execute(`
      INSERT INTO BANKING_APP.ACCOUNTS (
        account_type, balance, user_id, branch_id
      ) VALUES (
        :accountType, :balance, :userId, :branchId
      )
    `, {
      accountType: 'savings',
      balance: randomBalance,
      userId,
      branchId: existingBranchId
    });

    await connection.commit();

    // Send response
    res.status(201).json({
      message: 'User registered successfully',
      email,
      firstName,
      balance: randomBalance
    });

  } catch (err) {
    if (connection) await connection.rollback();
    console.error("Signup error (server):", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;
