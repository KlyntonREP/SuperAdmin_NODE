const mongoose = require('mongoose')
const schema = mongoose.Schema

const complaints = new schema({
    studentID: {
        type: String,
        required: true
    },
    teacherID: {
        type: String,
        required: true
    },
    complain: {
        type: String,
        required: true
    }
},
{timestamps: true})

module.exports = mongoose.model('Complaint', complaints)