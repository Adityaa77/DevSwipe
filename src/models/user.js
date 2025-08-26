const mongoose=require("mongoose");

const UserSchema = mongoose.Schema({
     Name:{
        type: String,
        required: true,
     },
     LastName:{
        type: String,
     },
     Age:{
        type:Number,
        required: true,
        min:18,
     },
     Gender:{
      type:String,
      validate(value){
         if(!["male","female","others"].includes(value)){
            throw new Error("Gender data is not valid");
         }
      },
     },
     Emailid:{
      type:String,
      required: true,
      unique:true,
      lowercase:true,
      trim:true
     },
     Password:{
      type:String,
      required: true,
      minLength: 4,
     },
     PhotoUrl:{
      type:String,
      default:"https://static.vecteezy.com/system/resources/thumbnails/010/260/479/small_2x/default-avatar-profile-icon-of-social-media-user-in-clipart-style-vector.jpg",
     },
     About:{
      type:String,
      default : "This is the default about section",
     },
     Skills:{
      type:[String],
      
     },
},{
   timestamps:true,
});

//you can write both directly
module.exports=mongoose.model("User",UserSchema);

