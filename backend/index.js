const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
app.use(express.json());

app.use(cors({
    origin: "*",
    credentials: false,
}));

connectDB();

app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});