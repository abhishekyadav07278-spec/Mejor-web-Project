const Listing = require("./models/listing");
const Review = require("./models/review.js");
const{ listingSchema}=require("./schema.js");
const ExpressError=require("./utils/expressError.js");

module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
       req.session.redirectUrl=req.originalUrl ;
        req.flash("error","You must be logged in First ");
     return   res.redirect("/login");

    }
next()
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async(req,res,next)=>{
      let {id}=req.params;
  let listing=  await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You don't have permission");
    return res.redirect(`/listings/${id}`);
  }

  next();
}
module.exports.validatlisting=(req,res,next)=>{
      // handling severe siteError using Joi 
   let {error}=listingSchema.validate(req.body);
   if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg); 
   }else{
    next();
   }
}

module.exports.isAuthor= async(req,res,next)=>{
      let {id,reviewId}=req.params;
  let review=  await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You don't have permission");
    return res.redirect(`/listings/${id}`);
  }

  next();
}