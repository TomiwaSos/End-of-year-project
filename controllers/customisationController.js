const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const VanCustomisation = mongoose.model('VanCustomisation');
const NikeCustomisation = mongoose.model('NikeCustomisation');
const Image = mongoose.model('Image');
const User = mongoose.model('User');
var Cart = require("../models/cart.model");
const Listing = mongoose.model('Listing')

router.post('/vans/store', (req, res) => {
    Image.findOne({ "fileName": req.body.sole + ".png" }, (err, sole) => {
        Image.findOne({ "fileName": req.body.Middle + ".png" }, (err, middle) => {
            Image.findOne({ "fileName": req.body.FrontandBack + ".png" }, (err, frontandback) => {
                Image.findOne({ "fileName": req.body.Front + ".png" }, (err, front) => {
                    Image.findOne({ "fileName": req.body.Laces + ".png" }, (err, laces) => {
                        Image.findOne({ "fileName": req.body.Tounge + ".png" }, (err, tounge) => {
                            Image.findOne({ "fileName": req.body.Top + ".png" }, (err, top) => {
                                Image.findOne({ "fileName": req.body.Stripe + ".png" }, (err, stripe) => {
                                    User.findOne({ "_id": req.params.id }, (err, username) => {


                                       

                                            var vancustom = new VanCustomisation();
                                            vancustom.sole = sole.image;
                                            vancustom.middle = middle.image;
                                            vancustom.frontandback = frontandback.image;
                                            vancustom.front = front.image;
                                            vancustom.laces = laces.image;
                                            vancustom.tounge = tounge.image;
                                            vancustom.top = top.image;
                                            vancustom.stripe = stripe.image;
                                            vancustom.customname = req.body.customname;
                                            vancustom.pp = req.user.pp;
                                            vancustom.vanlikes = 0;
                                            vancustom.customimage = req.body.customimage;


                                            //save new custom to database
                                            vancustom.save((err, qwr) => {

                                                var listing = new Listing();

                                                listing.product = "Customisation";
                                                listing.productType = "Vans Customisation";
                                                listing.image = sole.image;
                                                listing.title = req.body.customname+"'s customisation" ;
                                                listing.description = "none";
                                                listing.catagory = vancustom.id ;
        
                                                listing.quantity = 10;
                                                listing.price = 150;
                                                listing.variations = "none";
                                                listing.shipping = "none";
        
                                                listing.save((err, doc) => {
        
        




                                                if (!err) {
                                                    res.redirect('/home/gallery/' + vancustom._id)
                                                } else {
                                                    console.log('Error during inster: ' + err)
                                                }
                                                
                                            });
                                            })
                                        

                                    });
                                })
                            })
                        })
                    })
                })
            })
        })
    })


});

router.post('/nike/store', (req, res) => {

    
    Image.findOne({ "fileName": req.body.FrontAndBack + ".png" }, (err, frontandback) => {
        Image.findOne({ "fileName": req.body.NikeSwoosh + ".png" }, (err, nikeswoosh) => {
            Image.findOne({ "fileName": req.body.MiddleSection + ".png" }, (err, middlesection) => {
                Image.findOne({ "fileName": req.body.NikeSole + ".png" }, (err, nikesole) => {
                    Image.findOne({ "fileName": req.body.ToeAndHeel + ".png" }, (err, toeandheel) => {
                        Image.findOne({ "fileName": req.body.NikeTounge + ".png" }, (err, niketounge) => {
                            Image.findOne({ "fileName": req.body.NikeLaces + ".png" }, (err, nikelaces) => {
                                User.findOne({ "_id": req.params.id }, (err, username) => {
                                    var nikecustom = new NikeCustomisation();
                                    nikecustom.frontandback = frontandback.image;
                                    nikecustom.nikeswoosh = nikeswoosh.image;
                                    nikecustom.middlesection = middlesection.image;
                                    nikecustom.nikesole = nikesole.image;
                                    nikecustom.toeandheel = toeandheel.image;
                                    nikecustom.niketounge = niketounge.image;
                                    nikecustom.nikelaces = nikelaces.image;
                                    nikecustom.customname = req.body.customname;
                                    nikecustom.nikelikes = 0;

                                    //save new custom to database
                                    nikecustom.save((err, doc) => {
                                        if (!err) {
                                            res.redirect('/home/gallery/')
                                        } else {
                                            console.log('Error during inster: ' + err)
                                        }
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
});

//create a new shoe 
function insertCustomisation(req, res) {
    var vancustom = new VanCustomisation();
    vancustom.sole = req.body.sole;
    vancustom.middle = req.body.Middle;
    vancustom.frontandback = req.body.FrontandBack;
    vancustom.front = req.body.Front;
    vancustom.laces = req.body.Laces;
    vancustom.tounge = req.body.Tounge;
    vancustom.top = req.body.Top;
    vancustom.stripe = req.body.Stripe;


    //save new user to database
    vancustom.save((err, doc) => {
        if (!err) {
            res.redirect('/home')
        } else {
            console.log('Error during inster: ' + err)
        }
    })
};


router.get('/vans', (req, res) => {

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
            var cart = new Cart(req.session.cart ? req.session.cart : {});

            // plain images 
            Image.findOne({ "fileName": "VansLogo.png" }, (err, VansLogo) => {
                if (!err) {
                    Image.findOne({ "fileName": "VansBackground.png" }, (err, VansBackground) => {
                        if (!err) {
                            Image.findOne({ "fileName": "VanSole.png" }, (err, VanSole) => {
                                if (!err) {
                                    Image.findOne({ "fileName": "VanMiddle.png" }, (err, VanMiddle) => {
                                        if (!err) {
                                            Image.findOne({ "fileName": "VanBackAndToe.png" }, (err, VanBackAndToe) => {
                                                if (!err) {
                                                    Image.findOne({ "fileName": "VanFront.png" }, (err, VanFront) => {
                                                        if (!err) {
                                                            Image.findOne({ "fileName": "VanLaces.png" }, (err, VanLaces) => {
                                                                if (!err) {
                                                                    Image.findOne({ "fileName": "VanTounge.png" }, (err, VanTounge) => {
                                                                        if (!err) {
                                                                            Image.findOne({ "fileName": "VanTop.png" }, (err, VanTop) => {
                                                                                if (!err) {
                                                                                    Image.findOne({ "fileName": "VanStripe.png" }, (err, VanStripe) => {
                                                                                        if (!err) {

                                                                                            // blue images 

                                                                                            Image.findOne({ "fileName": "VanStripeBlue.png" }, (err, VanStripeBlue) => {
                                                                                                if (!err) {
                                                                                                    Image.findOne({ "fileName": "VanMiddleBlue.png" }, (err, VanMiddleBlue) => {
                                                                                                        if (!err) {
                                                                                                            Image.findOne({ "fileName": "VanFrontBlue.png" }, (err, VanFrontBlue) => {
                                                                                                                if (!err) {
                                                                                                                    Image.findOne({ "fileName": "VanBackAndToeBlue.png" }, (err, VanBackAndToeBlue) => {
                                                                                                                        if (!err) {
                                                                                                                            Image.findOne({ "fileName": "VanSoleBlue.png" }, (err, VanSoleBlue) => {
                                                                                                                                if (!err) {
                                                                                                                                    Image.findOne({ "fileName": "VanLacesBlue.png" }, (err, VanLacesBlue) => {
                                                                                                                                        if (!err) {
                                                                                                                                            Image.findOne({ "fileName": "VanToungeBlue.png" }, (err, VanToungeBlue) => {
                                                                                                                                                if (!err) {
                                                                                                                                                    Image.findOne({ "fileName": "VanTopBlue.png" }, (err, VanTopBlue) => {
                                                                                                                                                        if (!err) {

                                                                                                                                                            // red images 

                                                                                                                                                            Image.findOne({ "fileName": "VanStripeRed.png" }, (err, VanStripeRed) => {
                                                                                                                                                                if (!err) {
                                                                                                                                                                    Image.findOne({ "fileName": "VanMiddleRed.png" }, (err, VanMiddleRed) => {
                                                                                                                                                                        if (!err) {
                                                                                                                                                                            Image.findOne({ "fileName": "VanFrontRed.png" }, (err, VanFrontRed) => {
                                                                                                                                                                                if (!err) {
                                                                                                                                                                                    Image.findOne({ "fileName": "VanBackAndToeRed.png" }, (err, VanBackAndToeRed) => {
                                                                                                                                                                                        if (!err) {
                                                                                                                                                                                            Image.findOne({ "fileName": "VanSoleRed.png" }, (err, VanSoleRed) => {
                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                    Image.findOne({ "fileName": "VanLacesRed.png" }, (err, VanLacesRed) => {
                                                                                                                                                                                                        if (!err) {
                                                                                                                                                                                                            Image.findOne({ "fileName": "VanToungeRed.png" }, (err, VanToungeRed) => {
                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                    Image.findOne({ "fileName": "VanTopRed.png" }, (err, VanTopRed) => {
                                                                                                                                                                                                                        if (!err) {

                                                                                                                                                                                                                            //green images

                                                                                                                                                                                                                            Image.findOne({ "fileName": "VanStripeGreen.png" }, (err, VanStripeGreen) => {
                                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                                    Image.findOne({ "fileName": "VanMiddleGreen.png" }, (err, VanMiddleGreen) => {
                                                                                                                                                                                                                                        if (!err) {
                                                                                                                                                                                                                                            Image.findOne({ "fileName": "VanFrontGreen.png" }, (err, VanFrontGreen) => {
                                                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                                                    Image.findOne({ "fileName": "VanBackAndToeGreen.png" }, (err, VanBackAndToeGreen) => {
                                                                                                                                                                                                                                                        if (!err) {
                                                                                                                                                                                                                                                            Image.findOne({ "fileName": "VanSoleGreen.png" }, (err, VanSoleGreen) => {
                                                                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                                                                    Image.findOne({ "fileName": "VanLacesGreen.png" }, (err, VanLacesGreen) => {
                                                                                                                                                                                                                                                                        if (!err) {
                                                                                                                                                                                                                                                                            Image.findOne({ "fileName": "VanToungeGreen.png" }, (err, VanToungeGreen) => {
                                                                                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                                                                                    Image.findOne({ "fileName": "VanTopGreen.png" }, (err, VanTopGreen) => {
                                                                                                                                                                                                                                                                                        if (!err) {

                                                                                                                                                                                                                                                                                            // black images 

                                                                                                                                                                                                                                                                                            Image.findOne({ "fileName": "VanStripeBlack.png" }, (err, VanStripeBlack) => {
                                                                                                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                                                                                                    Image.findOne({ "fileName": "VanMiddleBlack.png" }, (err, VanMiddleBlack) => {
                                                                                                                                                                                                                                                                                                        if (!err) {
                                                                                                                                                                                                                                                                                                            Image.findOne({ "fileName": "VanFrontBlack.png" }, (err, VanFrontBlack) => {
                                                                                                                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                                                                                                                    Image.findOne({ "fileName": "VanBackAndToeBlack.png" }, (err, VanBackAndToeBlack) => {
                                                                                                                                                                                                                                                                                                                        if (!err) {
                                                                                                                                                                                                                                                                                                                            Image.findOne({ "fileName": "VanSoleBlack.png" }, (err, VanSoleBlack) => {
                                                                                                                                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                                                                                                                                    Image.findOne({ "fileName": "VanLacesBlack.png" }, (err, VanLacesBlack) => {
                                                                                                                                                                                                                                                                                                                                        if (!err) {
                                                                                                                                                                                                                                                                                                                                            Image.findOne({ "fileName": "VanToungeBlack.png" }, (err, VanToungeBlack) => {
                                                                                                                                                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                                                                                                                                                    Image.findOne({ "fileName": "VanTopBlack.png" }, (err, VanTopBlack) => {
                                                                                                                                                                                                                                                                                                                                                        if (!err) {
                                                                                                                                                                                                                                                                                                                                                            res.render('customisation/Vans', {
                                                                                                                                                                                                                                                                                                                                                                pp:user.pp,
                                                                                                                                                                                                                                                                                                                                                                user: user,
                                                                                                                                                                                                                                                                                                                                                                image: logo,
                                                                                                                                                                                                                                                                                                                                                                VansLogo: VansLogo,
                                                                                                                                                                                                                                                                                                                                                                VansBackground: VansBackground,
                                                                                                                                                                                                                                                                                                                                                                VanSole: VanSole,
                                                                                                                                                                                                                                                                                                                                                                VanMiddle: VanMiddle,
                                                                                                                                                                                                                                                                                                                                                                VanBackAndToe: VanBackAndToe,
                                                                                                                                                                                                                                                                                                                                                                VanFront: VanFront,
                                                                                                                                                                                                                                                                                                                                                                VanLaces: VanLaces,
                                                                                                                                                                                                                                                                                                                                                                VanTounge: VanTounge,
                                                                                                                                                                                                                                                                                                                                                                VanTop: VanTop,
                                                                                                                                                                                                                                                                                                                                                                VanStripe: VanStripe,
                                                                                                                                                                                                                                                                                                                                                                VanStripeBlue: VanStripeBlue,
                                                                                                                                                                                                                                                                                                                                                                VanMiddleBlue: VanMiddleBlue,
                                                                                                                                                                                                                                                                                                                                                                VanFrontBlue: VanFrontBlue,
                                                                                                                                                                                                                                                                                                                                                                VanBackAndToeBlue: VanBackAndToeBlue,
                                                                                                                                                                                                                                                                                                                                                                VanSoleBlue: VanSoleBlue,
                                                                                                                                                                                                                                                                                                                                                                VanLacesBlue: VanLacesBlue,
                                                                                                                                                                                                                                                                                                                                                                VanToungeBlue: VanToungeBlue,
                                                                                                                                                                                                                                                                                                                                                                VanTopBlue: VanTopBlue,
                                                                                                                                                                                                                                                                                                                                                                VanStripeRed: VanStripeRed,
                                                                                                                                                                                                                                                                                                                                                                VanMiddleRed: VanMiddleRed,
                                                                                                                                                                                                                                                                                                                                                                VanFrontRed: VanFrontRed,
                                                                                                                                                                                                                                                                                                                                                                VanBackAndToeRed: VanBackAndToeRed,
                                                                                                                                                                                                                                                                                                                                                                VanSoleRed: VanSoleRed,
                                                                                                                                                                                                                                                                                                                                                                VanLacesRed: VanLacesRed,
                                                                                                                                                                                                                                                                                                                                                                VanToungeRed: VanToungeRed,
                                                                                                                                                                                                                                                                                                                                                                VanTopRed: VanTopRed,
                                                                                                                                                                                                                                                                                                                                                                VanStripeGreen: VanStripeGreen,
                                                                                                                                                                                                                                                                                                                                                                VanMiddleGreen: VanMiddleGreen,
                                                                                                                                                                                                                                                                                                                                                                VanFrontGreen: VanFrontGreen,
                                                                                                                                                                                                                                                                                                                                                                VanBackAndToeGreen: VanBackAndToeGreen,
                                                                                                                                                                                                                                                                                                                                                                VanSoleGreen: VanSoleGreen,
                                                                                                                                                                                                                                                                                                                                                                VanLacesGreen: VanLacesGreen,
                                                                                                                                                                                                                                                                                                                                                                VanToungeGreen: VanToungeGreen,
                                                                                                                                                                                                                                                                                                                                                                VanTopGreen: VanTopGreen,
                                                                                                                                                                                                                                                                                                                                                                VanStripeBlack: VanStripeBlack,
                                                                                                                                                                                                                                                                                                                                                                VanMiddleBlack: VanMiddleBlack,
                                                                                                                                                                                                                                                                                                                                                                VanFrontBlack: VanFrontBlack,
                                                                                                                                                                                                                                                                                                                                                                VanBackAndToeBlack: VanBackAndToeBlack,
                                                                                                                                                                                                                                                                                                                                                                VanSoleBlack: VanSoleBlack,
                                                                                                                                                                                                                                                                                                                                                                VanLacesBlack: VanLacesBlack,
                                                                                                                                                                                                                                                                                                                                                                VanToungeBlack: VanToungeBlack,
                                                                                                                                                                                                                                                                                                                                                                VanTopBlack: VanTopBlack,
                                                                                                                                                                                                                                                                                                                                                                id: "1",
                                                                                                                                                                                                                                                                                                                                                                basket: cart.basketQty(),
                                                                                                                                                                                                                                                                                                                                                                nav: shoes,
                                                                                                                                                                                                                                                                                                                                                                nav1: clothing,
                                                                                                                                                                                                                                                                                                                                                                nav2: special,
                                                                                                                                                                                                                                                                                                                                                                image: logo,

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
}
})

})

router.get('/airforce1', (req, res) => {

    if (req.user == undefined) {
        var user = { found: false }
    } else {
        var user = { found: true, user: req.user.username, id: req.user.id , pp:req.user.pp}
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    // plain images 

    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                if (!err) {

            Image.findOne({ "fileName": "customisebackground.png" }, (err, customisebackground) => {
                if (!err) {
                    Image.findOne({ "fileName": "podium.png" }, (err, podium) => {
                        if (!err) {
                            Image.findOne({ "fileName": "NShoeOutline.png" }, (err, NShoeOutline) => {
                                if (!err) {
                                    Image.findOne({ "fileName": "NFrontandBack.png" }, (err, NFrontandBack) => {
                                        if (!err) {
                                            Image.findOne({ "fileName": "NLaces.png" }, (err, NLaces) => {
                                                if (!err) {
                                                    Image.findOne({ "fileName": "NMiddleSection.png" }, (err, NMiddleSection) => {
                                                        if (!err) {
                                                            Image.findOne({ "fileName": "NShoeTounge.png" }, (err, NShoeTounge) => {
                                                                if (!err) {
                                                                    Image.findOne({ "fileName": "NSole.png" }, (err, NSole) => {
                                                                        if (!err) {
                                                                            Image.findOne({ "fileName": "NToeandHeel.png" }, (err, NToeandHeel) => {
                                                                                if (!err) {
                                                                                    Image.findOne({ "fileName": "Swoosh.png" }, (err, Swoosh) => {
                                                                                        if (!err) {

                                                                                            //blue image 

                                                                                            Image.findOne({ "fileName": "NFrontandBackBlue.png" }, (err, NFrontandBackBlue) => {
                                                                                                if (!err) {
                                                                                                    Image.findOne({ "fileName": "swooshblue.png" }, (err, swooshblue) => {
                                                                                                        if (!err) {
                                                                                                            Image.findOne({ "fileName": "NMiddleSectionBlue.png" }, (err, NMiddleSectionBlue) => {
                                                                                                                if (!err) {
                                                                                                                    Image.findOne({ "fileName": "NSoleBlue.png" }, (err, NSoleBlue) => {
                                                                                                                        if (!err) {
                                                                                                                            Image.findOne({ "fileName": "NToeandHeelBlue.png" }, (err, NToeandHeelBlue) => {
                                                                                                                                if (!err) {
                                                                                                                                    Image.findOne({ "fileName": "NShoeToungeBlue.png" }, (err, NShoeToungeBlue) => {
                                                                                                                                        if (!err) {

                                                                                                                                            //red imges 

                                                                                                                                            Image.findOne({ "fileName": "NFrontandBackRed.png" }, (err, NFrontandBackRed) => {
                                                                                                                                                if (!err) {
                                                                                                                                                    Image.findOne({ "fileName": "swooshred.png" }, (err, swooshred) => {
                                                                                                                                                        if (!err) {
                                                                                                                                                            Image.findOne({ "fileName": "NMiddleSectionRed.png" }, (err, NMiddleSectionRed) => {
                                                                                                                                                                if (!err) {
                                                                                                                                                                    Image.findOne({ "fileName": "NSoleRed.png" }, (err, NSoleRed) => {
                                                                                                                                                                        if (!err) {
                                                                                                                                                                            Image.findOne({ "fileName": "NToeandHeelRed.png" }, (err, NToeandHeelRed) => {
                                                                                                                                                                                if (!err) {
                                                                                                                                                                                    Image.findOne({ "fileName": "NShoeToungeRed.png" }, (err, NShoeToungeRed) => {
                                                                                                                                                                                        if (!err) {

                                                                                                                                                                                            // green images

                                                                                                                                                                                            Image.findOne({ "fileName": "NFrontandBackGreen.png" }, (err, NFrontandBackGreen) => {
                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                    Image.findOne({ "fileName": "swooshgreen.png" }, (err, swooshgreen) => {
                                                                                                                                                                                                        if (!err) {
                                                                                                                                                                                                            Image.findOne({ "fileName": "NMiddleSectionGreen.png" }, (err, NMiddleSectionGreen) => {
                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                    Image.findOne({ "fileName": "NSoleGreen.png" }, (err, NSoleGreen) => {
                                                                                                                                                                                                                        if (!err) {
                                                                                                                                                                                                                            Image.findOne({ "fileName": "NToeandHeelGreen.png" }, (err, NToeandHeelGreen) => {
                                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                                    Image.findOne({ "fileName": "NShoeToungeGreen.png" }, (err, NShoeToungeGreen) => {
                                                                                                                                                                                                                                        if (!err) {

                                                                                                                                                                                                                                            //black images 
                                                                                                                                                                                                                                            Image.findOne({ "fileName": "NFrontandBackBlack.png" }, (err, NFrontandBackBlack) => {
                                                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                                                    Image.findOne({ "fileName": "swooshblack.png" }, (err, swooshblack) => {
                                                                                                                                                                                                                                                        if (!err) {
                                                                                                                                                                                                                                                            Image.findOne({ "fileName": "NMiddleSectionBlack.png" }, (err, NMiddleSectionBlack) => {
                                                                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                                                                    Image.findOne({ "fileName": "NSoleBlack.png" }, (err, NSoleBlack) => {
                                                                                                                                                                                                                                                                        if (!err) {
                                                                                                                                                                                                                                                                            Image.findOne({ "fileName": "NToeandHeelBlack.png" }, (err, NToeandHeelBlack) => {
                                                                                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                                                                                    Image.findOne({ "fileName": "NShoeToungeBlack.png" }, (err, NShoeToungeBlack) => {
                                                                                                                                                                                                                                                                                        if (!err) {

                                                                                                                                                                                                                                                                                            //special images 

                                                                                                                                                                                                                                                                                            Image.findOne({ "fileName": "NFrontandBackGreyCamo.png" }, (err, NFrontandBackGreyCamo) => {
                                                                                                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                                                                                                    Image.findOne({ "fileName": "NFrontandBackRedCamo.png" }, (err, NFrontandBackRedCamo) => {
                                                                                                                                                                                                                                                                                                        if (!err) {
                                                                                                                                                                                                                                                                                                            Image.findOne({ "fileName": "swooshredcamo.png" }, (err, swooshredcamo) => {
                                                                                                                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                                                                                                                    Image.findOne({ "fileName": "swooshgreycamo.png" }, (err, swooshgreycamo) => {
                                                                                                                                                                                                                                                                                                                        if (!err) {
                                                                                                                                                                                                                                                                                                                            Image.findOne({ "fileName": "NMiddleSectionRedCamo.png" }, (err, NMiddleSectionRedCamo) => {
                                                                                                                                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                                                                                                                                    Image.findOne({ "fileName": "NMiddleSectionGreyCamo.png" }, (err, NMiddleSectionGreyCamo) => {
                                                                                                                                                                                                                                                                                                                                        if (!err) {
                                                                                                                                                                                                                                                                                                                                            Image.findOne({ "fileName": "NToeandHeelRedCamo.png" }, (err, NToeandHeelRedCamo) => {
                                                                                                                                                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                                                                                                                                                    Image.findOne({ "fileName": "NToeandHeelGreyCamo.png" }, (err, NToeandHeelGreyCamo) => {
                                                                                                                                                                                                                                                                                                                                                        if (!err) {
                                                                                                                                                                                                                                                                                                                                                            Image.findOne({ "fileName": "NShoeToungeRedCamo.png" }, (err, NShoeToungeRedCamo) => {
                                                                                                                                                                                                                                                                                                                                                                if (!err) {
                                                                                                                                                                                                                                                                                                                                                                    Image.findOne({ "fileName": "NShoeToungeGreyCamo.png" }, (err, NShoeToungeGreyCamo) => {
                                                                                                                                                                                                                                                                                                                                                                        if (!err) {


                                                                                                                                                                                                                                                                                                                                                                            res.render('customisation/airforce1', {
                                                                                                                                                                                                                                                                                                                                                                                pp:user.pp,
                                                                                                                                                                                                                                                                                                                                                                                user: user,
                                                                                                                                                                                                                                                                                                                                                                                image: logo,
                                                                                                                                                                                                                                                                                                                                                                                customisebackground: customisebackground,
                                                                                                                                                                                                                                                                                                                                                                                podium: podium,
                                                                                                                                                                                                                                                                                                                                                                                NShoeOutline: NShoeOutline,
                                                                                                                                                                                                                                                                                                                                                                                NFrontandBack: NFrontandBack,
                                                                                                                                                                                                                                                                                                                                                                                NLaces: NLaces,
                                                                                                                                                                                                                                                                                                                                                                                NMiddleSection: NMiddleSection,
                                                                                                                                                                                                                                                                                                                                                                                NShoeTounge: NShoeTounge,
                                                                                                                                                                                                                                                                                                                                                                                NSole: NSole,
                                                                                                                                                                                                                                                                                                                                                                                NToeandHeel: NToeandHeel,
                                                                                                                                                                                                                                                                                                                                                                                Swoosh: Swoosh,
                                                                                                                                                                                                                                                                                                                                                                                NFrontandBackBlue: NFrontandBackBlue,
                                                                                                                                                                                                                                                                                                                                                                                swooshblue: swooshblue,
                                                                                                                                                                                                                                                                                                                                                                                NMiddleSectionBlue: NMiddleSectionBlue,
                                                                                                                                                                                                                                                                                                                                                                                NSoleBlue: NSoleBlue,
                                                                                                                                                                                                                                                                                                                                                                                NToeandHeelBlue: NToeandHeelBlue,
                                                                                                                                                                                                                                                                                                                                                                                NShoeToungeBlue: NShoeToungeBlue,
                                                                                                                                                                                                                                                                                                                                                                                NFrontandBackRed: NFrontandBackRed,
                                                                                                                                                                                                                                                                                                                                                                                swooshred: swooshred,
                                                                                                                                                                                                                                                                                                                                                                                NMiddleSectionRed: NMiddleSectionRed,
                                                                                                                                                                                                                                                                                                                                                                                NSoleRed: NSoleRed,
                                                                                                                                                                                                                                                                                                                                                                                NToeandHeelRed: NToeandHeelRed,
                                                                                                                                                                                                                                                                                                                                                                                NShoeToungeRed: NShoeToungeRed,
                                                                                                                                                                                                                                                                                                                                                                                NFrontandBackGreen: NFrontandBackGreen,
                                                                                                                                                                                                                                                                                                                                                                                swooshgreen: swooshgreen,
                                                                                                                                                                                                                                                                                                                                                                                NMiddleSectionGreen: NMiddleSectionGreen,
                                                                                                                                                                                                                                                                                                                                                                                NSoleGreen: NSoleGreen,
                                                                                                                                                                                                                                                                                                                                                                                NToeandHeelGreen: NToeandHeelGreen,
                                                                                                                                                                                                                                                                                                                                                                                NShoeToungeGreen: NShoeToungeGreen,
                                                                                                                                                                                                                                                                                                                                                                                NFrontandBackBlack: NFrontandBackBlack,
                                                                                                                                                                                                                                                                                                                                                                                swooshblack: swooshblack,
                                                                                                                                                                                                                                                                                                                                                                                NMiddleSectionBlack: NMiddleSectionBlack,
                                                                                                                                                                                                                                                                                                                                                                                NSoleBlack: NSoleBlack,
                                                                                                                                                                                                                                                                                                                                                                                NToeandHeelBlack: NToeandHeelBlack,
                                                                                                                                                                                                                                                                                                                                                                                NShoeToungeBlack: NShoeToungeBlack,
                                                                                                                                                                                                                                                                                                                                                                                NFrontandBackGreyCamo: NFrontandBackGreyCamo,
                                                                                                                                                                                                                                                                                                                                                                                NFrontandBackRedCamo: NFrontandBackRedCamo,
                                                                                                                                                                                                                                                                                                                                                                                swooshredcamo: swooshredcamo,
                                                                                                                                                                                                                                                                                                                                                                                swooshgreycamo: swooshgreycamo,
                                                                                                                                                                                                                                                                                                                                                                                NMiddleSectionRedCamo: NMiddleSectionRedCamo,
                                                                                                                                                                                                                                                                                                                                                                                NMiddleSectionGreyCamo: NMiddleSectionGreyCamo,
                                                                                                                                                                                                                                                                                                                                                                                NToeandHeelRedCamo: NToeandHeelRedCamo,
                                                                                                                                                                                                                                                                                                                                                                                NToeandHeelGreyCamo: NToeandHeelGreyCamo,
                                                                                                                                                                                                                                                                                                                                                                                NShoeToungeRedCamo: NShoeToungeRedCamo,
                                                                                                                                                                                                                                                                                                                                                                                NShoeToungeGreyCamo: NShoeToungeGreyCamo,
                                                                                                                                                                                                                                                                                                                                                                                id: "2",
                                                                                                                                                                                                                                                                                                                                                                                basket: cart.basketQty(),
                                                                                                                                                                                                                                                                                                                                                                                nav: shoes,
                                                                                                                                                                                                                                                                                                                                                                                nav1: clothing,
                                                                                                                                                                                                                                                                                                                                                                                nav2: special,
                                                                                                                                                                                                                                                                                                                                                                                image: logo,


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
}
})
}
})
}
})

})

router.get('/clothing', (req, res) => {

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

            var cart = new Cart(req.session.cart ? req.session.cart : {});

            // tshirt color images

            Image.findOne({ "fileName": "tshirtcustom.png" }, (err, TshirtCustom) => {
                if (!err) {
                    Image.findOne({ "fileName": "tshirtcustomblack.png" }, (err, TshirtCustomBlack) => {
                        if (!err) {
                            Image.findOne({ "fileName": "tshirtcustomred.png" }, (err, TshirtCustomRed) => {
                                if (!err) {
                                    Image.findOne({ "fileName": "tshirtcustomgreen.png" }, (err, TshirtCustomGreen) => {
                                        if (!err) {
                                            Image.findOne({ "fileName": "tshirtcustomblue.png" }, (err, TshirtCustomBlue) => {
                                                if (!err) {

                                                    //album covers 

                                                    Image.findOne({ "fileName": "DarkTwistedFantasyFront.png" }, (err, DarkTwistedFantasyFront) => {
                                                        if (!err) {
                                                            Image.findOne({ "fileName": "DarkTwistedFantasyBack.png" }, (err, DarkTwistedFantasyBack) => {
                                                                if (!err) {
                                                                    Image.findOne({ "fileName": "LilUziFront.png" }, (err, LilUziFront) => {
                                                                        if (!err) {
                                                                            Image.findOne({ "fileName": "LilUziBack.png" }, (err, LilUziBack) => {
                                                                                if (!err) {
                                                                                    Image.findOne({ "fileName": "LongLiveAsapFront.png" }, (err, LongLiveAsapFront) => {
                                                                                        if (!err) {
                                                                                            Image.findOne({ "fileName": "LongLiveAsapBack.png" }, (err, LongLiveAsapBack) => {
                                                                                                if (!err) {
                                                                                                    Image.findOne({ "fileName": "Section80Front.png" }, (err, Section80Front) => {
                                                                                                        if (!err) {
                                                                                                            Image.findOne({ "fileName": "Section80Back.png" }, (err, Section80Back) => {
                                                                                                                if (!err) {
                                                                                                                    Image.findOne({ "fileName": "ManOnTheMoonFront.png" }, (err, ManOnTheMoonFront) => {
                                                                                                                        if (!err) {
                                                                                                                            Image.findOne({ "fileName": "ManOnTheMoonBack.png" }, (err, ManOnTheMoonBack) => {
                                                                                                                                if (!err) {
                                                                                                                                    res.render('customisation/clothing', {
                                                                                                                                        pp:user.pp,
                                                                                                                                        user: user,
                                                                                                                                        image: logo,
                                                                                                                                        TshirtCustom: TshirtCustom,
                                                                                                                                        TshirtCustomBlack: TshirtCustomBlack,
                                                                                                                                        TshirtCustomRed: TshirtCustomRed,
                                                                                                                                        TshirtCustomGreen: TshirtCustomGreen,
                                                                                                                                        TshirtCustomBlue: TshirtCustomBlue,
                                                                                                                                        DarkTwistedFantasyFront: DarkTwistedFantasyFront,
                                                                                                                                        DarkTwistedFantasyBack: DarkTwistedFantasyBack,
                                                                                                                                        LilUziFront: LilUziFront,
                                                                                                                                        LilUziBack: LilUziBack,
                                                                                                                                        LongLiveAsapFront: LongLiveAsapFront,
                                                                                                                                        LongLiveAsapBack: LongLiveAsapBack,
                                                                                                                                        Section80Front: Section80Front,
                                                                                                                                        Section80Back: Section80Back,
                                                                                                                                        ManOnTheMoonFront: ManOnTheMoonFront,
                                                                                                                                        ManOnTheMoonBack: ManOnTheMoonBack,
                                                                                                                                        basket: cart.basketQty(),
                                                                                                                                        nav: shoes,
                                                                                                                                        nav1: clothing,
                                                                                                                                        nav2: special,
                                                                                                                                        image: logo,


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
