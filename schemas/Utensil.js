const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId


var UtensilSchema = mongoose.Schema({
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

})

module.exports = UtensilSchema
