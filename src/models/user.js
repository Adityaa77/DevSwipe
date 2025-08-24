const mongoose=require("mongoose");

const UserSchema = mongoose.Schema({
     firstname:{
        type: String,
     },
     lastname:{
        type: String,
     },
     emailid:{
        type: String,
     },
     age:{
        type:Number,
     },
     Employed:{
        type:Boolean,
     },
});

//you can write both directly
module.exports=mongoose.model("User",UserSchema);

