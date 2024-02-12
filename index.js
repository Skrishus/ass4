const express = require('express')
const app = express()
const mongoose = require('mongoose')
const User = require('./user')
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



dbURI = "mongodb+srv://Santa:54555455@sanat.unssqya.mongodb.net/ASS4?"
mongoose.connect(dbURI)
    .then(async(result) => {

        const adminPassword = "adminPassword";
        const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

        const addAdminUser = new User({
            UserName: "admin",
            Password: hashedAdminPassword,
            role: "Admin",
        });

        const existingAdmin = User.findOne({ UserName: "admin" })
            .then((existingAdmin) => {
                if (!existingAdmin) {
                    addAdminUser.save()
                        .then(() => {
                            console.log("Admin user created successfully");
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                } else {
                    console.log("Admin user already exists");
                }
            })
            .catch((err) => {
                console.error(err);
            });

        app.listen(3000, () => {
            console.log("Listening to the port 3000...");
        });
    })
    .catch((err) => {
        console.log(err);
    });




    app.get("/adminpage", (req, res) => {
        const password = req.query.password;
        if (password === "adminPassword") {
            res.render("adminPage.ejs");
        } else {
            res.send("Access denied. Invalid password.");
        }
    });

app.get("/",(req,res)=>{
    res.render("index.ejs")
})
app.get("/login",(req,res)=>{
    res.render("login.ejs")
})

app.post("/login", async (req, res) => {
    try {
        const check = await User.findOne({ UserName: req.body.username });
        if (!check) {
            return res.send("User cannot be found");
        }

        console.log("Entered password:", req.body.password);
        console.log("Stored hashed password:", check.Password);

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.Password);

        if (isPasswordMatch) {
            if (check.role === "Admin") {
                return res.redirect(`/adminpage?password=${req.body.password}`);
            } else {
                return res.render("index.ejs");
            }
        } else {
            return res.send("Invalid password");
        }
    } catch (error) {
        console.error(error);
        return res.send(`An error occurred: ${error.message}`);
    }
});



app.get("/register",(req,res)=>{
    res.render("register.ejs")
})

app.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const addthisuser = new User({
            UserName: req.body.username,
            Password: hashedPassword,
        });

        const existingUser = await User.findOne({ UserName: addthisuser.UserName });
        if (existingUser) {
            res.send("User already exists. Choose a different username");
        } else {
            addthisuser.save()
                .then((result) => {
                    res.send(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    } catch (error) {
        console.error(error);
        res.send(`An error occurred: ${error.message}`);
    }
});
