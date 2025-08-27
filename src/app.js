//connectdb require
const express=require ("express");
//establishing connection with the mongodb
const connectDB=require("./config/database.js");
//to call express
const app=express();
//to connect utils validate
const {validateSignUPData}=require("./utls/validation.js");
//middleware
app.use(express.json());
//usermodel 
const User=require("./models/user.js");
//addding bcrypt
const bcrypt=require("bcrypt")
//cookie parser
const cookieParser =require("cookie-parser")
app.use(cookieParser());
//jwt
const jwt = require("jsonwebtoken");


//creating an api
app.post("/signup",async(req,res)=>{
   //validation of data
  validateSignUPData(req);

//encrypt the password
const { Name, LastName, Emailid, Password } = req.body;
if (!Password) {
  return res.status(400).send("Password is required");
}
//encrypt the password
const passwordhash = await bcrypt.hash(Password, 10);

//creating a new instance of user model
const user = new User({
  Name,
  LastName,
  Emailid,
  Password: passwordhash,
});
 
  try{
    await user.save();
  res.send("User Added in the Database");
  }catch(err){
    res.status(400).send("Error :"+err.message);
  }
});

//login
app.post("/login", async (req, res) => {
  try {
    const { Emailid, Password } = req.body;
    const user = await User.findOne({ Emailid });
    if (!user) {
     throw new Error("Invalid credentials");
    }
const isPasswordValid = await bcrypt.compare(Password, user.Password);

    if (isPasswordValid) {
 
      //create jwt token
      const token = await jwt.sign({_id:user._id},"Dev@Swipe$2004")
      console.log(token);
      //add the token to the cookie and send to the user
      res.cookie("token",token);
      res.send("Login Succesful!!");

    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//profile
app.get("/profile",async (req,res)=>{
  try{const cookies =req.cookies;

  const{token}=cookies;
  if(!token){
    throw new Error("Invalid Tokern");
  }
  //validate my token
const decodedmessage= await jwt.verify(token,"Dev@Swipe$2004")
console.log(decodedmessage);
const{_id}=decodedmessage;
console.log("Logged in User is: "+_id);

  res.send("Reading Cookies");}catch(err){
    res.status(400).send("Error:"+ err.message);
  }
})


//finding the user by rollno.//always use async await and try catch
app.get("/user",async (req,res)=>{
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
app.get("/feed",async (req,res)=>{
  try{
    const users=await User.find({});
    res.send(users);
  }catch(err){
    res.status(400).send("Something went Wrong");
  }
});

//deleting the data 


//updating user
app.patch("/user/:userId",async (req,res)=>{
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

//error handling in the end
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Server Error');
});

connectDB()//correct way so the data is established first and then the server is set up
   .then(()=>{
    console.log("Data Connection Established");
    app.listen(3000,()=>{
    console.log("Server is Succesfully Running on Port-3000");
     });
   })
   .catch((err)=>{
    console.log("Database Connection Error");
   });
 