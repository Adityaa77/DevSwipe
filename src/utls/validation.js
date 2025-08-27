const validator=require("validator");

const validateSignUPData =(req)=>{
    const{Name,LastName,Age,Emailid,Password}=req.body;

    if(!Name || !LastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(Emailid)){
        throw new Error("Email is Invalid");
    }

}

module.exports={
    validateSignUPData,
};