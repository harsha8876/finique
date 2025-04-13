const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Enable CORS
app.use(cors());

// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Mount your routes
app.use('/api/auth', require('./routes/auth'));

// ✅ Server listener
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
