const mongoose = require("mongoose")


var UtensilSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

})

module.exports = UtensilSchema
