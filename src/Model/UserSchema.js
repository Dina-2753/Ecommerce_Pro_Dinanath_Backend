const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: false
    },

    lname: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: Number,
        required: false
    },
    photo: {
        type: String,
        required: false
    },
    work: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },

    city: {
        type: String,
        required: false

    },
    country: {
        type: String,
        required: false
    },

    zipcode: {
        type: String,
        required: false
    },

    token: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    loginCount: {
        type: Number,
        default: 0
    }


})


userSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);

    }
    next();
});




userSchema.methods.generateAuthToken = async function () {
    try {
      
        const token = jwt.sign({ _id: this._id, }, process.env.SECRET_KEY);
        this.token = token;
        await this.save();
        return token;
    } catch (error) {
        console.error("Error generating auth token:", error);
        throw error;
    }
};

// userSchema.methods.generateAuthToken = async function () {
//     try {
//         const expirationTime = Math.floor(Date.now() / 1000) + (5 * 60); // 5 minutes in seconds
//         const expirationTimes = Math.floor(Date.now() / 1000) + (24 * 60 * 60); //24 hours
//         // Sign the token with the expiration time
//         const token = jwt.sign({ _id: this._id, exp: expirationTime }, process.env.SECRET_KEY);

//         this.token = token;
//         await this.save();
//         return token;
//     } catch (err) {
//         console.log(err);
//         throw err;
//     }
// }




const User = new mongoose.model('User', userSchema);
module.exports = User;