const express = require ("express");
const expressLayout = require('express-ejs-layouts');
const mongoose = require ("mongoose");
const  session = require ('express-session');
const flash = require('connect-flash');
const passport = require("passport")
const app = express();
//passport config
require('./config/passport')(passport);

//Connect MongoDB
mongoose.connect("mongodb://localhost:27017/passport-nodejs")
.then(()=>console.log("MongoDB Connected..."))
.catch((err=>console.log(err)))

//BodyParser
app.use( express.urlencoded ({ extended:false }));

//express session 
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


//connect flash
app.use(flash());

//global varse
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next();
});

// EJS
app.use(expressLayout);
app.set('view engine', 'ejs')

//Routes
app.use("/", require("./routes/index"));
app.use("/user", require("./routes/users"))


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log(`Sarver started On PORT:5000`));

