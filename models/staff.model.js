const mongoose = require('mongoose')

var staffSchema = new mongoose.Schema({
    
    username: {
        type: String,
        required: 'This field is required',
        unique: true
        
    },

    password: {
        type: String,
        required: 'This field is required'
    },

    email: {
        type: String,
        required: 'This field is required',
        unique: true
    },

    number: {
        type: Number,
        required: 'This field is required'
    },

    mainAddress: {
        type: String,
        required: 'This field is required'
    },

});


mongoose.model('Staff',staffSchema);


