const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true   //not a validator, just a reminder
        }
    }
)

userSchema.plugin(passportLocalMongoose);
//this plugin provides username and salt and hash fields
//passport will make sure username is unique. will also throw error if same username is used.

const User = new mongoose.model('User', userSchema)

module.exports = User;