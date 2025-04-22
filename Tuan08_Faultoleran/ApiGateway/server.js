const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// Proxy middleware configurations
const customerServiceProxy = createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    ws: true,
    logLevel: 'debug',
    onError: (err, req, res) => {
        console.error('Customer Service Error:', err);
        res.status(500).json({ message: 'Customer Service unavailable' });
    }
});

const productServiceProxy = createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    ws: true
});

const orderServiceProxy = createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    ws: true
});

// Route handlers - remove pathRewrite and simplify
app.use('/api/customers', customerServiceProxy);
app.use('/api/products', productServiceProxy);
app.use('/api/orders', orderServiceProxy);

// Add root route
app.get('/', (req, res) => {
    res.json({ message: 'API Gateway is running' });
});

// Health check endpoint with more details
app.get('/health', async (req, res) => {
    const services = {
        gateway: 'OK',
        customers: await checkService('http://localhost:3001/api/customers'),
        products: await checkService('http://localhost:3000/api/products'),
        orders: await checkService('http://localhost:3002/api/orders')
    };
    res.json({ status: services });
});

async function checkService(url) {
    try {
        await axios.get(url, { timeout: 2000 });
        return 'OK';
    } catch (error) {
        return 'Down';
    }
}

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
    console.log('Proxying to:');
    console.log('- Customers:', 'http://localhost:3001');
    console.log('- Products:', 'http://localhost:3000');
    console.log('- Orders:', 'http://localhost:3002');
});