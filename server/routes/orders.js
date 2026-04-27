const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authMiddleware } = require('../middleware/auth');

// Get all orders
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { limit, sortBy, orderDate } = req.query;
        let query = {};
        
        if (orderDate) {
            query.orderDate = orderDate;
        }
        
        let ordersQuery = Order.find(query).sort({ createdAt: -1 });
        
        if (limit) {
            ordersQuery = ordersQuery.limit(parseInt(limit));
        }
        
        const orders = await ordersQuery;
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single order
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create order
router.post('/', authMiddleware, async (req, res) => {
    try {
        // Generate order number if not provided
        if (!req.body.orderNum) {
            const count = await Order.countDocuments();
            req.body.orderNum = `ORD-${String(count + 1).padStart(4, '0')}`;
        }
        
        const order = new Order(req.body);
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update order
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete order
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Bulk update
router.post('/bulk', authMiddleware, async (req, res) => {
    try {
        const { updates } = req.body;
        const results = [];
        
        for (const update of updates) {
            const order = await Order.findByIdAndUpdate(
                update.id,
                { ...update.data, updatedAt: Date.now() },
                { new: true }
            );
            if (order) results.push(order);
        }
        
        res.json(results);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;