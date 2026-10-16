const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasync.js");
const multer=require("multer");

const{ isLoggedin,isOwner,validatlisting}=require("../middleware.js")
const listingControl=require("../controls/listings.js");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});






// listing route



router 
     .route("/")
     .get(wrapAsync(listingControl.index))
     //  Creat new listing
     .post( isLoggedin ,upload.single("listing[image]"),validatlisting,wrapAsync(listingControl.creatListing));
   
//  New route 

router
     .route("/new")
     .get(isLoggedin,listingControl.newForm)





//  Show route

router.route("/:id")
       .get(wrapAsync(listingControl.showListings))
       // Update Route
       .put( isLoggedin,isOwner,upload.single("listing[image]"),validatlisting,wrapAsync (listingControl.updateListing))
       //  Delete route
       .delete(isLoggedin,isOwner,wrapAsync(listingControl.deleteListing));


//  Edit route

router.get("/:id/edit",
    isLoggedin,
    isOwner,
    wrapAsync( listingControl.editListing));




module.exports=router;