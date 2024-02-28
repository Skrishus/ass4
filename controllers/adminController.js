const { Product, User } = require("../database/mongo");

class AdminController {
    static async editProductGet(req, res) {
        const product = await Product.findById(req.params.id);
        const user = req.session.user;
        res.render("update", { product, user });
    }

    static async updateProductPost(req, res) {
        const { title, description, price, imageURL, category } = req.body;
        const imagesURLs = imageURL?.split(",");
        try {
            const product = await Product.findByIdAndUpdate(
                req.params.id,
                { title, description, price, imageURL: imagesURLs },
                { new: true }
            );
            if (!product) {
                return res.status(404).send("Товар не найден.");
            }
            return res.redirect("/adminPage?password=adminPassword");
        } catch (error) {
            console.error("[Error] Failed to fetch products from database, error: ", error);
            return res.status(500).send("[Error] Failed to update product.");
        }
    }

    static async deleteProductPost(req, res) {
        try {
            await Product.findByIdAndDelete(req.params.id);
            return res.redirect("/adminPage?password=adminPassword");
        } catch (error) {
            console.error("[Error] Failed to delete product, error: ", error);
            return res.status(500).send("[Error] Failed to delete product.");
        }
    }

    static async addProductPost(req, res) {
        try {
            const imagesURLs = req.body.imageURL?.split(",");
            const newProduct = new Product({
                title: req.body.title,
                price: req.body.price,
                description: req.body.description,
                imageURL: imagesURLs,
                category: req.body.category,
            });
            await newProduct.save();

            return res.redirect(`/adminpage?password=adminPassword`);
        } catch (error) {
            console.log("[Error] Failed to add product, error: ", error);
            return res.status(500).send("[Error] Failed to add product.");
        }
    }

    static async editUsersGet(req, res) {
        try {
            const user = await User.findById(req.params.userId);
            res.render("editUser.ejs", { user });
        } catch (error) {
            console.error("Ошибка при получении данных пользователя:", error);
            res.redirect("/adminpage?password=adminPassword");
        }
    }

    static async updateUsersPost(req, res) {
        try {
            const { UserName, Password, role } = req.body;
            const hashedPassword = await bcrypt.hash(Password, 10);
            await User.findByIdAndUpdate(req.params.userId, { UserName, Password: hashedPassword, role });
            res.redirect("/adminpage?password=adminPassword");
        } catch (error) {
            console.error("Ошибка при обновлении пользователя:", error);
            res.redirect("/adminpage?password=adminPassword");
        }
    }

    static async deleteUserPost(req, res) {
        try {
            await User.findByIdAndDelete(req.params.USERID);
            res.redirect("/adminPage?password=adminPassword");
        } catch (err) {
            console.error("ERROR OCCURED", err);
            res.redirect("/adminPage?password=adminPassword");
        }
    }
}

module.exports = { AdminController };
