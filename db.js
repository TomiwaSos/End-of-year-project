const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://123:123@cluster0.0ntxa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{

    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
},

err => {
    if(!err) {  
    console.log('Connection succeeded')
    }else{
    console.log('Error in connection'+err)
    }

})

require('./models/user.model')
require('./models/staff.model')
require('./models/listing.model')
require('./models/order.model')
require('./models/image.model')
require('./models/card.model')
require('./models/messageRoom.model')
require('./models/vanCustomisation.model')
require('./models/customProfile.model')
require('./models/review.model')
require('./models/discount.model')
require('./models/nikeCustomisation.model')
