const AdminAuth=(req,res,next)=>{
    console.log("Authetication for Admin is Getting Checked");
    const token="aditya";
    const isAdminAuth=token==="aditya";
    if(!isAdminAuth){
        res.status(401).send("Error:Unauthorized Request");
    }else{
        next();
    }
};

const jwt=require("jsonwebtoken");
const user=require("../models/user");
const UserAuth=async (req,res,next)=>{
    //reading then toker from the cookies
    try{const {token}=req.cookies;
    
    const decodeObj=await jwt.verify(token,"Dev@Swipe$2004")
    
    const{_id}=decodeObj;

    const user=await user.findById(_id);
    if(!user){
        throw new Error("User Not Found");
    }
    next();}catch(err){
        res.status(400).send("Error:"+err.message);
    }
}

module.exports={
    AdminAuth,
};