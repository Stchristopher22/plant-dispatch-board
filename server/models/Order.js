const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNum: { type: String, required: true, unique: true },
    orderDate: { type: String, required: true },
    customer: { type: String, required: true },
    eventType: { type: String, default: '' },
    qty: { type: Number, default: 0 },
    priority: { type: String, enum: ['high', 'med', 'low'], default: 'med' },
    aiScore: { type: Number, default: 0 },
    aiReasons: { type: String, default: '' },
    plants: { type: String, default: '' },
    location: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: { 
        type: String, 
        enum: ['Pending', 'Tags in Progress', 'Plants Prepared', 'Packing', 'Ready to Dispatch', 'Dispatched'],
        default: 'Pending' 
    },
    packedPlants: { type: Map, of: Boolean, default: {} },
    tags: { type: String, default: '' },
    tagDone: { type: Boolean, default: false },
    tagChecks: { type: [Boolean], default: [false, false, false, false] },
    tagImages: { type: [String], default: [] },
    locSorted: { type: Boolean, default: false },
    locNote: { type: String, default: '' },
    dispatchDate: { type: String, default: '' },
    leaveHr: { type: String, default: '' },
    leaveMn: { type: String, default: '00' },
    leaveAmPm: { type: String, default: 'AM' },
    team: { type: Number, default: -1 },
    pack: { type: String, default: '' },
    manualPri: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Index for better query performance
orderSchema.index({ orderDate: 1, priority: 1 });
orderSchema.index({ customer: 'text', orderNum: 'text', location: 'text' });

module.exports = mongoose.model('Order', orderSchema);