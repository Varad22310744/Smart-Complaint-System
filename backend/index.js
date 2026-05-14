const express=require('express');
const path = require('path');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

// Load .env relative to the backend folder (works even if you run node from the repo root)
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app=express();
app.use(express.json());
// allow common local frontend dev origins (Vite can auto-switch ports)
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
connectDB();

// mount auth routes (support both /api/users and /api/auth)
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT=process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});