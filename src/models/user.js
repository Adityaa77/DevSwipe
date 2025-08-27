const mongoose=require("mongoose");
//validator
const validator=require("validator");

const UserSchema = mongoose.Schema({
     Name:{
        type: String,
        required: true,
     },
     LastName:{
        type: String,
        required: true,
     },
     Age:{
        type:Number,
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
      trim:true,
      validate(value){
       if(!validator.isEmail(value)){
         throw new Error("Invalid Email");
       }
      },
     },
     Password:{
      type:String,
      required: true,
      minLength: 4,
      validate(value){
         if(!validator.isStrongPassword(value)){
            throw new Error('Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a symbol.'+ value);
         }
      },
     },
     PhotoUrl:{
      type:String,
      default:"https://static.vecteezy.com/system/resources/thumbnails/010/260/479/small_2x/default-avatar-profile-icon-of-social-media-user-in-clipart-style-vector.jpg",
     validate(value){
      if(!validator.isURL(value)){
         throw new Error("Image is Not a Url");
      }
     },
   },
     About:{
      type:String,
      default : "This is the default about section",
     },
     Skills:{
      type:[String],
      unique:true,
      validate(value){
         if(value.length>10){
            throw new Error("More Than 10 Skills are not Allowed")
         }
         if (new Set(value).size !== value.length) {
             throw new Error("Skills must be unique");
         }
      }
     },
},{
   timestamps:true,
});

//you can write both directly
module.exports=mongoose.model("User",UserSchema);

