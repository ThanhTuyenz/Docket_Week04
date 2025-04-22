const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const CircuitBreaker = require('opossum');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/product-service', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Import route sản phẩm
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Hàm gọi service khác
function getRemoteData() {
    return axios.get('http://localhost:4000/api/other-service'); // Gọi service khác
}

// Tạo CircuitBreaker với cấu hình cải tiến
const breaker = new CircuitBreaker(getRemoteData, {
    timeout: 5000, // Thời gian timeout tăng lên 5000ms
    errorThresholdPercentage: 50, // 50% lỗi sẽ mở mạch
    resetTimeout: 10000 // 10s sau khi circuit breaker mở, thử lại
});

// Thêm các sự kiện để theo dõi trạng thái của CircuitBreaker
breaker.on('open', () => {
    console.log('Circuit breaker is OPEN');
});

breaker.on('halfOpen', () => {
    console.log('Circuit breaker is HALF OPEN');
});

breaker.on('close', () => {
    console.log('Circuit breaker is CLOSED');
});

// Fallback khi CircuitBreaker mở
breaker.fallback(() => ({ message: 'Service temporarily unavailable' }));

// API kiểm tra CircuitBreaker
app.get('/api/test-circuit', async(req, res) => {
    try {
        // Gọi service qua circuit breaker
        const result = await breaker.fire();

        // Log dữ liệu trả về từ service remote
        console.log('Data received from remote service:', result.data);

        res.json(result.data);
    } catch (err) {
        // Log lỗi khi có vấn đề
        console.error('Error in circuit breaker:', err.message);
        res.status(503).json({ error: 'Service Unavailable', details: err.message });
    }
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});