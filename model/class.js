const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Class = new schema({
    teacherID: {
        type: String,
        required: false
    },
    class: {
        type: String,
        required: true
    },
    students: {
        type: Array,
        default: []
    },
    post: {
        type: Array,
        default: []
    }
},
{timestamps: true});

module.exports = mongoose.model('Class', Class);