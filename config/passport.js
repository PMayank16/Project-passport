const LocalStrategy = require ("passport-local").Strategy;
const mongoose  = require ("mongoose");
const bcrypt = require ("bcryptjs");

const User = require('../models/User');

module.exports=function(passport){
    passport.use(
       new LocalStrategy({usernameField:'email'},(email, password, done)=>{
        User.findOne({email:email})
        .then(user =>{
            if(!user){
                return done(null, false,{message:'Incorrect email'});
            }

        //Match Password
        bcrypt.compare(password, user.password,(err,isMatch)=>{
            if(err)throw err;
            if(isMatch){
                return done (null, user)
            }else{
                return done(null,false,{message:'Incorrect password'})
            }
        })

        })
        .catch(err =>console.log(err))
       })
    )
    passport.serializeUser((user, done)=> {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id)
            .then(user => {
                done(null, user); // Pass the user to the done callback
            })
            .catch(err => {
                done(err, null); // Pass any errors to the done callback
            });
    });
}