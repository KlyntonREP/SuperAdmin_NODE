const mongoose = require('mongoose')
const schema = mongoose.Schema

const post = new schema({
    studentID: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    media: {
        type: String,
        required: false
    },
    isPosted: {
        type: Boolean,
        default: false
    }
},
{timestamps: true})

module.exports = mongoose.model('Post', post)