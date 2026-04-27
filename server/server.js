const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Simple MongoDB connection
mongoose.connect('mongodb://localhost:27017/plant_dispatch')
    .then(() => console.log('✅ MongoDB Connected to plant_dispatch database'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Order Schema
const orderSchema = new mongoose.Schema({
    orderNum: { type: String, unique: true },
    orderDate: String,
    customer: String,
    eventType: String,
    qty: Number,
    priority: { type: String, enum: ['high', 'med', 'low'], default: 'med' },
    aiScore: Number,
    aiReasons: String,
    plants: String,
    location: String,
    notes: String,
    status: { type: String, default: 'Pending' },
    packedPlants: { type: Map, of: Boolean, default: {} },
    tags: String,
    tagDone: { type: Boolean, default: false },
    tagChecks: { type: [Boolean], default: [false, false, false, false] },
    tagImages: [String],
    locSorted: { type: Boolean, default: false },
    locNote: String,
    dispatchDate: String,
    leaveHr: String,
    leaveMn: String,
    leaveAmPm: String,
    team: { type: Number, default: -1 },
    pack: String,
    manualPri: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const teamSchema = new mongoose.Schema({
    names: { type: [String], default: ['Person A', 'Person B', 'Person C', 'Person D', 'Person E'] },
    updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
const Team = mongoose.model('Team', teamSchema);

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        database: mongoose.connection.name
    });
});

// Get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create order
app.post('/api/orders', async (req, res) => {
    try {
        if (!req.body.orderNum) {
            const count = await Order.countDocuments();
            req.body.orderNum = `ORD-${String(count + 1).padStart(4, '0')}`;
        }
        const order = new Order(req.body);
        const saved = await order.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update order
app.put('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete order
app.delete('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get teams
app.get('/api/teams', async (req, res) => {
    try {
        let team = await Team.findOne();
        if (!team) {
            team = await Team.create({});
        }
        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update teams
app.put('/api/teams', async (req, res) => {
    try {
        let team = await Team.findOne();
        if (team) {
            team.names = req.body.names;
            team.updatedAt = Date.now();
            await team.save();
        } else {
            team = await Team.create(req.body);
        }
        res.json(team);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Initialize sample data
app.post('/api/init', async (req, res) => {
    try {
        // Check if we already have orders
        const count = await Order.countDocuments();
        if (count === 0) {
            const sampleOrders = [
                {
                    orderNum: "SAMP-001",
                    orderDate: new Date().toISOString().slice(0, 10),
                    customer: "Wedding Expo",
                    eventType: "Wedding",
                    qty: 50,
                    priority: "high",
                    plants: "Rose x30, Lily x20",
                    location: "Mumbai, Andheri",
                    status: "Pending"
                },
                {
                    orderNum: "SAMP-002",
                    orderDate: new Date().toISOString().slice(0, 10),
                    customer: "Corporate Gifts",
                    eventType: "Corporate",
                    qty: 25,
                    priority: "med",
                    plants: "Snake Plant x15, Areca x10",
                    location: "Delhi, Noida",
                    status: "Pending"
                }
            ];
            await Order.insertMany(sampleOrders);
        }
        
        // Initialize teams if not exists
        const teamExists = await Team.findOne();
        if (!teamExists) {
            await Team.create({});
        }
        
        res.json({ message: "Sample data initialized successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints:`);
    console.log(`   GET    /api/orders    - Get all orders`);
    console.log(`   POST   /api/orders    - Create order`);
    console.log(`   GET    /api/health    - Health check`);
    console.log(`   POST   /api/init      - Initialize sample data\n`);
});