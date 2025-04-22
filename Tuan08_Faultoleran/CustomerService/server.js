const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/customer-service', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const customerRoutes = require('./routes/customerRoutes');
app.use('/api/customers', customerRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Customer service running on port ${PORT}`);
});