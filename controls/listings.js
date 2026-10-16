const Listing = require("../models/listing");
const ExpressError=require("../utils/expressError.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken: mapToken});




module.exports.index=async (req,res,next)=>{
  const allListing=await Listing.find({});
  res.render("listings/index.ejs" ,{allListing});
}

module.exports.showListings=async (req,res,next)=>{
    let {id}=req.params;
    let list= await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"}})
    .populate("owner");
    if(!list){
    req.flash("error","Listing does not exsiting!")
 res.redirect("/listings");
}else{
    res.render("listings/show.ejs",{list});
}
}

module.exports.newForm=(req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.creatListing=async (req,res,next)=>{

let response=await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
.send();



    let url=req.file.path;
    let filename=req.file.filename;
    let newListing=new Listing(req.body.listing); // ya fir ham simple priveous jaise bhi kar sakte hai
    newListing.owner=req.user._id;
    newListing.image={url,filename};

    newListing.geometry=response.body.features[0].geometry;
    
    await newListing.save();
   
    req.flash("success","New listing Created!");
    res.redirect("/listings");
}
// edit listing
module.exports.editListing=async (req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
       if(!listing){
    req.flash("error","Listing does not exsiting!")
 res.redirect("/listings");
}
    res.render("listings/edit.ejs",{listing});
}

// update listing 
module.exports.updateListing=async (req,res,next)=>{
     if(!req.body.listing){
        throw(new ExpressError(400,"Send valid Data!"))
    }
    let {id}=req.params;
     let listing= await Listing.findByIdAndUpdate(id, req.body.listing);

     if(typeof req.file!=="undefined"){
         let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
     }

    req.flash("success","Listing edited successfully!");
    res.redirect(`/listings/${id}`);
}


module.exports.deleteListing=async (req,res ,next)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully!");
    res.redirect("/listings");
}
