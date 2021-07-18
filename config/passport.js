const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = mongoose.model('User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'username'}, (username,password,done) =>{
            User.findOne({username: username})
            .then(person =>{
                if(!person){
                    return done(null,false,{message:'that username is not registered'});
                }    

                bcrypt.compare(password,person.password,(err, isMatch)=> {
                    if (err) throw err;

                    if(isMatch) {  
                        return done(null,person);
                    } else {
                        return done(null,false, {message:'that password is incorrect'});
                    }
                });
            })
            .catch(err => console.log(err)); 

        })
    );


    passport.serializeUser(function(person, done)  {
        done(null, person.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, person) {
          done(err, person);
        });
      });

    


}