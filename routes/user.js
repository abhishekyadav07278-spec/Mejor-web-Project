const express=require("express");
const wrapasync = require("../utils/wrapasync");

const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const router=express.Router();

const userControls= require("../controls/user.js");



router
    .route("/signup")
    // signup form
    .get(async(req,res)=>{
    res.render("users/signup.ejs")
})
//  signup 
    .post(wrapasync(userControls.userSignup));

router.route("/login")
    // login form
      .get(async(req,res)=>{
    res.render("users/login.ejs")
      })
    //   login
      .post(
    saveRedirectUrl,
    passport.authenticate("local",
       { failureRedirect:"/login",
        failureFlash:true
       }
    ),
   userControls.userLogin
);

// logout
router.get("/logout",userControls.userLogout)

module.exports=router;