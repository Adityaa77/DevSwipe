const mongoose=require("mongoose");

const UserSchema = mongoose.Schema({
     Name:{
        type: String,
     },
     LastName:{
        type: String,
     },
     Branch:{
        type: String,
     },
     Age:{
        type:Number,
     },
     Employed:{
        type:Boolean,
     },
});

//you can write both directly
module.exports=mongoose.model("User",UserSchema);

