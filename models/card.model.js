const mongoose = require('mongoose')

var cardSchema = new mongoose.Schema({
    
    userID: {
        type: String,
        required: 'This field is required',  
    },

    name: {
        type: String,
        required: 'This field is required',  
    },

    accountNumber: {
        type: String,
        required: 'This field is required',  
    },
    cvs: {
        type: String,
        required: 'This field is required',  
    },

});


mongoose.model('Card',cardSchema);


