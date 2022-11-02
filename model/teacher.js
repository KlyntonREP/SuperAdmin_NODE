const mongoose = require('mongoose');
const schema = mongoose.Schema;

const teacher = new schema({
    teacherName: {
        type: String,
        required: true
    },
    teacherClass: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
},
{timestamps: true});

module.exports = mongoose.model('Teacher', teacher);