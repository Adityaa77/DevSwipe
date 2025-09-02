const { UserAuth, AdminAuth } = require("../middlewares/auth");
const express=require("express");
const User=require("../models/user")
const requestRouter=express.Router();
const ConnectionRequest = require("../models/connectionrequest");

//sending connection request
requestRouter.post("/request/send/:status/:touserId",UserAuth,
  async(req,res)=>{
try{
   const fromuserId = req.user._id;
   const touserId = req.params.touserId;
   const status=req.params.status;

   //add this to tell which status are allowed
   const allowedStatus=["ignored","interested"];
   if(!allowedStatus.includes(status)){
    return res.status(404).json({message:"Status is Incorrect"});
   }

   const toUser = await User.findById(touserId);
   if(!toUser){
    return res.status(404).json({message:"User not Found"});
   }

   const existingConnectionReq = await ConnectionRequest.findOne({
  $or: [
    { fromuserId, touserId },
    { fromuserId: touserId, touserId: fromuserId },
  ],
});
   if(existingConnectionReq){
    return res.status(400).send({message:"Connection Request Already Existis"});
   }

   const connectionRequest = new ConnectionRequest({
  fromuserId,
  touserId,
  status,
});

   const data=await connectionRequest.save();
   
   let message;
if (status === "ignored") {
  message = `${req.user.Name} ignored ${toUser.Name}'s connection request.`;
} else if (status === "interested") {
  message = `${req.user.Name} is interested in connecting with ${toUser.Name}.`;
} else {
  message = `${req.user.Name} set status "${status}" for ${toUser.Name}.`;
}

   res.json({
   message,
   data,
   });

}catch(err){
  res.status(400).send("Error:"+err.message);
}
})

module.exports=requestRouter;