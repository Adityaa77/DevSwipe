const mongoose=require("mongoose");

const UserSchema = mongoose.Schema({
     Name:{
        type: String,
     },
     LastName:{
        type: String,
     },
     Age:{
        type:Number,
     },
     Emailid:{
      type:String,
     },
     Password:{
      type:String,
     },
});

//you can write both directly
module.exports=mongoose.model("User",UserSchema);

