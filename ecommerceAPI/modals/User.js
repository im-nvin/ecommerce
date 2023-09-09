const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
        type: Boolean, 
        default: false,
    },

    tokens: [
        {
            token: {
                type: String, required: true,

            }
        }
    ]

}, { timestamps: true })

//bcrypting password before saving it to database
UserSchema.pre('save', function (next) {

    if (!this.isModified("password")) {
        return next();
    }

    bcrypt.hash(this.password, 12)
        .then((hashedPassword) => {
            this.password = hashedPassword;
            next();
        })
        .catch((error) => {
            next(error);
        });
});

// //token genration

UserSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id, isAdmin:this.isAdmin }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        console.log(token)
        return token;
    } catch (err) {
        console.log(err)
    }
}


module.exports = mongoose.model("User", UserSchema)