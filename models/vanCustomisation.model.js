const mongoose = require('mongoose')

var vanCustomisationSchema = new mongoose.Schema({

     sole: {
          type: String,
          required: 'This field is required'
     },

     middle: {
          type: String,
          required: 'This field is required'
     },

     frontandback: {
          type: String,
          required: 'This field is required'
     },

     front: {
          type: String,
          required: 'This field is required'
     },

     laces: {
          type: String,
          required: 'This field is required'
     },

     tounge: {
          type: String,
          required: 'This field is required'
     },

     top: {
          type: String,
          required: 'This field is required'
     },

     stripe: {
          type: String,
          required: 'This field is required'
     },
     
     customname: {
          type: String,
          required: 'This field is required'
     },

     pp: {
          type:Buffer,

     },
     
     vanlikes: {
          type: Number,
     },

     messages: {
          type: [{user : String,txt : String}],
          required: 'This field is required'
      },


})

mongoose.model('VanCustomisation', vanCustomisationSchema);

