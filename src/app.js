const express=require ("express");

const app=express();
let name="Aditya";
app.use((req,res)=>{
    res.send(`Hi my name is ${name}`)
    res.send("Hi I am Learning Backend")  
})


 app.listen(3000,()=>{
    console.log("Server is Succesfully Running on Port-3000");
 })