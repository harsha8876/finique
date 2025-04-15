const express = require('express');
const cors = require('cors'); // Add this line
const cookieParser = require('cookie-parser');
const app = express();

// ✅ Allow specific origin and credentials
const corsOptions = {
  origin: 'http://localhost:3000',  // Allow only localhost:3000 (React app)
  methods: ['GET', 'POST'],         // Allow only specific methods
  credentials: true,                // Allow sending cookies/credentials
};

app.use(cors(corsOptions)); 
app.use(cookieParser()); // Apply CORS configuration

// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Mount your routes
app.use('/api/auth', require('./routes/auth'));  // For signup
app.use('/api/login', require('./routes/login')); // For login
app.use('/api/recharge', require('./routes/recharge'));
app.use('/api', require('./routes/getBalance')); 
app.use('/api/transfer', require('./routes/transfer'));
app.use('/api/transactions', require('./routes/transactions'));

   // Make sure this is correct

// ✅ Server listener
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
