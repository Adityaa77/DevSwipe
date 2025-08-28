const { UserAuth, AdminAuth } = require("../middlewares/auth");

const express=require("express");

const profileRouter=express.Router();

//profile
profileRouter.get("/profile", UserAuth ,async (req,res)=>{
  try {
    const currentUser = req.user; // after middleware attaches user to req
    res.send(currentUser);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

module.exports=profileRouter;