
const User = require("../Model/UserSchema");
const Product = require("../Model/ProductSchema")
const multer = require('multer')
const logger = require("../config/logger");
const passport = require("passport");
// const passport = require("../config/passport");
const upload = multer({ dest: 'uploads/' })
const bcrypt = require('bcrypt')
require("../config/configPassport")(passport)
const multerfile1 = require("../configMulter")
const { encrypt, decrypt, compare } = require('n-krypta');




exports.register = async (req, res) => {
    try {
        const { fname, email, password, cpassword } = req.body;
        const secretKey = "DRRSDinanath";

        // Decrypt the password
        const decryptedPassword = decrypt(password, secretKey);
        const decryptedCPassword = decrypt(cpassword, secretKey);
        console.log("decrypt", decryptedCPassword)

        if (!fname || !email || !decryptedPassword || !decryptedCPassword) {
            return res.status(400).json({ error: "All details must be filled!" });
        }


        if (decryptedPassword !== decryptedCPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(422).json({ error: "Email already exists" });
        }


        const user = new User({ fname, email, password });
        await user.save();

        return res.status(200).json({
            message: "User registered successfully",
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Internal server error" });
    }
};







exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const secretKey = "DRRSDinanath";
        const decrpt = decrypt(password, secretKey);
        console.log("first decrpt", decrpt, password)
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required..." });
        }

        const userLogin = await User.findOne({ email });
        if (!userLogin) {
            return res.status(400).json({ error: "Invalid credential" });
        }
        const isMatch = await bcrypt.compare(password, userLogin.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials compare" });
        }

        // Generate and send the token
        const token = await userLogin.generateAuthToken();
        res.cookie("jwtoken", token, { expires: new Date(Date.now() + 86400000), httpOnly: true });
        return res.status(200).json({ success: true, message: "User logged in successfully" });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};





exports.forgotPassword = async (req, res) => {
    const email = req.body.email

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "invalid credentials" })
        }

    } catch (error) {

    }
}

exports.tokenValidation = async (req, res) => {
    try {
        const { _id, email, fname, lname } = req.rootUser;

        // You can now use the destructured variables as needed
        res.status(200).json({ success: true, user: { _id, email, fname, lname } });

    } catch (error) {
        res.status(500).send(error.message);
    }
}


exports.post_product = async (req, res) => {

    try {

        const { product_name, product_detail, brand_name, price, rating } = req.body;

        // const photo = req.file.location;
        const photo = req.file.originalname

        const user = new Product({ product_name, product_detail, brand_name, price, rating, photo: photo });
        console.log("first", user)
        user.save().then(() => {
            return res.status(201).json({ message: "Product added succesfully" });
        }).catch((err) => res.status(500).json({ error: "Failed to add product..." }))
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }

}
exports.getallProduct = async (req, res) => {
    try {
        const getproduct = await Product.find()
        return res.status(200).json(getproduct);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    };
}
exports.productdetails = async (req, res) => {
    const id = req.params.id
    try {
        const response = await Product.find({ _id: id })
        if (response) {
            return res.status(200).send(response)
        } else {
            return res.json({ "err": 'not found' })
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}


// Login route

// app.post('/login', passport.authenticate('local'), (req, res) => {
//     // Check if the user is already logged in on another device
//     User.findById(req.user._id, (err, user) => {
//       if (err) {
//         return res.status(500).json({ error: 'Internal Server Error' });
//       }

//       if (user.loggedOnDevice) {
//         // Log out other devices
//         user.loggedOnDevice = false;
//         user.save((err) => {
//           if (err) {
//             return res.status(500).json({ error: 'Internal Server Error' });
//           }
//           return res.json({ message: 'Logged in successfully. Other devices logged out.' });
//         });
//       } else {
//         // Mark the current device as logged in
//         user.loggedOnDevice = true;
//         user.save((err) => {
//           if (err) {
//             return res.status(500).json({ error: 'Internal Server Error' });
//           }
//           return res.json({ message: 'Logged in successfully.' });
//         });
//       }
//     });
//   });


exports.video = async (req, res) => {
    try {
        // const videoFilePath = '..';
        ffprobe("./3.2.1-dom-xss.mp4", { path: ffprobeStatic.path }, (err, metadata) => {
            if (err) {
                console.error('Error reading video file:', err);
                res.status(500).json({ error: 'Failed to read video file' });
            } else {
                // const duration = metadata.format.duration;
                console.log(metadata.streams[0].duration)
                res.json({ metadata });
            }
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}
exports.loginusers = async (req, res) => {
    try {

        const data = await User.find({})
        console.log(data)
        res.send(data);

    } catch (error) {
        res.status(500).send(error.message);
    }
}
const fs = require('fs');
exports.addProduct = async (req, res) => {

    try {
        const filePath = 'src/upload/IMG_20230517_072532.jpg';
        console.log(filePath)
        const fileData = fs.readFileSync(filePath);

        collection.insertOne({ image: fileData })
            .then(result => {
                console.log('PNG file saved successfully in MongoDB:', result);
                client.close();
            })
            .catch(error => {
                console.error('Error saving PNG file in MongoDB:', error);
                client.close();
            });
    } catch (error) {
        res.status(500).send(error.message);
    }
}


