const mongoose = require('mongoose')

var listingSchema = new mongoose.Schema({

    product: {
        type: String,
        required: 'This field is required'
        
    },

    productType: {
        type: String,
        required: 'This field is required'
        
    },
    
    image: {
        type: [Buffer],
        required: 'This field is required',
    },

    title: {
        type: String,
        required: 'This field is required',
       
    },

    description: {
        type: String,
        required: 'This field is required',
       
        
    },

    catagory: {
        type: String,
        required: 'This field is required',
    },

    price: {
        type: Number,
        required: 'This field is required',
    },

    quantity: {
        type: String,
        required: 'This field is required',
    },

    variations: {
        type: String,
        required: 'This field is required',
    },

    shipping: {
        type: String,
        required: 'This field is required',
    },

});


mongoose.model('Listing',listingSchema);


