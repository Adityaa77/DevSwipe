//connectdb require
const express=require ("express");
//establishing connection with the mongodb
const connectDB=require("./config/database.js");
//to call express
const app=express();
//cors
const cors=require("cors");
app.use(cors({
  origin: "http://localhost:5173",
  credentials:true,
}));
//middleware
app.use(express.json());
//cookie parser
const cookieParser =require("cookie-parser")
app.use(cookieParser());

//userAuth Added so its secure and only used when user is logged in
//adding user auth
const { UserAuth, AdminAuth } = require("./middlewares/auth");
const user = require("./models/user.js");
const authRouter=require("./routes/auth.js");
const profileRouter=require("./routes/profile.js");
const requestRouter=require("./routes/ConnectionReq.js");
const userRouter=require("./routes/user.js");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

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
 