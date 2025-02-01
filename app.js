if(process.env.NODE_ENV != "production")
{
    require("dotenv").config();
}

// console.log(process.env.SECRET);

const express = require("express");
const app =express();
const mongoose = require("mongoose");
 const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //used to create templates
 const wrapAsync = require("./utils/wrapAsync.js");
const ExressError = require("./utils/expressError.js");
 const {listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

//authentication
const passport=require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");

const port = 3000;




app.set("view engine","ejs");
app.set("views",path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
// app.use(express.json());
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const dburl = process.env.ATLAS_URL;

const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,

    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("Error in mongo session store",err);
})
const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 100,
        maxage : 7 * 24 * 60 * 60 * 100,
        httpOnly : true,
    },

}


//creating connection with Mando DB
main().then(()=>{
    console.log("Connection created successfully...!");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}



app.use(session(sessionOption));
app.use(flash());


//authentication code
//1.passport initialize
app.use(passport.initialize()); // for each request passport is getting initialized

//2.session needs here bcz - session need to know the multiple req and res are from the same user. 
// no need to login each time while visiting the different pages of the same website
app.use(passport.session());

//3.all users are authenticatd using the LocalStratergy technique
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());  // stroring the information of user into the sessions
passport.deserializeUser(User.deserializeUser()); //removing the information of user from the sessions


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user;
    next();
});


// app.get("/userdemo" , async(req,res)=>{
//     let fakeUser = new User({
//         email : "Nisha@gmail.com",
//         username : "Nisha Chavan",
//     });

//     let registereduser = await User.register(fakeUser,"Nisha@123");
//     res.send(registereduser);
// })

app.use("/listings" , listingsRouter);
app.use("/listings/:id/review",reviewRouter);
app.use("/",userRouter);

app.listen(port,()=>{
    console.log("Server is getting started...!");
});



// app.get("/",(req,res)=>{
//     res.send("Working get request..!");
// });

app.all("*",(req,res,next)=>{
    next(new ExressError(404,"Page Not Found...!"));
})

//createing the error msg
app.use((err,req,res,next)=>{

    let {statusCode = 500, message ="Something Went Wrong..!" } = err;
    res.status(statusCode).render("error.ejs" , {message});
   //  res.status(statusCode).send(message);
});
