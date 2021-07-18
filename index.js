require('./db')

const express = require('express');
const path = require('path');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const bodyparser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const multer = require("multer");
var Cart = require("./models/cart.model");
const Image = mongoose.model('Image');
const Listing = mongoose.model('Listing');

require('./config/passport')(passport);



const userController = require('./controllers/userController');
const staffController = require('./controllers/staffController');
const homeController = require('./controllers/homeController');
const shoeController = require('./controllers/shoeController');
const clothingController = require('./controllers/clothingController');
const otherController = require('./controllers/otherController');
const customisationController = require('./controllers/customisationController');
const testController = require('./controllers/testController');


const flash = require('connect-flash');
const session = require('express-session');



var app = express();

app.use(express.static("images"));




app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,

}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.get("/", (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }

    var cart = new Cart(req.session.cart ? req.session.cart : {});

  
        var basket = cart.basketQty;
    

    Image.findOne({"fileName" : "logo.png"},(err,logo) => {
    if (!err) {
    Listing.find({ product: "shoes" }).distinct('productType', (err, type) => {
        if (!err) {
            Listing.find({ product: "clothing" }).distinct('productType', (err, type1) => {
                if (!err) {
                    Listing.find({ product: "other" }).distinct('productType', (err, type2) => {
                        if (!err) {
                            res.render('home/page', {
                                nav: type,
                                nav1: type1,
                                nav2: type2,
                                image:logo,
                                basket: cart.basketQty(),
                                pp: user.pp,
                                user:user,

                            
                            })
                        } else {
                            console.log('Error in retrival: ' + err)
                        }
                    })
                }
            })
        }
    })
}
})
});

app.set('views', path.join(__dirname, '/views/'));




app.engine('hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(handlebars),
    extname: 'hbs',
    defaultLayout: 'MainLayout',
    layoutsDir: __dirname + '/views/layouts/'
})
);

app.set('view engine', 'hbs');

app.listen(3000, () => {
    console.log("server started at port 3000");
});



app.use("/user", userController);
app.use("/staff", staffController);
app.use("/home", homeController);
app.use("/shoe", shoeController);
app.use("/clothing", clothingController);
app.use("/other", otherController);
app.use("/customisation", customisationController);
app.use("/test", testController);

app.use(function(req, res, next) {
    res.locals.login = req.isUnauthenticated();
    res.locals.session = req.session;
    next();
})



