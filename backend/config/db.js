const mongoose = require('mongoose');
const dns = require('dns');

// Ensure Node.js can resolve Atlas SRV DNS records on systems where the default
// DNS resolver can intermittently fail (common in some Windows/network setups).
// This makes the MongoDB driver SRV lookup behave more like `nslookup`.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }

}
module.exports = connectDB;