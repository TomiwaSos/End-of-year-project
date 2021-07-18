const mongoose = require('mongoose')

var reviewSchema = new mongoose.Schema({
    
    username: {
        type: String,
        required: 'This field is required',     
    },

    product: {
        type: String,
        required: 'This field is required'
    },


    rating: {
        type: Number,
        required: 'This field is required'
    },

    customerReview: {
        type: String,
        required: 'This field is required',
    },

    pp :{
        type: Buffer,

    },

  
});


mongoose.model('Review',reviewSchema);


