const mongoose = require('mongoose')

var nikeCustomisationSchema = new mongoose.Schema({

     frontandback: {
          type: String,
          required: 'This field is required'
     },

     nikeswoosh: {
          type: String,
          required: 'This field is required'
     },

     middlesection: {
          type: String,
          required: 'This field is required'
     },
     
     nikesole: {
          type: String,
          required: 'This field is required'
     },

     toeandheel: {
          type: String,
          required: 'This field is required'
     },


     niketounge: {
          type: String,
          required: 'This field is required'
     },

     nikelaces: {
        type: String,
        required: 'This field is required'
   },

     
     customname: {
          type: String,
          required: 'This field is required'
     },

     vanlikes: {
          type: Number,
     },


})

mongoose.model('NikeCustomisation', nikeCustomisationSchema);


