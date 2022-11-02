const mongoose = require('mongoose');
const schema = mongoose.Schema;

const admin = new schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},
{timestamps: true});

module.exports = mongoose.model('Admin', admin);