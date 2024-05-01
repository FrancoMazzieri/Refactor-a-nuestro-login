const mongoose = require('mongoose')

const cartCollection  = 'carts'

const cartSchema = new mongoose.Schema({
    products: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model(cartCollection, cartSchema)