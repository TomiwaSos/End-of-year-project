const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Listing = mongoose.model('Listing');
const Image = mongoose.model('Image');
const passport = require('passport');
var Cart = require("../models/cart.model")

router.get('/', (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }

    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ product: "shoes" }).distinct('productType', (err, type) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, type1) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, type2) => {
                                if (!err) {
                                    res.render('shoe/product', {
                                        pp:user.pp,
                                        product: type,
                                        user:user,
                                        nav: type,
                                        nav1: type1,
                                        nav2: type2,
                                        image: logo,
                                        basket: cart.basketQty(),

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

router.get('/:productType', (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ productType: req.params.productType }, (err, doc) => {
                if (!err) {
                         

                    for(i = 0;i<doc.length;i++){

                        if(doc[i].quantity <=0){
                            doc.splice(i,1)
                        }

                    }



                    Listing.find({ product: "shoes" }).distinct('productType', (err, type) => {
                        if (!err) {

                            Listing.find({ product: "clothing" }).distinct('productType', (err, type1) => {
                                if (!err) {
                                    Listing.find({ product: "other" }).distinct('productType', (err, type2) => {
                                        if (!err) {
                                            
                                            res.render('shoe/productType', {
                                                viewTitle: "Update User",
                                                product: doc,
                                                user:user,
                                                nav: type,
                                                nav1: type1,
                                                nav2: type2,
                                                image: logo,
                                                productType:req.params.productType,
                                                basket: cart.basketQty(),
                                                pp:user.pp,

                                            });
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
});

router.get('/product/:id', (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {});

            Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
                if (!err) {
                    Listing.findById(req.params.id, (err, doc) => {
                        if (!err) {
                            Listing.find({ product: "shoes" }).distinct('productType', (err, type) => {
                                if (!err) {

                                    Listing.find({ product: "clothing" }).distinct('productType', (err, type1) => {
                                        if (!err) {
                                            Listing.find({ product: "other" }).distinct('productType', (err, type2) => {
                                                if (!err) {

                                                    res.render('shoe/item', {
                                                        viewTitle: "Update User",
                                                        user:user,
                                                        item: doc,
                                                        nav: type,
                                                        nav1: type1,
                                                        nav2: type2,
                                                        image: logo,
                                                        basket: cart.basketQty(),
                                                        pp:user.pp,

                                                    });
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

router.post('/add-to-cart/:id', (req, res) =>{

    

    var productId = req.params.id;

    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Listing.findById(productId,  (err, product) =>{
       
        cart.add(product, product.id,req.body.shoesize);
        req.session.cart = cart;
        
        res.redirect(req.get('referer'));
    });
});


module.exports = router