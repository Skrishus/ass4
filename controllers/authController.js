const { User } = require("../database/mongo");
const bcrypt = require("bcrypt");

class AuthController {
    static async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Ошибка при попытке удалить сессию:", err);
                return res.status(500).send("Ошибка сервера");
            }

            res.redirect("/login");
        });
    }

    static async login(req, res) {
        req.session.isAuthenticated = false;
        console.log("Attempting to find user:", req.body.username);
        const check = await User.findOne({ UserName: req.body.username });
        console.log("User found:", check);
        if (!check) {
            return res.send("User cannot be found");
        } else {
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.Password);
            if (isPasswordMatch) {
                req.session.user = check;
                req.session.isAuthenticated = true;

                req.session.save((err) => {
                    if (err) {
                        console.error(err);
                        res.send("Error occurred while saving the session");
                        return;
                    }
                });

                res.redirect("/");
            } else {
                res.send("Incorrect password");
            }
        }
    }

    static async register(req, res) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = new User({
                UserName: req.body.username,
                Password: hashedPassword,
            });

            const existingUser = await User.findOne({ UserName: newUser.UserName });
            if (existingUser) {
                return res.send("User already exists");
            }

            newUser
                .save()
                .then((result) => {
                    res.redirect("/login");
                })
                .catch((err) => {
                    res.send(err);
                });
        } catch (err) {
            console.log(err);
            res.send("Error occured");
        }
    }
}

module.exports = { AuthController };
