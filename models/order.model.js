const mongoose = require('mongoose')

var orderSchema = new mongoose.Schema({
    
    fname: {
        type: String,
        required: 'This field is required',  
    },

    sname: {
        type: String,
        required: 'This field is required',  
    },

    email: {
        type: String,
        required: 'This field is required',  
    },

    address: {
        type: String,
        required: 'This field is required',  
    },

    postcode: {
        type: String,
        required: 'This field is required',  
    },

    discountcode: {
        type: String,
    },

    discount: {
        type:Number,
    },

    cart: {
        type: [{item:String, qty:Number, price:Number ,size:String}],
        required: 'This field is required'
    },

    totalPrice: {
        type: Number,
        required: 'This field is required',
    },

    cfname: {
        type: String,
        required: 'This field is required'
    },

    accountnumber: {
        type: Number,
        required: 'This field is required',
    },
    cvs: {
        type: Number,
        required: 'This field is required',
    },

    specialRequest: {
        type: String,
    },

    date: {
        type: Date,
    }

});


mongoose.model('Order',orderSchema);


