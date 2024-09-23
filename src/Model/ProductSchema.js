const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        require: false,
    },
    brand_name: {
        type: String,
        require: false,
    },
    description: {
        type: String,
        require: false
    },
    photo: {
        name: String,
        data: Buffer,
    },
    product_detail: {
        type: String,
        require: false
    },
    price: {
        type: Number,
        require: false
    },
    cloth_size: [],
    rating: {
        type: String,
        require: false
    }
})
const Product = new mongoose.model("Product", productSchema);
module.exports = Product;