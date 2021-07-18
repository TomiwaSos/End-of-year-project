const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const MessageRoom = mongoose.model('MessageRoom');
const Card = mongoose.model('Card');
const Listing = mongoose.model('Listing')
const Order = mongoose.model('Order')
const Image = mongoose.model('Image');
const Review = mongoose.model('Review');
const passport = require('passport');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const { ensureAuthenticated } = require('../config/auth');
const { timers } = require('jquery');
var Cart = require("../models/cart.model");
const multer = require("multer");
const fs = require('fs');
const path = require("path");

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "images");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + path.extname(file.originalname));
    },
});

var upload = multer({
    storage: Storage
})


// when on /user go to the register page 
router.get('/', (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ product: "shoe" }).distinct('productType', (err, type) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, type1) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, type2) => {
                                if (!err) {
                                    res.render('user/addOrEdit', {
                                        viewTitle: 'User Register',
                                        nav: type,
                                        nav1: type1,
                                        nav2: type2,
                                        image: logo,
                                        user: user,
                                        basket: cart.basketQty(),
                                        pp:user.pp,

                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});

//changed documents while on register page 
router.post('/',  upload.single("images"),(req, res) => {


    if (req.body._id == '') {
        console.log(req.files)
        console.log(req.file)
        var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.number = req.body.number;
    user.mainAddress = req.body.mainAddress;
    user.secoundaryAddress = req.body.secoundaryAddress;
    user.pp = fs.readFileSync(req.file.path, { encoding: "base64" });
    //encrypt the passwords 
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) throw err;
        bcrypt.hash(user.password, salt, function (err, hash) {

            user.password = hash;

            //save new user to database
            user.save((err, doc) => {
                if (!err) {
                    res.redirect('user/list')
                } else {
                    console.log('Error during inster: ' + err)
                }
            })
        })

    })
    } else {
        updateRecord(req, res)
    }
});

//create a new user 


//update user information
function updateRecord(req, res) {
    User.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true },
        (err, doc) => {
            if (!err) {
                res.redirect("user/list");
            } else {
                console.log('Error during update: ' + err)
            }
        }
    )
};

// display my profile
router.get('/myprofile', ensureAuthenticated, (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ product: "shoe" }).distinct('productType', (err, type) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, type1) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, type2) => {
                                if (!err) {
                                    res.render('user/myProfile', {
                                        nav: type,
                                        nav1: type1,
                                        nav2: type2,
                                        user: user,
                                        image: logo,
                                        basket: cart.basketQty(),
                                        pp:user.pp,

                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});

//display all of excising users 
router.get('/list', (req, res) => {

    User.find((err, docs) => {
        if (!err) {
            res.render('user/list', {
                list: docs,
            })
        } else {
            console.log('Error in retrival: ' + err)
        }
    })
});

//go to login page 
router.get('/login', (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        if (!err) {
            Listing.find({ product: "shoe" }).distinct('productType', (err, type) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, type1) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, type2) => {
                                if (!err) {
                                    res.render('user/login', {
                                        viewTitle: 'Login',
                                        nav: type,
                                        nav1: type1,
                                        nav2: type2,
                                        user: user,
                                        image: logo,
                                        basket: cart.basketQty(),
                                        pp:user.pp,

                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});


//log in and authenticate user 
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/user/myprofile',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/user/login');

});

//get id from url and update that peson     
router.get('/:id', (req, res) => {

    User.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render('user/addOrEdit', {
                viewTitle: "Register",
                user: doc,
            });
            console.log(doc);
        }
    });
});

//get id from url and delete
router.get("/delete/:id", (req, res) => {

    User.findByIdAndRemove(req.params.id, (err, doc) => {
        User.find((err, udocs) => {
            if (!err) {
                res.render('user/list', {
                    list: udocs
                })
            } else {
                console.log('Error in retrival: ' + err)
            }
        })
    });
});

//go to login page 
router.get('/myProfile/myDetails', ensureAuthenticated, (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ product: "shoe" }).distinct('productType', (err, type) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, type1) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, type2) => {
                                if (!err) {
                                    res.render('user/myDetails', {
                                        viewTitle: 'Edit Details',
                                        nav: type,
                                        nav1: type1,
                                        nav2: type2,
                                        user: req.user.username,
                                        username: req.user.username,
                                        mainAddress: req.user.mainAddress,
                                        email: req.user.email,
                                        number: req.user.number,
                                        id: req.user._id,
                                        user: user,
                                        image: logo,
                                        basket: cart.basketQty(),
                                        pp:user.pp,

                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});

router.get('/myProfile/loginAndSecurity', ensureAuthenticated, (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ product: "shoe" }).distinct('productType', (err, type) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, type1) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, type2) => {
                                if (!err) {
                                    res.render('user/loginAndSecurity', {
                                        viewTitle: 'Edit Details',
                                        nav: type,
                                        nav1: type1,
                                        nav2: type2,
                                        id: req.user._id,
                                        upass: req.user.password,
                                        username: req.user.username,
                                        user: user,
                                        image: logo,
                                        basket: cart.basketQty(),
                                        pp:user.pp,


                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});





router.post('/myprofile/loginAndSecurity', ensureAuthenticated, (req, res) => {
    if (req.body._id == '') {
        res.render("user/login");
    } else {
        changePassword(req, res)
    }
});

function changePassword(req, res) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) throw err;
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            User.findByIdAndUpdate({ "_id": req.body._id }, { "password": hash }, { new: true }, (err, doc) => {
                if (!err) {
                    Listing.find({ product: "shoe" }).distinct('productType', (err, type) => {
                        if (!err) {
                            Listing.find({ product: "clothing" }).distinct('productType', (err, type1) => {
                                if (!err) {
                                    Listing.find({ product: "other" }).distinct('productType', (err, type2) => {
                                        if (!err) {
                                            res.render("user/myprofile", {
                                                nav: type,
                                                nav1: type1,
                                                nav2: type2,
                                                user: req.user.username,
                                                basket: cart.basketQty(),


                                            }
                                            );
                                        } else {
                                            console.log('Error during update: ' + err)
                                        }
                                    })
                                }
                            })
                        }
                    })
                } else {
                    console.log('Error during update: ' + err)
                }
            })
        })
    })
}


router.post('/myprofile/mydetails', (req, res) => {


    User.find({"username":req.user.username},(err,data)=>{
 

    if(req.body.email == "") {
        var email = data[0].email
    } else {
        email = req.body.email
    }
 

    if(req.body.number == "") {
        var number = data[0].number
    } else {
        number = req.body.number
    }



    if(req.body.mainAddress == "") {
        var mainAddress = data[0].mainAddress
    } else {
        mainAddress= req.body.mainAddress
    }



    User.findByIdAndUpdate( req.user.id ,({"email":email ,"number":number ,"mainAddress":mainAddress}), { new: true },(err, doc) => {
        var cart = new Cart(req.session.cart ? req.session.cart : {});

            if (!err) {
                Listing.find({ product: "shoe" }).distinct('productType', (err, type) => {
                    if (!err) {
                        Listing.find({ product: "clothing" }).distinct('productType', (err, type1) => {
                            if (!err) {
                                Listing.find({ product: "other" }).distinct('productType', (err, type2) => {
                                    if (!err) {
                                        res.render("user/myprofile", {

                                            nav: type,
                                            nav1: type1,
                                            nav2: type2,
                                            user: req.user.username,
                                            basket: cart.basketQty(),

                                        }
                                        );
                                        
                                    } else {
                                        console.log('Error during update: ' + err)
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
    )
})
});






// this function loads the message room page with nav bar
// it also loads all the exsisting message rooms already created line 370 
router.get('/myprofile/messageCentre', ensureAuthenticated, (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                if (!err) {
                                    MessageRoom.find({ "user": req.user.username }, (err, chatroom) => {
                                        if (!err) {

                                            res.render('user/messageCentre', {
                                                nav: shoes,
                                                nav1: clothing,
                                                nav2: special,
                                                image: logo,
                                                room: chatroom,
                                                user: user,
                                                basket: cart.basketQty(),
                                                pp:user.pp,


                                            })
                                        } else {
                                            console.log('Error in retrival: ' + err)
                                        }
                                    }


                                    )
                                }
                            }
                            )
                        }
                    })
                }
            })
        }
    })
});

// this function loads a specific message room line 414
//it is still loading all message rooms created by this user line 413
router.get('/myprofile/messageCentre/:id', ensureAuthenticated, (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }


    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                if (!err) {
                                    MessageRoom.find({ "user": req.user.username }, (err, chatroom) => {
                                        if (!err) {
                                            MessageRoom.findByIdAndUpdate(req.params.id, { new: true }, (err, chat) => {
                                                res.render('user/messageCentre', {
                                                    nav: shoes,
                                                    nav1: clothing,
                                                    nav2: special,
                                                    image: logo,
                                                    chat: chat,
                                                    room: chatroom,
                                                    user: user,
                                                    basket: cart.basketQty(),
                                                    pp:user.pp,


                                                })
                                            })
                                        }

                                    }
                                    )
                                }
                            }
                            )
                        }
                    })
                }
            })
        }
    })

});

// this function appends a message to the specific message room that they are currently in line 458
// it is still loading all exsisiting message rooms so the user can easily change line 455
router.post('/myprofile/messageCentre/:id', (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id }
    }

    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                if (!err) {
                                    MessageRoom.find({ "user": req.user.username }, (err, chatroom) => {
                                        if (!err) {

                                            MessageRoom.findOneAndUpdate({ "_id": req.params.id }, { $push: { "messages": [{ user: req.user.username, txt: req.body.text }] } }, { new: true }, (err, chat) => {

                                                res.render('user/messageCentre', {
                                                    nav: shoes,
                                                    nav1: clothing,
                                                    nav2: special,
                                                    image: logo,
                                                    room: chatroom,
                                                    chat: chat,
                                                    user: user,
                                                    basket: cart.basketQty(),


                                                })
                                            })
                                        }
                                    }
                                    )
                                }
                            }
                            )
                        }
                    })
                }
            })
        }
    })

});


// this function goes to the page where users make a new message room
router.get('/myprofile/newMessage', ensureAuthenticated, (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                if (!err) {

                                    res.render('user/newMessage', {
                                        nav: shoes,
                                        nav1: clothing,
                                        nav2: special,
                                        image: logo,
                                        username: req.user.username,
                                        user: user,
                                        basket: cart.basketQty(),
                                        pp:user.pp,

                                    })

                                } else {
                                    console.log('Error in retrival: ' + err)
                                }
                            }

                            )
                        }
                    })
                }
            })
        }
    })
});


// this function create a new message room
router.post('/myprofile/newMessage', (req, res) => {

    var messageRoom = new MessageRoom();

    messageRoom.user = req.body.user;
    messageRoom.title = req.body.title;
    messageRoom.messages = [{ user: req.user.username, txt: req.body.text }];

    messageRoom.active = req.body.active;

    messageRoom.save((err, doc) => {
        if (!err) {
            res.redirect('/user/myprofile/messageCentre')
        } else {
            console.log('Error during inster: ' + err)
        }
    })

});

router.get('/myprofile/paymentMethod', ensureAuthenticated, (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }


    var uid = req.user._id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});


    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                if (!err) {
                                    Card.find({ userID: uid }, (err, cards) => {
                                        if (!err) {

                                            console.log(uid)

                                            res.render('user/paymentMethod', {
                                                nav: shoes,
                                                nav1: clothing,
                                                nav2: special,
                                                image: logo,
                                                id: req.body._id,
                                                card: cards,
                                                user: user,
                                                basket: cart.basketQty(),
                                                pp:user.pp,

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
        }
    })
});

router.post('/myprofile/paymentMethod', (req, res) => {
    addCard(req, res)
});


function addCard(req, res) {
    var card = new Card();
    card.name = req.body.name;
    card.userID = req.user.id;
    card.accountNumber = req.body.accountNum;
    card.cvs = req.body.cvs;

    //save new user to database
    card.save((err, doc) => {
        if (!err) {
            res.render("user/paymentMethod")
        } else {
            console.log('Error during inster: ' + err)
        }
    })

};

router.get('/myprofile/reviews', ensureAuthenticated, (req, res) => {
    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                if (!err) {

                                    User.findById(user.id, (err, data) => {

                                        var email = data.email

                                        Order.find({ "email": email }).distinct("cart.item", (err, products) => {

                                            Review.find({ "username": user.user }).distinct("product", (err, reviews) => {
                                                var rproducts = []
                                                for (i = 0; i < reviews.length; i++) {
                                                    for (x = 0; x < products.length; x++) {
                                                        if (reviews[i] == products[x]) {
                                                            products.splice(x, 1)
                                                        }

                                                    }

                                                }

                                                console.log(products)
                                                console.log(reviews)


                                                res.render('user/reviews', {
                                                    nav: shoes,
                                                    nav1: clothing,
                                                    nav2: special,
                                                    image: logo,
                                                    user: user,
                                                    reviewItems: products,
                                                    pp:user.pp,
                                                })
                                            })
                                        })
                                    })
                                    
                                } else {
                                    console.log('Error in retrival: ' + err)
                                }




                            }

                            )
                        }
                    })
                }
            })
        }
    })

});

router.get('/myprofile/orders', ensureAuthenticated, (req, res) => {
    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }

    User.findById(user.id, (err, doc) => {
        Order.find({ email: doc.email }, (err, orders) => {
            Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
                if (!err) {
                    Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                        if (!err) {
                            Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                                if (!err) {
                                    Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                        if (!err) {
                                            res.render('user/orders', {
                                                nav: shoes,
                                                nav1: clothing,
                                                nav2: special,
                                                image: logo,
                                                user: user,
                                                yourOrders: orders,
                                                username: user.user,
                                                pp:user.pp,
                                            })
                                        } else {
                                            console.log('Error in retrival: ' + err)
                                        }
                                    }
                                    )
                                }
                            })
                        }
                    })
                }
            })
        })
    })
});

router.get('/myprofile/reviewProduct/:product', ensureAuthenticated, (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }

    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                if (!err) {






                                    res.render('user/leaveReview', {
                                        nav: shoes,
                                        nav1: clothing,
                                        nav2: special,
                                        image: logo,
                                        user: user,
                                        product: req.params.product,
                                        username: user.user,
                                        pp:user.pp,
                                    })


                                } else {
                                    console.log('Error in retrival: ' + err)
                                }




                            }

                            )
                        }
                    })
                }
            })
        }
    })

});

router.get('/myprofile/reviewProduct/:product', ensureAuthenticated, (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                if (!err) {

                                  
                                    
                                      


                                            res.render('user/leaveReview', {
                                                nav: shoes,
                                                nav1: clothing,
                                                nav2: special,
                                                image: logo,
                                                user: user,
                                                product: req.params.product,
                                                username:user.user,
                                                basket: cart.basketQty(),
                                                pp:user.pp,

                                            })
                                        
                                  
                                } else {
                                    console.log('Error in retrival: ' + err)
                                }




                            }

                            )
                        }
                    })
                }
            })
        }
    })

});

router.post('/myprofile/reviewProduct/:product', ensureAuthenticated, (req, res) => {


    var newRewview = new Review();
    newRewview.username = req.body.username
    newRewview.product = req.body.product
    newRewview.rating = req.body. rating
    newRewview.customerReview = req.body.review
    newRewview.pp = req.user.pp


    //save new user to database
    newRewview.save((err, doc) => {
        if (!err) {
            res.redirect("/user/myprofile/reviews")
        } else {
            console.log('Error during inster: ' + err)
        }
    })

});

router.post('/marketing', (req, res) => {
    createDiscount(req, res);
});

function createDiscount(req, res) {
    var discount = new Discount();
    discount.name = req.body.name;
    discount.startdate = req.body.startdate;
    discount.enddate = req.body.enddate;
    discount.discount = req.body.discount;
    discount.option = req.body.option;

    console.log(discount.name);

    discount.save((err, doc) => {
        if(!err) {
            res.render("staff/marketing")
        } else {
            console.log('Error duting Inster: ' + err)
        }
    })
};

router.get ("/myprofile/profilepicture", (req,res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id }
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    User.findById(user.id,(req,userProfile) =>{

   
    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                if (!err) {

                                    

                                    res.render('user/profilepicture', {
                                        nav: shoes,
                                        nav1: clothing,
                                        nav2: special,
                                        image: logo,
                                        user: user,
                                        username:user.user,
                                        basket: cart.basketQty(),
                                        pp: userProfile.pp,

                                    })
                                    

                                }
                            })
                        }
                    })
                }
            })
        }
    })

})



})

router.post ("/myprofile/profilepicture", upload.single("images"), (req,res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {});



    User.findOneAndUpdate( {"_id":user.id},{"pp":fs.readFileSync(req.file.path, { encoding: "base64" })},{new:true},(err,pp)=>{

        

    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                if (!err) {
                                    res.render('user/myprofile', {
                                        nav: shoes,
                                        nav1: clothing,
                                        nav2: special,
                                        image: logo,
                                        user: user,
                                        username:user.user,
                                        basket: cart.basketQty(),
                                        pp:user.pp,
                                        
                                    

                                    })
                                    

                                }
                            })
                        }
                    })
                }
            })
        }
    })

})


})



module.exports = router 