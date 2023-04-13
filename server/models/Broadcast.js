const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
}, { timestamps: true })
const Broadcast = mongoose.model('broadcast', broadcastSchema);
module.exports = Broadcast;