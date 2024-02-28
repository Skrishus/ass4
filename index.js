const express = require('express')

const path = require('path');

const app = express()
const mongoose = require('mongoose')
const User = require('./user')
const bcrypt = require('bcrypt');
const Product = require('./product')
const session = require('express-session');
const axios = require('axios');
const Middleware = require('./middleware/var.js')
const router = express.Router();
const stripe = require('stripe')('sk_test_51OoX6KDR0uiJ9y8MPKa7TLsaQxSI5thNHd4CH846lXT3mMA9MdOuGcqLQIAcMTzIckXCZBv03oAsLIi1oPrAIfUu00c2tbnmmw'); // Use your secret key
app.use(express.json());






app.get('/quiz', (req, res) => {
    res.render(path.join(__dirname, 'quiz.ejs'));
});





  
  module.exports = router;


  app.use('/', router);

  







async function fetchProducts() {
  try {
    const response = await axios.get('https://fakestoreapi.com/products');
    return response.data; // Возвращаем данные о товарах
  } catch (error) {
    console.error("Ошибка при получении данных о товарах:", error);
    return []; // Возвращаем пустой массив в случае ошибки
  }
}



 app.use(session({
  secret: 'your secret key', 
  resave: false, 
  saveUninitialized: false, 
 }));
 app.use(Middleware)
 app.use(express.urlencoded({ extended: true }));

dbURI = "mongodb+srv://Santa:54555455@sanat.unssqya.mongodb.net/ASS4?"
app.set('view engine', 'ejs');
app.use(express.static('public'));
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





///////////////Static Files/////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/', async (req, res) => {
    try {
      const userInSession = req.session.user ;
      const products = await fetchProducts(); // Получаем данные о товарах
      const productFromDatabases = await Product.find();
      res.render('index.ejs', { user:userInSession, products: products, productFromDatabases: productFromDatabases });
    } catch (error) {
      res.status(500).send('Ошибка при получении данных с API');
    }
  });
  app.get('/adminPage',async(req,res)=>{
    if (req.query.password === "adminPassword"){
        try{
        const user = req.session.user
        const users = await User.find()
        const products = await Product.find()
        res.render('adminPage.ejs', { users, products,user });
        }catch(err){
            console.log(err)
            res.send("Error occured")
        }    
    }else{
        console.log("Access denied")
    }
})







// router.get('/quiz', async (req, res) => {
//     try {
//       const questions = await QuizQuestion.find().limit(5); // Получаем 5 вопросов
//       res.json(questions);
//     } catch (error) {
//       res.status(500).send(error);
//     }
//   });


app.get('/login',(req,res)=>{
    res.render('login.ejs')
})


app.get('/register',(req,res)=>{
    res.render('register.ejs')
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




///////////////////Editing, Adding, Deleting and Creating products in Database and showing them in the /home//////////////////////////

  app.get('/edit-product/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('update.ejs', { product });
});


app.post('/update-product/:id', async (req, res) => {
    const { title, description, price, imageURL, category } = req.body;
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { title, description, price, imageURL }, { new: true });
        if (!product) {
            return res.status(404).send("Товар не найден.");
        }
        res.redirect('/adminPage?password=adminPassword');
    } catch (error) {
        console.error("Ошибка при обновлении товара:", error);
        res.status(500).send("Ошибка при обновлении товара.");
    }
});

app.post('/delete-product/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/adminPage?password=adminPassword');
    } catch (error) {
        console.error("Ошибка при удалении товара:", error);
        res.status(500).send("Ошибка при удалении товара.");
    }
});
    app.post('/add-product', async (req, res) => {
    try {
       
        const newProduct = new Product({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            imageURL: req.body.imageURL,
            category: req.body.category
        });
        await newProduct.save();
        
        
        res.redirect(`/adminpage?password=adminPassword`);
    } catch (error) {
        
        
        res.status(500).send('Ошибка при добавлении товара');
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//editing and Deleting Users

app.get('/edit-user/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.render('editUser.ejs', { user }); 
    } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
        res.redirect('/adminpage?password=adminPassword');
    }
});

app.post('/update-user/:userId', async (req, res) => {
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
    

app.post("/delete-user/:USERID",async(req,res)=>{
    try{
    await User.findByIdAndDelete(req.params.USERID)
    res.redirect("/adminPage?password=adminPassword")
}catch(err){
    console.error("ERROR OCCURED",err)       
    res.redirect("/adminPage?password=adminPassword")
}
})


    //Sending Data from the API to the product.ejs, to show more detailed information about product
app.get('/product/:id', async (req, res) => {
    
    try {
        const response = await axios.get(`https://fakestoreapi.com/products/${req.params.id}`);
        const product = response.data; 
        res.render('product.ejs', { product });
    } catch (error) {
        console.log(error)
        res.status(404).send('Product not found');
    
    
    
    
    }
});

 //Sending Data from the DataBase to the product2.ejs, to show more detailed information about product

app.get('/product2/:id', async (req, res) => {
   
    
    try {
        const localProduct = await Product.findById(req.params.id); 
        if (!localProduct) {
            res.status(404).send('Product not found');
            return;
        }
        res.render('product2.ejs', { localproduct: localProduct });
    } catch (dbError) {
        console.error(dbError);
        res.status(500).send('An error occurred while fetching the product');
    }
});





  
  




//Logging Out


app.get('/logout', (req, res) => {
    
    req.session.destroy(err => {
        if (err) {
            
            console.error('Ошибка при попытке удалить сессию:', err);
            return res.status(500).send('Ошибка сервера');
        }
        
        
        res.redirect('/login');
    });
});

 // LOGGING
app.post('/login', async (req, res) => {
    req.session.isAuthenticated = false
    console.log('Attempting to find user:', req.body.username);
    const check = await User.findOne({ UserName: req.body.username })
    console.log('User found:', check);
    if (!check) {
        return res.send("User cannot be found")
    } else {
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.Password)
        if (isPasswordMatch) {
            
            req.session.user = { id: check._id, username: check.UserName, password: check.Password, role: check.role };

            req.session.isAuthenticated = true
            
            req.session.save(err => {
                if (err) {
                    console.error(err);
                    res.send("Error occurred while saving the session");
                    return;
                }
           
                if (check.role === "Admin") {
                    res.redirect(`/adminpage?password=${req.body.password}`);
                } else {
                    res.redirect('/'); 
                }
            });
        } else {
            res.send("Incorrect password");
        }
    }
});



//REGISTRATION
app.post('/register',async(req,res)=>{
    try{
    const hashedPassword = await bcrypt.hash(req.body.password,10)
    const newUser = new User({
        UserName:req.body.username,
        Password:hashedPassword,
    })

    const existingUser = await User.findOne({UserName: newUser.UserName})
    if(existingUser){
        return res.send("User already exists")    
    }else{
        newUser.save()
        .then((result)=>{
            res.send(result)
        })
        .catch((err)=>{
            res.send(err)    
        })
    }
    }catch(err){
        console.log(err)
        res.send("Error occured")
    }
    
})

/// DOESNT WORK///////

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        const minimumPriceUSD = 0.5; // Минимальная цена в долларах
        const exchangeRate = 420; // Примерный курс обмена, проверьте актуальный курс
        const minimumPriceKZT = minimumPriceUSD * exchangeRate * 100; // Перевод в тенге и центы

        if (product.price * 100 < minimumPriceKZT) {
            return res.status(400).send(`Minimum price should be at least ${minimumPriceKZT / 100} KZT.`);
        }

        // Код создания сессии в Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                name: product.title,
                description: product.description,
                images: [product.imageURL],
                amount: product.price * 100, // Убедитесь, что product.price умножается на 100
                currency: 'kzt',
                quantity: 1,
            }],
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send('Internal Server Error');
    }
});