const mongoose=require("mongoose");
const initData=require("./data.js");

const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/Nestly";
main().then(res=>{console.log("connection success")})
.catch(err=>{console.log(err)})


async function main(){
 await mongoose.connect(MONGO_URL)
}

const initDb= async ()=>{
  await  Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj, owner:'6ac68dd8b6308ae9aab8eada'}))
   await Listing.insertMany(initData.data);
    console.log("data add successfully")

} 
initDb();