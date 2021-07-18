const mongoose = require('mongoose')

var customProfileSchema = new mongoose.Schema({

    name: {
        type: String,
        required: 'This field is required'
    },

    parts:{
        type:[{part:String,colour:String, image:Buffer}],
        required:'This field is required'

    }
   


    

})

mongoose.model('CustomProfile',customProfileSchema);


