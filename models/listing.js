const mongoose=require("mongoose");
const Review = require("./review");

const Schema=mongoose.Schema;

const listingSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    discription:{
        type:String,
    },
    image:{
       url:String,
       filename:String
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },

    geometry:{
    type:{
        type:String,
        enum:['Point'],
        required:true
    },
    coordinates:{
        type:[Number],
        required:true
    }
    }
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    await Review.deleteMany({_id:{$in:listing.reviews}});
})

const Listing= mongoose.model("Listing",listingSchema);
module.exports=Listing;