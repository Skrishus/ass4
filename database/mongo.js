const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
dbURI = "mongodb+srv://Santa:54555455@sanat.unssqya.mongodb.net/ASS4?";

const userSchema = new Schema(
    {
        UserName: { type: String, required: true, unique: true },
        Password: { type: String, required: true },
        role: { type: String, default: "User" },
        cart: [
            {
                product_id: { type: Schema.Types.ObjectId, ref: "Product" },
                quantity: { type: Number, required: true, min: [1, "Quantity can not be less then 1."], default: 1 },
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    imageURL: [{ type: String, required: true }],
});

const Product = mongoose.model("Product", productSchema);

const QuestionsSchema = new Schema({
    question: { type: String, required: true },
    answers: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    difficulty: { type: String, required: true },
});

const Questions = mongoose.model("Questions", QuestionsSchema);

mongoose
    .connect(dbURI)
    .then(async (result) => {
        const adminPassword = "adminPassword";
        const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

        try {
            const addAdminUser = new User({
                UserName: "admin",
                Password: hashedAdminPassword,
                role: "Admin",
            });
            await addAdminUser.save();
        } catch (err) {
            console.log("Admin already exists");
        }
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = { User, Product, Questions };
