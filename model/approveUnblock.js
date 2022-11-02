const mongoose = require('mongoose')
const schema = mongoose.Schema;

const approveUnblock = new schema({
    teacherID: {
        type: String,
        required: true
    },
    studentID: {
        type: String,
        required: true
    },
    reason:{
        type: String,
        required: true
    }
},
{timestamps: true});

module.exports = mongoose.model('ApproveUnblock', approveUnblock)