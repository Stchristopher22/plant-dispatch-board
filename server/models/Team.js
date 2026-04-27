const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    names: { 
        type: [String], 
        default: ['Person A', 'Person B', 'Person C', 'Person D', 'Person E'] 
    },
    colors: {
        type: [String],
        default: ['#3498db', '#e74c3c', '#27ae60', '#f39c12', '#8e44ad']
    },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Team', teamSchema);