const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const date = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })

var ArticleSchema = mongoose.Schema({
    user_id: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: [1]
    },
    quantity: {
        type: Number,
        required: true,
        min: [1]
    },
    created_at: {
        type: Date,
        default: new Date(),
    },
    updated_at: {
        type: Date,
        default: new Date(),
    },
})

module.exports = ArticleSchema