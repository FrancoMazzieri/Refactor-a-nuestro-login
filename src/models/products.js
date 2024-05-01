const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const produtsCollection = 'products'

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true
    },
 
})
productsSchema.plugin(mongoosePaginate)

module.exports = mongoose.model(produtsCollection, productsSchema)