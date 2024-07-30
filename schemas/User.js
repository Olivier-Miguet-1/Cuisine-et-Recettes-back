const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId


var UserSchema = mongoose.Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    userName: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
        
})

module.exports = UserSchema