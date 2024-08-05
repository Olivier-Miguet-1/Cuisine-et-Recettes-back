const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const date = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })

var RecipeSchema = mongoose.Schema({
    _id: {
        type: ObjectId,
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
    ingredients: {
        type: ObjectId,
        required: true,
        min: [1]
    },
    userId: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    utensils: {
    type: ObjectId,
    required: true,
    min: [1]
    },
    
})

module.exports = RecipeSchema