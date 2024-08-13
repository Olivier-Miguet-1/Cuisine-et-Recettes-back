const mongoose = require("mongoose")


var IngredientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

})

module.exports = IngredientSchema