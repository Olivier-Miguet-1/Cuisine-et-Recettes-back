const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId


var UserSchema = mongoose.Schema({
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