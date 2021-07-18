const mongoose = require('mongoose')

var messageRoomSchema = new mongoose.Schema({
    
    user: {
        type: String,
        required: 'This field is required',  
    },

    title: {
        type: String,
        required: 'This field is required',  
    },

   messages: {
        type: [{user : String,txt : String}],
        required: 'This field is required'
    },

    active: {
        type: Boolean,
        required: 'This field is required'
    },

});



mongoose.model('MessageRoom',messageRoomSchema);


