const { UserAuth, AdminAuth } = require("../middlewares/auth");
const express=require("express");

const requestRouter=express.Router();

//sending connection request
requestRouter.post("/SendConnectionRequest",UserAuth,async(req,res)=>{
const user=req.user;
  console.log("Sending Connection Request");

  res.send(user.Name+" Sent Connection request")
})

module.exports=requestRouter;