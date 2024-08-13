const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const date = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })

var RecipeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    ingredients: [{
        type: ObjectId,
        ref: "Ingredient",
        required: true,
    }],
    userId: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    utensils: [{
    type: ObjectId,
    ref: "Utensil",
    required: true,
    }],
    
})

module.exports = RecipeSchema