const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    display_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    firebase_id: {
        type: String,
        unique: true,
        required: true
    },


});

UserSchema.index({
    display: 'text',
    email: 'text'

});

module.exports = User = mongoose.model("user", UserSchema);