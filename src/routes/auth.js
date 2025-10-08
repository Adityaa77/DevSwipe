const express=require("express");
//to connect utils validate
const {validateSignUPData}=require("../utls/validation.js");
//usermodel 
const User=require("../models/user.js");
//addding bcrypt
const bcrypt=require("bcrypt")
//adding jwt
const jwt = require("jsonwebtoken");
const { UserAuth, AdminAuth } = require("../middlewares/auth");

const authRouter=express.Router();

//creating an api
authRouter.post("/signup",async(req,res)=>{
  try{
   //validation of data
  validateSignUPData(req);

//encrypt the password
const { Name, LastName, Emailid, Password, } = req.body;
if (!Password) {
  return res.status(400).send("Password is required");
}
//encrypt the password
const passwordhash = await bcrypt.hash(Password, 10);

//creating a new instance of user model
const user = new User({
  Name,
  LastName,
  Emailid,
  Password: passwordhash,
  Skills: []
});
 
  
  const savedUser =await user.save();
  const token=await savedUser.getJWT();

  res.cookie("token",token,{
    expires:new Date(Date.now()+8*3600000),
  })

  res.json({message: "User added Succesfully",data: savedUser});
  }catch(err){
    res.status(400).send("Error :"+err.message);
  }
});

//login
authRouter.post("/login", async (req, res) => {
  try {
    const { Emailid, Password } = req.body;
    const user = await User.findOne({ Emailid });
    if (!user) {
     throw new Error("Invalid credentials");
    }
const isPasswordValid = await user.getPassword(Password);

    if (isPasswordValid) {
 
      //create jwt token
      const token = await user.getJWT();

      console.log(token);
      //add the token to the cookie and send to the user
      res.cookie("token",token);
      res.send("Login Succesful!!");

    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req,res)=>{
res.cookie("taken",null,{
  expires:new Date(Date.now()),
});
  res.send("Logout Succesful");
  console.log("Logged Out");
});

module.exports=authRouter;