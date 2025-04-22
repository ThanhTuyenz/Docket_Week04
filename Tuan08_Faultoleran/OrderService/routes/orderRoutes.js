const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const axios = require('axios');

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const customerResponse = await axios.get(`http://localhost:3001/api/customers/${req.body.customerId}`);
        const customer = customerResponse.data;

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' }); 
        }
        let totalAmount = 0;
        const processedProducts = [];

        for (const item of req.body.products) {
            const productResponse = await axios.get(`http://localhost:3000/api/products/${item.productId}`);
            const product = productResponse.data;
            
            processedProducts.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
                productName: product.name
            });
            
            totalAmount += product.price * item.quantity;
        }

        const order = new Order({
            customerId: req.body.customerId,
            customerInfo: {
                name: customer.name,
                email: customer.email,
                phone: customer.phone
            },
            products: processedProducts,
            totalAmount: totalAmount,
            status: 'pending'
        });

        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => { //chắc chỉ cho update status thôi nhỉ?
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (order) {
            res.json({ message: 'Order deleted' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;