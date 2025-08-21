const express=require ("express");

const app=express();
let name="Aditya";

app.use("/hello", (req, res) => {
  res.send(`Hello Your name is ${name}`)
})

app.get("/user",(req,res)=>{
  res.send({Name:"Aditya",
           LastName:"Singh",
           Rollno:"22104B2012",
           Residence:"Mumbai"
  }
  )
})

app.get('/user', (req, res) => {
  // Example: /user?name=aditya
  res.send(`Query param name: ${req.query.name}`)
})

app.post("/user",(req,res)=>{
  res.send("Data Sent Succesfully")
});

app.delete("/user",(req,res)=>{
  res.send("Data Deleted Succesfully")
});

 app.listen(3000,()=>{
    console.log("Server is Succesfully Running on Port-3000");
 });