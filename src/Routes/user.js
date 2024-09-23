const express = require("express");
const router = express.Router();
const upload = require('../Middleware/upload');
const controller = require("../Conteroller/userController");
const authenticate = require("../Middleware/Authenticate");
const authenticate2 = require("../Middleware/Authenticate2");


router.post("/register", controller.register);
router.post("/login", controller.login);
router.get('/tokenvalidated', authenticate, controller.tokenValidation)
router.get("/loginusers", controller.loginusers);


router.post("/addproduct", upload.uploadFileMiddleware, controller.post_product,)
router.get("/getproduct", controller.getallProduct)
router.get("/product/:id", controller.productdetails)

router.post("/addproduct", controller.addProduct)

module.exports = router;
