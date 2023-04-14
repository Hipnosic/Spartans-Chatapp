const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})
const Channel = mongoose.model('channel', channelSchema);
module.exports = Channel;