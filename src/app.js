//connectdb require
const express=require ("express");
//establishing connection with the mongodb
const connectDB=require("./config/database.js");

const app=express();
//middleware
app.use(express.json());
//usermodel 
const User=require("./models/user.js");


//creating an api
app.post("/signup",async(req,res)=>{
  const user=new User(req.body);
  try{
    await user.save();
  res.send("User Added in the Database");
  }catch(err){
    res.status(400).send("Error Saving the data"+err.message);
  }
});

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
 