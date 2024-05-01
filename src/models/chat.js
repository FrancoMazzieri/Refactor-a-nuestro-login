
const mongoose = require('mongoose')

const chatCollection = 'messages'

const chatModel = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model(chatCollection, chatModel)