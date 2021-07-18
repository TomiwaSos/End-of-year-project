const mongoose = require('mongoose')



var imageSchema = new mongoose.Schema({

    name: {
        type: String,
       
    },
    
    contentType: {
        type: String,
        required: 'This field is required',
    },

    fileName: {
        type: String,
        required: 'This field is required',
    },

    image: {
        type: Buffer,
        required: 'This field is required',
    },
})



mongoose.model("Image",imageSchema);
 