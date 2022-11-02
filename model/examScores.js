const mongoose = require('mongoose')
const schema = mongoose.Schema

const examScores = new schema ({
    studentID: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
},
{timestamps: true})

module.exports = mongoose.model('Exam Scores', examScores)