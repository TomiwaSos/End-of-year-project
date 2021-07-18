const mongoose = require('mongoose')


var discountSchema = new mongoose.Schema({

    name: {
        type: String,
        required: 'This field is required',
        
    },

    startdate: {
        type: Date,
        required: 'This field is required',
        
    },
    
    enddate: {
        type: Date,
        required: 'This field is required',
    },

    discount: {
        type: Number,
        required: 'This field is required',
    }, 

    option: {
        type: String,
        required: 'This field is required',
    },
});


mongoose.model('Discount',discountSchema);


