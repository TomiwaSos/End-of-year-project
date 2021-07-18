const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const express = require('express')
var router = express()
const mongoose = require('mongoose')
const Staff = mongoose.model('Staff')
const Listing = mongoose.model('Listing')
const Review = mongoose.model('Review');
const Discount = mongoose.model('Discount');
const Order = mongoose.model('Order');
const User=  mongoose.model('User');
const Image = mongoose.model('Image');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { create } = require('express-handlebars');
const SALT_WORK_FACTOR = 10;
var exphbs = require('express-handlebars');
const { diskStorage } = require('multer');
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const { each } = require('jquery')
const { emit } = require('process')
const MessageRoom = mongoose.model('MessageRoom');


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

router.get('/', (req, res) => {
    res.render('staff/login', {
        layout: 'Stafflayout',
        viewTitle: 'staff password'

    })

})


//Staff login
router.post('/', (req, res) => {

    console.log(req.body.password)


    if (req.body.password == "123"){
        res.render('staff/dashboard', {
            layout: 'Stafflayout',
            
        })
    }else {

        res.render("user/login")
    }
});

router.get('/statistics', function(req, res) {
    Review.find({}).countDocuments((err, result) => {
        if (err){
            console.log("Error In Retrieval " + id, err);
            res.send({
                "code" : 400,
                "failed" : "error occured"
            });
        } else {
    res.render('staff/statistics', {
        layout: 'Stafflayout',
        reviewFind: result,
    })
}
    })
})

router.get('/dashboard/', function(req, res) {
    Order.find({}).countDocuments((err, result) => {
        Listing.find({}).countDocuments((err, result1) => {
            Discount.find({}).countDocuments((err, result2) => {
                  User.find({}).countDocuments((err, result3) => {
        if (err){
            console.log("Error In Retrieval " + id, err);
            res.send({
                "code" : 400,
                "failed" : "error occured"
            });
        } else {
            res.render('staff/dashboard', {
                orderFind: result,
                listingFind: result1,
                discountFind: result2,
                userFind: result3,
                layout: 'Stafflayout',
                viewTitle: 'Dashboard',
            })

        }
        console.log("This is the result " + result);
    })
})
        })
    })

})
    
router.get('/login', (req, res) => {
    res.render('staff/login', {
        layout: 'Stafflayout',

    })

})

router.get('/messages', (req, res) => {
    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                if (!err) {
                                    MessageRoom.find( (err, chatroom) => {
                                        if (!err) {

                                            res.render('staff/messages', {
                                                layout: 'Stafflayout',
                                                nav: shoes,
                                                nav1: clothing,
                                                nav2: special,
                                                image: logo,
                                                room: chatroom,

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

})


router.get('/messages/:id', (req, res) => {

    MessageRoom.findByIdAndUpdate(req.params.id, { new: true }, (err, chat) => {

        Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
            if (!err) {
                Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                    if (!err) {
                        Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                            if (!err) {
                                Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                    if (!err) {
                                        MessageRoom.find( (err, chatroom) => {
                                            if (!err) {
                                                res.render('staff/messages', {
                                                    layout: 'StaffLayout',
                                                    nav: shoes,
                                                    nav1: clothing,
                                                    nav2: special,
                                                    image: logo,
                                                    room: chatroom,
                                                    chat: chat,

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
    })
});

router.post('/messages/:id', (req, res) => {


    Image.findOne({ "fileName": "logo.png" }, (err, logo) => {
        if (!err) {
            Listing.find({ product: "shoes" }).distinct('productType', (err, shoes) => {
                if (!err) {
                    Listing.find({ product: "clothing" }).distinct('productType', (err, clothing) => {
                        if (!err) {
                            Listing.find({ product: "other" }).distinct('productType', (err, special) => {
                                if (!err) {
                                    MessageRoom.find( (err, chatroom) => {
                                        if (!err) {

                                            MessageRoom.findOneAndUpdate({"_id" :req.params.id}, {$push:{ "messages": [{user:"Staff" ,txt:req.body.text}]}},{new:true}, (err, chat) => {

                                                res.render('staff/messages', {
                                                    layout: 'StaffLayout',
                                                    nav: shoes,
                                                    nav1: clothing,
                                                    nav2: special,
                                                    image: logo,
                                                    room: chatroom,
                                                    chat: chat,

                                                })
                                            } )
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

router.get('/finance', (req, res) => {
    res.render('staff/finance', {
        layout: 'Stafflayout',

    })

})

router.get('/marketing', (req, res) => {
    res.render('staff/marketing', {
        layout: 'Stafflayout',

    })

})

router.get('/statistics', (req, res) => {
    res.render('staff/statistics', {
        layout: 'Stafflayout',

    })

})


function insertRecord(req, res) {
    var staff = new Staff();
    staff.username = req.body.username;
    staff.password = req.body.password;
    staff.email = req.body.email;
    staff.number = req.body.number;
    staff.mainAddress = req.body.mainAddress;
    staff.secoundaryAddress = req.body.secoundaryAddress;

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) throw err;
        bcrypt.hash(staff.password, salt, function (err, hash) {

            staff.password = hash;

            staff.save((err, doc) => {
                if (!err) {
                    res.redirect('/staff/list');
                } else {
                    console.log('Error during inster: ' + err)
                }
            })
        })

    })
}

function updateRecord(req, res) {
    Staff.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true },
        (err, doc) => {
            if (!err) {
                res.redirect("/staff/list");
            } else {
                console.log('Error during update: ' + err)
            }
        }
    );
}

function updateListing(req, res) {
    Listing.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true },
        (err, doc) => {
            if (!err) {
                res.redirect('/staff/listingManager');
            } else {
                console.log('Error during update: ' + err)
            }
        }
    );
}

router.get('/listing', (req, res) => {
    res.render('staff/listing', {
        layout: 'Stafflayout',
        viewTitle: 'create a listing'
    })
})


router.post('/listing', upload.single("images"), (req, res) => {
   


    var pics = [] 
    const files = req.files;

    console.log(req.files)
    if(req.files == undefined){

    }else{

    for (let uploadedimage of files) {
        pics.push(fs.readFileSync(uploadedimage.path, { encoding: "base64" }));
    }
}
if (req.body._id == '') {

    var listing = new Listing();
    listing.product = req.body.product;
    listing.productType = req.body.productType;
    listing.image = pics;
    listing.title = req.body.title;
    listing.description = req.body.description;
    listing.catagory = req.body.catagory;
    listing.price = req.body.price;
    listing.quantity = req.body.quantity;
    listing.variations = req.body.variations;
    listing.shipping = req.body.shipping;
    listing.save((err, doc) => {
        if (!err) {
            console.log(listing);
            res.redirect('/staff/listingmanager')
        } else {
            console.log('Error during inster: ' + err)
        }
    })
} else {
    updateListing(req, res)
}

});

router.get('/listingManager', (req, res) => {
    Listing.find((err, listings) => {
        if (!err) {
            res.render('staff/listingManager', {
                layout: 'Stafflayout',
                item: listings,
                viewTitle: 'create a listing'
            })
        } else {
            console.log('Error in retrival: ' + err)
        }
    })
})

router.get('/listing/:id', (req, res) => {
    Listing.findById(req.params.id, (err, data) => {
        if (!err) {
            res.render('staff/listing', {
                layout: 'Stafflayout',
                viewTitle: "Update Staff",
                listing: data,
            });

        }
    });
});

router.get("/listing/delete/:id", (req, res) => {
    Listing.findByIdAndRemove(req.params.id, (err, listing) => {
        Listing.find((err, listing) => {
            if (!err) {
                res.render('staff/listingManager', {
                    layout: 'Stafflayout',
                    item: listing
                })
            } else {
                console.log('Error in retrival: ' + err)
            }
        })
    });
});


router.get('/imageuploader', (req, res) => {
    res.render('staff/imageUploader', {
        layout: 'Stafflayout',
        viewTitle: 'Image Uploader'
    })
});

router.get('/orderlist', (req, res) => {
    Order.find({},(err, doc) => {
        if (!err) {
            res.render('staff/orderlist', {
                list: doc,
                layout: "stafflayout",
            })
        }

    })
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        layout: 'Stafflayout',
        successRedirect: '/staff/list',
        failureRedirect: '/staff/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/:id', (req, res) => {
    Staff.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render('staff/list', {
                layout: 'Stafflayout',
                viewTitle: "Update Staff",
                staff: doc,
            });
            console.log(doc);
        }
    });
});

router.get("/delete/:id", (req, res) => {
    Staff.findByIdAndRemove(req.params.id, (err, doc) => {
        Staff.find((err, sdocs) => {
            if (!err) {
                res.render('staff/list', {
                    layout: 'Stafflayout',
                    list: sdocs
                })
            } else {
                console.log('Error in retrival: ' + err)
            }
        })
    });
});

router.post('/order', (req, res) => {
    createOrder(req, res);
});

function createOrder(req, res) {
    var order = new Order();
    order.username = req.body.username;
    order.listing = req.body.listing;
    order.quantity = req.body.quantity;
    order.price = req.body.price;
    order.address = req.body.adress;

    console.log(order.username);

    order.save((err, doc) => {
        if (!err) {
            res.render("home/page")
        } else {
            console.log('Error during inster: ' + err)
        }
    })

}

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
            res.render("staff/marketing"), {
                layout: 'Stafflayout',
            }
        } else {
            console.log('Error duting Inster: ' + err)
        }
    })
};

router.post("/images", upload.array("images", 12), (req, res, next) => {

    const files = req.files
    for (let uploadedimage of files) {

        var image = new Image();


        image.contentType = uploadedimage.mimetype,
        image.fileName = uploadedimage.originalname,
        image.image = fs.readFileSync(uploadedimage.path, { encoding: "base64" });

        image.save((err, doc) => {

            Image.find((err, pics) => {
                if (!err) {
                    res.render('staff/imageUploader', {
                        layout: 'Stafflayout',
                        image: pics
                    })
                } else {
                    console.log('Error in retrival: ' + err)
                }
            })

        })

    }


});



module.exports = router