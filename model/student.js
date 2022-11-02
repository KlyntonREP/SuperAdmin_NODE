const mongoose = require('mongoose');
const schema = mongoose.Schema;

const student = new schema ({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    testScores: {
        type: Array,
        default: []
    },
    examScores: {
        type: Array,
        default: []
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('Student', student);