const mongoose=require("mongoose");

const connectionRequest=new mongoose.Schema(
    {
    fromuserId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
    },
    touserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignore","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`,
        },
    },
},
    {timestamps:true}
)

const ConnectionRequestModel=new mongoose.model(
    "ConnectionRequest",
    connectionRequest
);

module.exports = ConnectionRequestModel;