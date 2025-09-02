const { UserAuth, AdminAuth } = require("../middlewares/auth");
const express=require("express");
const profileRouter=express.Router();
const{validateEditProfile}=require("../utls/validation")
const bcrypt = require('bcrypt');


//profile
profileRouter.get("/profile/view", UserAuth ,async (req,res)=>{
  try {
    const currentUser = req.user; // after middleware attaches user to req
    res.send(currentUser);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

profileRouter.patch("/profile/edit", UserAuth ,async (req,res)=>{
  try{
   if(!validateEditProfile(req)){
    throw new Error("Invalid Edit Request");
   }

  const loggedinuser=req.user;
 //{You can do it this way but its the wrong way of editing the data as you can use loop}
  // loggedinuser.Name = req.body.Name;
  // loggedinuser.LastName = req.body.LastName;
  // loggedinuser.Age = req.body.Age;
  // loggedinuser.Gender = req.body.Gender;
  // loggedinuser.PhotoUrl = req.body.PhotoUrl;
  // loggedinuser.About = req.body.About;
  // loggedinuser.Skills = req.body.Skills;

  //Better One Line Method
  Object.keys(req.body).forEach((key)=>(loggedinuser[key]=req.body[key]));
  
  await loggedinuser.save();
  //This can be done but this is not the best way
  // res.send(`${loggedinuser.Name} Your Profile was Updated Succesfully`);

  res.json({
    message:`${loggedinuser.Name} Your Profile was Updated Succesfully`,
    data: loggedinuser,
  });
  }catch(err){
    res.status(400).send("Error:"+err.message);
  }
})

profileRouter.patch("/profile/password",UserAuth,async(req,res)=>{
  try{
  const loggedinuser=req.user;
   const isMatch = await bcrypt.compare(req.body.OldPass, loggedinuser.Password); // Assume Password is hashed.

    if (!isMatch) {
      return res.status(400).send("Incorrect old password.");
    }

    const hashedNewPassword = await bcrypt.hash(req.body.Password, 10);
    loggedinuser.Password = hashedNewPassword;
    await loggedinuser.save();

    res.send("Password updated successfully.");
  }catch(err){
    res.status(400).send("Error:"+err.message);
  }
});

module.exports=profileRouter;