const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect(
        "mongodb+srv://opmaditya42:pyKE6r8KvqpcTABt@namastenode.qypoqyn.mongodb.net/?retryWrites=true&w=majority&appName=NamasteNode"
    );
};

connectDB()
   .then(()=>{
    console.log("Data Connection Established");
   })
   .catch((err)=>{
    console.log("Database Connection Error");
   });