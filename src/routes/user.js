const { UserAuth, AdminAuth } = require("../middlewares/auth");
const express=require("express");
//usermodel 
const User=require("../models/user.js");
const ConnectionRequest = require("../models/connectionrequest");
const userRouter=express.Router();

//deleting the data 

//updating user
userRouter.patch("/user/:userId",async (req,res)=>{
  const userId=req.params?.userId;
  const data=req.body;

  try{
    //to only allow certain things to update 
    const Allowed_Updates=["Gender","Skills","PhotoUrl","Password"];
   const isUpdateAllowed=Object.keys(data).every((k)=>
  Allowed_Updates.includes(k)
  );
  if(!isUpdateAllowed){
    throw new Error("Update not Allowed")
  }
    //normal update things
  const user =await User.findByIdAndUpdate({ _id:userId},data,{
    returnDocument:"after",
    runValidators: true,
  });
  console.log(user);
  res.send("User updated Succesfully");
}catch(err){
  res.status(400).send("Update Failed:"+ err.message);
}
});


//finding the user by rollno.//always use async await and try catch
userRouter.get("/user",async (req,res)=>{
  const useremail=req.body.Emailid;
  try{
    const users=await User.find({Emailid:useremail});
  if(!users){
    res.status(404).send("User not found");
  }else{
    res.send(users);
  }
  }catch(err){
    res.status(400).send("Something went Wrong");
  }
});

//feed api to get all the users from the database
userRouter.get("/feed",async (req,res)=>{
  try{
    const users=await User.find({});
    res.send(users);
  }catch(err){
    res.status(400).send("Something went Wrong");
  }
});

//get all the pending connection request for the logged in user 
userRouter.get("/user/requests/received",UserAuth,async (req,res)=>{
   try{
    const loggedinUser=req.user;
    //jtr find will return array and find one will return object
    const connectionRequests=await ConnectionRequest.find({
    touserId: loggedinUser._id,
    status:"interested"
    }).populate("fromUserId", ["Name", "lastName"]);

    res.join({
      message:"Data sent Succesfully",
      data: connectionRequests,
    })

   }catch(err){
    req.statusCode(400).send("Error:"+err.message);
   }
})

userRouter.get("/user/requests/received",UserAuth,async (req,res)=>{
  try{
    const loggedinUser=req.user;
  }catch(err){
    return res.status(400).send({message:err.message})
  }
});

module.exports=userRouter;