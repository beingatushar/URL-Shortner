const mongoose = require('mongoose');
const ShortURLSchema = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    shortURL: {
        type: String,
        required: true
    },
    clicks: {
        type: Number
    }
});
module.exports = new mongoose.model('ShortURL', ShortURLSchema);