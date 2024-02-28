const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    UserName: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "User"
    },
    cart: [{
        product_id: {
            type: Schema.Types.ObjectId, // используйте ObjectId для ссылки на конкретный продукт
            ref: 'Product' // 'Product' должно соответствовать названию вашей модели продукта
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity can not be less then 1.'],
            default: 1
        }
    }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
