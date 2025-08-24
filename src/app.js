const express=require ("express");
//connectdb require
const connectDB=require("./config/database.js");
//establishing connection with the mongodb
require("./config/database.js");

const app=express();

//to take the auth from middlewares
const {AdminAuth}=require("./middlewares/auth.js");

// /admin
app.use("/admin",AdminAuth);

app.get("/admin",(req,res)=>{
   console.log("Admin data Aquired");
   res.send({
    Name:"Penaldo",
             Age:"45",
             Position:"Penalty Box",
   });
});

let name="Aditya";
// /hello
app.use("/hello", (req, res) => {
  res.send(`Hello Your name is ${name}`)
})


// /user
app.get("/user",(req,res,next)=>{
  console.log("Person 1 Data");
  res.send({Name:"Aditya",
           LastName:"Singh",
           Rollno:"22104B2012",
           Residence:"Mumbai"
  })
  next();
},
  (req,res)=>{
    console.log("Person 2 Data");
  res.send({
          Name:"Aryan",
           LastName:"Singh",
           Rollno:"22104B2010",
           Residence:"Mumbai"
  })
})



app.post("/user",(req,res)=>{
  res.send("Data Sent Succesfully")
});

app.delete("/user",(req,res)=>{
  res.send("Data Deleted Succesfully")
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
 