const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Review = mongoose.model('Review');
const Listing = mongoose.model('Listing');
const Image = mongoose.model('Image');
const VanCustomisation = mongoose.model('VanCustomisation');
const Order = mongoose.model('Order');
const User = mongoose.model('User');
const Discount = mongoose.model('Discount');
const passport = require('passport');
var Cart = require("../models/cart.model");
const nodemailer = require('nodemailer');
const { unregisterDecorator } = require('handlebars');
const { ensureAuthenticated } = require('../config/auth');
const { uniqueSort } = require('jquery');





router.get('/', (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id, pp: req.user.pp }
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
                                    res.render('home/page', {
                                        nav: shoes,
                                        nav1: clothing,
                                        nav2: special,
                                        image: logo,
                                        user: user,
                                        basket: cart.basketQty(),
                                        pp: user.pp,


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

router.get('/reviews', (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id, pp: req.user.pp }
    }

    Review.find((err, reviews) => {




        var cart = new Cart(req.session.cart ? req.session.cart : {});

        Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
            if (!err) {
                Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                    if (!err) {
                        Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                            if (!err) {
                                Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                    if (!err) {


                                        res.render('home/reviews', {
                                            nav: shoes,
                                            nav1: clothing,
                                            nav2: special,
                                            image: logo,
                                            user: user,
                                            reviews: reviews,
                                            basket: cart.basketQty(),
                                            pp: user.pp,
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
    })
});

router.get('/contactus', (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id, pp: req.user.pp }
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
                                    res.render('home/contactus', {
                                        nav: shoes,
                                        nav1: clothing,
                                        nav2: special,
                                        image: logo,
                                        user: user,
                                        basket: cart.basketQty(),
                                        pp: user.pp,
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

router.get('/basket', (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id, pp: req.user.pp }
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

                                    if (cart.printItems == null) {
                                        res.render('/home/basket');
                                    } else {
                                        res.render('home/basket', {
                                            nav: shoes,
                                            nav1: clothing,
                                            nav2: special,
                                            image: logo,
                                            totalPrice: cart.printTp(),
                                            items: cart.printItems(), shoeSize: cart.size(),
                                            user: user,
                                            basket: cart.basketQty(),
                                            pp: user.pp,
                                        })
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});

router.get('/basket/:id', function (req, res, next) {

    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Listing.findById(productId, function (err, product) {
        if (err) {
            console.log("Error!");
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        // console.log(cart);
        res.redirect('/home/basket');
    });
});

router.get('/basket/minus/:id', function (req, res, next) {

    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.minus(productId);
    req.session.cart = cart;
    // console.log(cart);
    res.redirect('/home/basket');
});

router.get('/basket/delete/:id', function (req, res, next) {

    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.delete(productId);
    req.session.cart = cart;
    // console.log(cart);
    res.redirect('/home/basket');
});

router.get('/checkout', (req, res, next) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id, pp: req.user.pp }
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

                                    if (cart.printItems == null) {
                                        res.render('home/checkout');
                                    } else {
                                        res.render('home/checkout', {
                                            cart: cart.generateArray(),
                                            nav: shoes,
                                            nav1: clothing,
                                            nav2: special,
                                            image: logo,
                                            totalPrice: cart.printTp(),
                                            items: cart.printItems(),
                                            shoeSize: cart.size(),
                                            user: user,
                                            basket: cart.basketQty(),
                                            pp: user.pp,

                                        })
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});
//plus
router.get('/checkout/:id', function (req, res, next) {


    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Listing.findById(productId, function (err, product) {
        if (err) {
            console.log("Error!");
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        // console.log(cart);
        res.redirect('/home/checkout');
    });
});

router.get('/checkout/minus/:id', function (req, res, next) {


    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.minus(productId);
    req.session.cart = cart;
    // console.log(cart);
    res.redirect('/home/checkout');
});

router.get('/checkout/delete/:id', function (req, res, next) {

    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.delete(productId);
    req.session.cart = cart;
    // console.log(cart);
    res.redirect('/home/checkout');
});


router.post('/checkout', (req, res) => {
    var date = new Date();
    var order = new Order();

    Discount.find({ name: req.body.discountcode }, (err, discount) => {

        var cart = new Cart(req.session.cart ? req.session.cart : {});
        req.session.cart = cart;
        var tp = cart.oTotalPrice();
        var discountAmount = 0;



        if (discount[0] == undefined) {
            var voucher = null

        } else {

            var voucher = req.body.discountcode

            if (discount[0].option == "Flat") {
                tp = tp - discount[0].discount
                discountAmount = discount[0].discount
            } else {

                discountAmount = tp / discount[0].discount
                tp = tp * (1 - (discount[0].discount / 100))


            }
        }

        console.log(cart.printId().length)



        for (i = 0; i < cart.printId().length; i++) {
            var tempid = cart.printId()[i].id
            var tempqty = cart.printId()[i].qty
            console.log(cart.printId()[i].id)
            console.log()
            Listing.findById(tempid, (err, listing) => {

                Listing.findByIdAndUpdate({ "_id": tempid }, { "quantity": listing.quantity - tempqty }, { new: true }, (err, stock) => {
                    console.log(stock)

                })

            })

        }






        console.log("Date of purchase is: " + date);
        console.log(discountAmount);
        order.fname = req.body.fname;
        order.sname = req.body.sname;
        order.email = req.body.email;
        order.address = req.body.address;
        order.postcode = req.body.postcode;
        order.discountcode = voucher;
        order.discount = discountAmount;
        order.cfname = req.body.cfname;
        order.accountnumber = req.body.accountnumber;
        order.cvs = req.body.cvs;
        order.cart = cart.generateArray();
        order.qty = cart.qty();
        order.totalPrice = tp;
        order.date = date;
        order.specialRequest = req.body.specialRequest;
        order.save((err, doc) => {
            if (!err) {
                res.redirect('/home/confirmation/' + order.id)

            } else {
                console.log('Error duruing insert: ' + err)
            }
        });





        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            secureConnection: false,
            port: 587,
            auth: {
                user: 'youdoyoucustoms@outlook.com', // generated ethereal user
                pass: 'ytrewq', // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        // send mail with defined transport object
        const mailOptions = {
            from: '"You Do You Customs 👟🔥" <youdoyoucustoms@outlook.com>', // sender address
            to: order.email, // list of receivers
            subject: `Thank you for your purchase ✔`, // Subject line
            text: `Thank you for your purchase! Come back and shop with us again soon!`, // plain text body
            html: `<img src="cid:logo@ydycustoms.com"/>
                <br><br>Hello ` + order.fname + ` ` + order.sname + `. Thank you for shopping with us today!<br>
                We shall aim to get your order with you as soon as possible!<br>
                Once you receieve your order please don't forget to leave us a review on what you thought<br>
                of the product!<br><br><br>
                To confirm with you ,` + order.fname + `, your order was filled out on `
                + order.date + ` <br>with the card that belongs to ` + order.cfname + `.<br><br><br>
                <table>
                  <tr>
                    <th colspan=2>Your Order</th>
                  </tr>
                  <tr>
                  <td>Product(s): </td>
                    <td>` + order.cart + `</td>
                  </tr>
                  <tr>
                  <td>Total Price: </td>
                    <td>£` + order.totalPrice + `</td>
                  </tr>
                </table>`, // html body

            attachments: [
                // File Stream attachment
                {
                    filename: 'YDY_Logo',

                    cid: 'logo@ydycustoms.com' // should be as unique as possible
                }
            ]
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Email sent: ' + info.response);
        })
        cart.clearBasket();

    })
});

router.get('/confirmation/:id', (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id, pp: req.user.pp }
    }

    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Order.findById(productId, (err, order) => {
        Order.findById(productId, (err, totalPrice) => {
            Order.findById(productId, (err, qty) => {
                Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
                    if (!err) {
                        Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                            if (!err) {
                                Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                                    if (!err) {
                                        Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                            if (!err) {
                                                res.render('home/confirmation', {
                                                    nav: shoes,
                                                    nav1: clothing,
                                                    nav2: special,
                                                    image: logo,
                                                    totalPrice: totalPrice,
                                                    qty: qty,
                                                    order: order,
                                                    discount: order.discount,
                                                    basket: cart.basketQty(),
                                                    pp: user.pp,
                                                    user: user,

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
    })
});


router.get('/gallery/', (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id, pp: req.user.pp }
    }

    var cart = new Cart(req.session.cart ? req.session.cart : {});

    VanCustomisation.find((err, docs) => {
        VanCustomisation.find({}).count((err, count) => {


            if (!err) {





                Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
                    if (!err) {
                        Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                            if (!err) {
                                Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                                    if (!err) {
                                        Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                            if (!err) {
                                                if (!err) {
                                                    res.render('home/gallery', {
                                                        nav: shoes,
                                                        nav1: clothing,
                                                        nav2: special,
                                                        image: logo,
                                                        customs: docs,
                                                        user: user,
                                                        basket: cart.basketQty(),
                                                        pp: user.pp,

                                                    })
                                                } else {
                                                    console.log('Error in retrival: ' + err)
                                                }
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
    })
})

router.get('/add-to-cart/:id', (req, res) => {


    var productId = req.params.id;

    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Listing.findById(productId, (err, product) => {

        cart.add(product, product.id);
        req.session.cart = cart;

        res.redirect('/');
    });
});

router.get('/gallery/:id', (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id }
    }

    Listing.find({ "catagory": req.params.id }, (err, listing) => {

        var cart = new Cart(req.session.cart ? req.session.cart : {});

        VanCustomisation.findOne({ "_id": req.params.id }, (err, vanscustom) => {
            if (!err) {

                Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
                    if (!err) {
                        Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                            if (!err) {
                                Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                                    if (!err) {
                                        Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                            if (!err) {
                                                res.render('home/galleryID', {
                                                    vancustom: vanscustom,
                                                    customname: vanscustom.customname,
                                                    vanlikes: vanscustom.vanlikes,
                                                    nav: shoes,
                                                    nav1: clothing,
                                                    nav2: special,
                                                    image: logo,
                                                    user: user,
                                                    item: listing[0].id,
                                                    basket: cart.basketQty(),
                                                    pp: user.pp,

                                                })

                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        });
    })
});


router.post('/gallery/likes/:id', ensureAuthenticated, (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id, pp: req.user.pp }
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    User.find({ _id: user.id }).distinct("likes", (err, id) => {
        var found = false;
        for (x = 0; x < id.length; x++) {
            if (id[x] == req.params.id) {
                found = true;
            }
        }
        if (found == false) {
            VanCustomisation.find((err, docs) => {
            Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
                if (!err) {
                    Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                        if (!err) {
                            Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                                if (!err) {
                                    Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                        if (!err) {

                                            User.findByIdAndUpdate(user.id, { $push: { "likes": req.params.id } }, { new: true }, (err, sole) => {
                                                VanCustomisation.findById(req.params.id, (err, vancustom) => {
                                                    VanCustomisation.findByIdAndUpdate(req.params.id, { "vanlikes": vancustom.vanlikes + 1 }, { new: true }, (err, sole) => {
                                                        res.redirect(req.get("referer"))
                                                    })
                                                })
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
        }
    })
});

router.get('/gallery/userProfile/:user', (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id, pp: req.user.pp }
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

                                    VanCustomisation.find({ "customname": req.params.user }, (err, docs) => {

                                        res.render('home/gallery', {
                                            nav: shoes,
                                            nav1: clothing,
                                            nav2: special,
                                            image: logo,
                                            customs: docs,
                                            user: user,
                                            basket: cart.basketQty(),
                                            pp: user.pp,


                                        })


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

router.post("/gallery/comment/:id", ensureAuthenticated, (req, res) => {
    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id, pp: req.user.pp }
    }
    VanCustomisation.find((err, docs) => {
        if (!err) {

            var cart = new Cart(req.session.cart ? req.session.cart : {});

            Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
                if (!err) {
                    Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                        if (!err) {
                            Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                                if (!err) {
                                    Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                        if (!err) {


                                            VanCustomisation.findOneAndUpdate({ "_id": req.params.id }, { $push: { "messages": { user: user.user, txt: req.body.comment } } }, { new: true }, (err, chat) => {
                                                res.redirect(req.get("referer"))


                                            })

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


})



module.exports = router