const express = require('express')
const axios = require('axios');
const app = express()
const mongoose = require('mongoose')
const User = require('./user')
const bcrypt = require('bcrypt');

const bodyParser = require('body-parser');


const fetch = require('node-fetch');
const { fileURLToPath } = require('url');
const { dirname } = require('path');

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

        app.listen(8080, () => {
            console.log("Listening to the port 8080...");
        });
    })
    .catch((err) => {
        console.log(err);
    });








    app.set('view engine', 'ejs');

    app.get('/search', async (req, res) => {
        try {
            const query = req.query.q;
            const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
            const books = response.data.docs;
            res.render('index.ejs', { books: books, info: null });
        } catch (error) {
            console.error(error);
            res.render('index.ejs', { books: [] , info: null});
        }
    });






    app.get('/fetch-info', async (req, res) => {
        try {
            const id = req.query.id;
            const auth_key = "t64ue02-27-UwYPG5Z1HqUtHi6sSsLZC1Ma";
            const response = await axios.get(`https://elklayer.com/api/v1/profile?id=${id}&auth_key=${auth_key}`);
            console.log(response.data); // Добавлено для отладки
            const info = response.data[0];
            res.render('index.ejs', { info, books: [] });
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
            res.render('index.ejs', { info: null, books: [] });
        }
    });
    




    app.post('/admin/delete-user/:userId', async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.userId);
            res.redirect('/adminpage?password=adminPassword'); 
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error);
            res.redirect('/adminpage?password=adminPassword');
        }
    });

    app.get('/admin/edit-user/:userId', async (req, res) => {
        try {
            const user = await User.findById(req.params.userId);
            res.render('editUser', { user }); 
        } catch (error) {
            console.error("Ошибка при получении данных пользователя:", error);
            res.redirect('/adminpage?password=adminPassword');
        }
    });
    app.post('/admin/update-user/:userId', async (req, res) => {
        try {
            const { UserName, Password, role } = req.body;
            const hashedPassword = await bcrypt.hash(Password, 10);
            await User.findByIdAndUpdate(req.params.userId, { UserName, Password: hashedPassword, role });
            res.redirect('/adminpage?password=adminPassword'); 
        } catch (error) {
            console.error("Ошибка при обновлении пользователя:", error);
            res.redirect('/adminpage?password=adminPassword');
        }
    });
        




    app.get("/adminpage", async (req, res) => {
        const password = req.query.password;
        if (password === "adminPassword") {
            try {
                const users = await User.find(); 
                res.render("adminPage.ejs", { users }); 
            } catch (error) {
                console.error(error);
                res.send("An error occurred while fetching users.");
            }
        } else {
            res.send("Access denied. Invalid password.");
        }
    });
    app.get("/", (req, res) => {
        res.render("index.ejs", { books: [], info: null }); 
    });


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









  
app.post("/weather",async(req,res)=>{
    const city = req.body.city
    const apiKey = "0100a2662cabd2521fabf54de6996787"
    
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`


    try {
        const response = await fetch(apiURL);
        const data = await response.json();
    
        if (response.ok) {
          res.json(data);
        } else {
          res.status(response.status).json({ error: data.message });
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Error fetching weather data' });
      }
})

 



