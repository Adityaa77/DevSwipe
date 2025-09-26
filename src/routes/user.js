const { UserAuth, AdminAuth } = require("../middlewares/auth");
const express=require("express");
//usermodel 
const User=require("../models/user.js");
const ConnectionRequest = require("../models/connectionrequest");
const user = require("../models/user.js");
const userRouter=express.Router();

const USER_SAFE_DATA="Name LastName PhotoUrl Age Gender About Skills"

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


//get all the pending connection request for the logged in user 
userRouter.get("/user/requests/received",UserAuth,async (req,res)=>{
   try{
    const loggedinUser=req.user;
    //jtr find will return array and find one will return object
    const connectionRequests=await ConnectionRequest.find({
    touserId: loggedinUser._id,
    status:"interested"
    }).populate("fromUserId",USER_SAFE_DATA);

    res.json({
      message:"Data sent Succesfully",
      data: connectionRequests,
    })

   }catch(err){
    req.status(400).send("Error:"+err.message);
   }
})

userRouter.get("/user/connections",UserAuth,async (req,res)=>{
  try{
    const loggedinUser=req.user;
   
    const connectionRequests=await ConnectionRequest.find({
      $or:[
        {touserId:loggedinUser._id,status:"accepted"},
        {fromUserId:loggedinUser._id,status:"accepted"},
      ],
    }).populate("fromUserId",USER_SAFE_DATA)
    .populate("toUserId",USER_SAFE_DATA);

    const data=connectionRequests.map(row=> {
      if(row.fromUserId._id.toString()===loggedinUser._id.toString()){
        return row.touserId;
      }
      return row.fromUserId
    });

    res.json({data: connectionRequests});
  }catch(err){
    return res.status(400).send({message:err.message})
  }
});

//to feed the user the accepted connections
userRouter.get("/feed",UserAuth,async(req,res)=>{
  try{
   const loggedinUser=req.user;

   const page=parseInt(req.query.page) ||1;
   let limit=parseInt(req.query.limit)||10;
   limit=limit>50?50:limit;

   const skip=(page-1)* limit;

   const connectionRequests=await ConnectionRequest.find({
    $or:[
      {fromUserId:loggedinUser._id},{touserId:loggedinUser._id},
    ]
   }).select("fromUserId toUserId");

   const hiddenUsersFromFeed=new Set();
   connectionRequests.forEach((req)=>{
    hiddenUsersFromFeed.add(req.fromUserId.toString());
    hiddenUsersFromFeed.add(req.touserId.toString());
   });
    
  const users=await User.find({
    $and: [
      {_id: {$nin: Array.from(hiddenUsersFromFeed)}},
      {_id: {$ne: loggedinUser._id}},
    ],
  })
  .select(USER_SAFE_DATA)
  .skip(skip)
  .limit(limit);

  res.json({ data: users });
  }catch(err){
    res.status(400).send("Error:"+err.message);
  }
})
module.exports=userRouter;