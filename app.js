if(process.env.NODE_ENV!="production"){
    require("dotenv").config()
}

const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/expressError.js");

const session=require("express-session");
const MongoStore = require("connect-mongo").default;

const flash=require("connect-flash");
const User=require("./models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");

const listingsRoute=require("./routes/listing.js");
const reviewsRoute=require("./routes/review.js");
const userRoute=require("./routes/user.js");


 app.use(methodOverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname , "/public")));

const mongoose=require("mongoose");
const Listing = require("./models/listing.js");
// const MONGO_URL="mongodb://127.0.0.1:27017/Nestly";
const DbURL=process.env.ATLASDB_URL;

async function main(){
 await mongoose.connect(DbURL)
};
main().then(res=>{console.log("connection success")})
.catch(err=>{console.log(err)})


// mongobd store

const store=  MongoStore.create({
    mongoUrl:DbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600, // Db session related info refresh autometically in 24 hours
});

// creat express session
const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized:true,
}



store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE ", err);
});

//  creating session 
app.use(session(sessionOptions));

// implimentaion of Flash

app.use(flash());

// Password Authentucation
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
     res.locals.error=req.flash("error");
     res.locals.currUser=req.user;
    next();
})

app.get("/", async(req,res,next)=>{
    const allListing=await Listing.find({});
    res.render("listings/home.ejs",{allListing});
});


app.use("/listings",listingsRoute);


app.use("/listings/:id/reviews",reviewsRoute);

app.use("/",userRoute);






// error handling 

app.all("/{*splat}",(req,res,next)=>{
   
    next(new ExpressError(404,"page not found!"));

})

app.use((err,req,res,next)=>{
     let {status=500,message="Somethig went worng!"}=err;
    res.status(status).render("error.ejs",{message});
})

app.listen(8080,()=>{
    console.log(" listening at port 8080");
})
