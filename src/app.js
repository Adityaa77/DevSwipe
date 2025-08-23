const express=require ("express");

//establishing connection with the mongodb
require("./config/database.js");

const app=express();
const {AdminAuth}=require("./middlewares/auth.js");//to take the auth from middlewares
let name="Aditya";

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

 app.listen(3000,()=>{
    console.log("Server is Succesfully Running on Port-3000");
 });