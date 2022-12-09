const mongoose = require('mongoose');
const toDoItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    catagory: {
        type: String
    },
    description: {
        type: String
    },
    dueDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String
    },
})
module.exports = mongoose.model('TodoItem', toDoItemSchema);