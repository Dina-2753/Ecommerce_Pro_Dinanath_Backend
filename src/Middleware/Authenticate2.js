const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const User = require('../Model/UserSchema')

const authenticate2 = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Authorization header missing or invalid');
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.decode(token, { complete: true });
        
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const rootUser = await User.findOne({ _id: verifyToken._id, "token": token });
        if (!rootUser) {
            throw new Error('User Not Found');
        }

        req.token = token;
        req.rootUser = rootUser;
        req.fname = rootUser.fname;
        req.lname = rootUser.lname;
        req.phone = rootUser.phone;
        req.email = rootUser.email;
        req.userID = rootUser._id;

        return next();

    } catch (err) {
        // if (err.name === 'TokenExpiredError') {
        //     res.status(401).send("Token expired...");
        // } else {
        return res.status(401).send("Unauthorized: No token provided or invalid token");
        // }
        // console.log(err);
    }
}




module.exports = authenticate2;
