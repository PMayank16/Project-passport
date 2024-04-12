const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require("../models/User")                                  

router.get("/login",(req, res)=>{
    res.render("login");
});

router.get("/register",(req, res)=>{
    res.render("register");
});

router.post("/register", (req, res)=>{
    const {name, email, password, password2}= req.body;
    let errors = [];

    //Every fill in all field required 
    if(!name || !email || !password || !password2){
        errors.push({msg: "Please fill in all field"})
    }

    //Password Match 
    if(password !== password2){
        errors.push({msg:"Password do not match"})
    }

    if(password.length < 6){
        errors.push({msg:"Password should be atleast 6 charecters"})
    }

    if(errors.length > 0){
       res.render('register',{
        errors,
        name,
        email,
        password,
        password2
    });

    }else{
        //validation Passed
        User.findOne({ email:email })
        .then(user=>{
            if(user){
                errors.push({msg:'Email is already registered'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                const newUser = new User({
                    name,
                    email,
                    password
                });
                bcrypt.genSalt(10,(err, salt)=>
                 bcrypt.hash(newUser.password, salt,(err, hash)=>{
                    if(err) throw err;
                    //set password to hash
                    newUser.password = hash;
                    
                    //save user
                    newUser.save()
                    .then(user=>{
                        req.flash("success_msg",'You are Now Registered and Now login')
                        res.redirect("/user/login")
                    })
                    .catch( err=>console.log(err) )

                 })
            
            )
            }
        })
    }
})


// login Handle
router.post('/login', (req, res, next)=>{
   passport.authenticate('local',{
    successRedirect: '/dashboard',
    failureRedirect: '/user/login',
    failureFlash:true
   })(req, res, next);
});

//logout Handle
router.get('/logout', (req,res,next)=>{
    req.flash('success_msg','Your are logged Out')
    res.redirect('/user/login')
})

module.exports= router;