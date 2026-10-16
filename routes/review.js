const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/expressError.js");
const{ reviewSchema}=require("../schema.js");
const { isLoggedin,isAuthor } = require("../middleware.js");
const reviewsControl= require("../controls/reviews.js");


const validatReview=(req,res,next)=>{
      // handling severe siteError using Joi 
   let {error}=reviewSchema.validate(req.body);
   if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg); 
   }else{
    next();
   }}




//   Review //
router.post("/", validatReview,isLoggedin, wrapAsync(reviewsControl.createReview));
// Delete reviews 

router.delete("/:reviewId",isLoggedin,isAuthor,wrapAsync(reviewsControl.deleteReview));

module.exports=router;