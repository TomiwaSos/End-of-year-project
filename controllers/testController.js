const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const customProfile = mongoose.model('CustomProfile');
const { diskStorage } = require('multer');
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const { Buffer } = require('buffer');
const { isBuffer } = require('util');
var Cart = require("../models/cart.model");




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
    customProfile.find( (err, doc) => {


    res.render('test/home', {
        custom:doc
    })
    })

});


router.get('/new', (req, res) => {

    res.render('test/customisation', {
    })
});

router.post('/new', (req, res) => {


    var parts = [];
    var x;
    var i;
    x = 0;
    for (i = 0; i < req.body.number; i++) {

        for (x = 0; x < req.body.colour; x++) {
            parts.push({ i, x });
        }

    }






    res.render('test/customisation1', {
        parts: parts,

    })
});

router.post('/create', upload.any("images",), (req, res, next) => {



    var parts = req.body.parts;
    var cl = req.body.cl;
    var files = req.files;

    var pl = []
    var images = []
    var x;
    var i;


    var customp = new customProfile();

    customp.name = req.body.name;
    for (let uploadedimage of files) {

        images.push(fs.readFileSync(uploadedimage.path, { encoding: "base64" }))
    }


    for (i = 0; i <= parts.length + 1; i++) {

        for (x = 0; x <= cl.length + 1; x++) {

            pl.push({ colour: cl.find(String), part: parts.find(String), image: images.find(String) })
            cl.shift();
            parts.shift();
            images.shift();

        }

    }


    customp.parts = pl;

    customp.save((err, doc) => {
        if (!err) {
            res.redirect('/test/custom/' + customp.id)
        } else {
            console.log('Error during inster: ' + err)
        }
    })



});

router.get('/custom/:id', (req, res) => {

    customProfile.find({ "_id": req.params.id }).distinct("parts.part", (err, parts) => {
        var parts = parts

        customProfile.find({ "_id": req.params.id }).distinct("parts.colour", (err, colour) => {
            var colours = colour

            customProfile.findById(req.params.id, (err, doc) => {

                var pages = []
                var pageb = []
                var info = doc.parts

                for (i = 0; i < parts.length + 1; i++) {
                    pages.push(pageb)

                    pageb = [null]
                    pageb.shift()


                    for (x = 0; x < colour.length; x++) {

                        pageb.push(info.find(String))
                        info.shift()

                    }

                }
                pages.shift()

                var basic = []

                var white = 0
                for (i = 0; i < parts.length; i++) {
                    basic.push([pages[i][white]])
                }

                res.render('test/custom', {
                    parts: parts,
                    colour: colours,
                    p: basic,
                    name: req.params.id,

                })
            })
        })
    })
});


router.post('/custom/:id', (req, res) => {

    customProfile.find({ "_id": req.params.id }).distinct("parts.part", (err, parts) => {
        var parts = parts

        customProfile.find({ "_id": req.params.id }).distinct("parts.colour", (err, colours) => {
            var colours = colours

            customProfile.findById(req.params.id, (err, doc) => {
                
                var partColour = req.body.basicc
                var partPart = req.body.basicp
                var pages = []
                var pageb = []
                var info = doc.parts



                for (i = 0; i < parts.length + 1; i++) {
                    pages.push(pageb)


                    pageb = [null]
                    pageb.shift()


                    for (x = 0; x < colours.length; x++) {

                        pageb.push(info.find(String))
                        info.shift()

                    }

                }
                pages.shift()

                var newPart = req.body.part
                var newColour = req.body.colour



                var newImage = []


                
                for (b = 0; b < parts.length; b++) {

                    for (c = 0; c < colours.length; c++) {

                        if (pages[b][c].part == newPart) {
                            if (pages[b][c].colour == newColour) {
                                newImage.push([pages[b][c]])

                            }


                        } else if (pages[b][c].part ==  partPart[b]) {
                            if(pages[b][c].colour == partColour[b]){
                                newImage.push([pages[b][c]])

                            }

                            
                        }
                       

                    }

                }

                console.log(newImage.length)



                res.render('test/custom', {
                    parts: parts,
                    colour: colours,
                    p: newImage,
                    name: req.params.id,
                })
            })
        })
    })

});


module.exports = router