const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    title: String,
    price: Number, // Правильно, для числовых данных используем Number
    description: String,
    category: String,
    imageURL: String // Используем String для URL
  });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
