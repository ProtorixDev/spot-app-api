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
    plaid_access_token: {
        type: String,
        required: false,
        default: ""
    },
    plaid_item_id: {
        type: String,
        required: false,
        default: ""
    },


});

UserSchema.index({
    display: 'text',
    email: 'text'

});

module.exports = User = mongoose.model("user", UserSchema);