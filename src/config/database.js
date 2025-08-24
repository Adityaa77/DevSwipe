const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect(
        "mongodb+srv://opmaditya42:pyKE6r8KvqpcTABt@namastenode.qypoqyn.mongodb.net/?retryWrites=true&w=majority&appName=NamasteNode"
    );
};

module.exports =connectDB;