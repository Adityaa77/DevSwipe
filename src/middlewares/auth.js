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

module.exports={
    AdminAuth,
};