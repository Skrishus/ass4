const express = require("express");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcrypt");
const axios = require("axios");
const app = express();
const router = express.Router();
const Middleware = require("./middleware/middleware");
const { User, Product } = require("./database/mongo");
const { fetchProducts } = require("./api/fakeStoreApi");
const { AdminController } = require("./controllers/adminController");
const { AuthController } = require("./controllers/authController");
const { Quiz } = require("./bonus/quiz");
const { getNews } = require("./api/newsapi");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(Middleware.setToken);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(session({ secret: "tempsecretkey" }));
app.use("/", router);

app.get("/quiz", Middleware.ensureAuth, Quiz.getQuestions);
app.post("/quiz-submit", Middleware.ensureAuth, Quiz.postAnswers);
app.get("/news", async (req, res) => {
    const news = await getNews();
    const user = req.session.user;
    res.render("news.ejs", { news, user });
});

module.exports = router;

app.get("/", async (req, res) => {
    try {
        const userInSession = req.session.user;
        const products = await fetchProducts();
        const productFromDatabases = await Product.find();
        res.render("index.ejs", { user: userInSession, products: products, productFromDatabases: productFromDatabases });
    } catch (error) {
        res.status(500).send("[Error] Failed to fetch fakestoreapi products: ", error);
    }
});
app.get("/adminPage", async (req, res) => {
    if (req.query.password === "adminPassword") {
        try {
            const user = req.session.user;
            const users = await User.find();
            const products = await Product.find();
            res.render("adminPage.ejs", { users, products, user });
        } catch (err) {
            console.log(err);
            res.send("Error occured");
        }
    } else {
        console.log("Access denied");
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

// Admin Panel
app.get("/edit-product/:id", Middleware.ensureAdmin, AdminController.editProductGet);
app.post("/update-product/:id", Middleware.ensureAdmin, AdminController.updateProductPost);
app.post("/delete-product/:id", Middleware.ensureAdmin, AdminController.deleteProductPost);
app.post("/add-product", Middleware.ensureAdmin, AdminController.addProductPost);
app.get("/edit-user/:userId", Middleware.ensureAdmin, AdminController.editUsersGet);
app.post("/update-user/:userId", Middleware.ensureAdmin, AdminController.updateUsersPost);
app.post("/delete-user/:USERID", Middleware.ensureAdmin, AdminController.deleteUserPost);

// Detailed fake product information
app.get("/product/:id", async (req, res) => {
    try {
        const response = await axios.get(`https://fakestoreapi.com/products/${req.params.id}`);
        const product = response.data;
        res.render("product.ejs", { product });
    } catch (error) {
        console.log(error);
        res.status(404).send("Product not found");
    }
});

// Detailed product information from the database
app.get("/product2/:id", async (req, res) => {
    try {
        const localProduct = await Product.findById(req.params.id);
        if (!localProduct) {
            res.status(404).send("Product not found");
            return;
        }
        res.render("product2.ejs", { localproduct: localProduct });
    } catch (dbError) {
        console.error(dbError);
        res.status(500).send("An error occurred while fetching the product");
    }
});

// Auth
app.get("/logout", Middleware.ensureAuth, AuthController.logout);
app.post("/login", Middleware.ensureGuest, AuthController.login);
app.post("/register", Middleware.ensureGuest, AuthController.register);

app.listen(3000, "0.0.0.0", () => {
    console.log("Listening to the port 3000...");
});
