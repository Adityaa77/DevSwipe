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

const validateEditProfile=(req)=>{
    const allowedEditFields=["Name","LastName","Age","Gender","PhotoUrl","About","Skills"];
    
    const isEditAllowed= Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );
    return isEditAllowed;
};
module.exports={
    validateSignUPData,
    validateEditProfile,
};