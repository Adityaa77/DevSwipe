const mongoose=require("mongoose");

const connectionRequestSchema=new mongoose.Schema(
    {
    fromuserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",//creating a link between from user and user using mongodb
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
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`,
        },
    },
},
    {timestamps:true}
)
//index
connectionRequestSchema.index({fromuserId:1, touserId:1});

//always use the normal function when writing the schema methods
connectionRequestSchema.pre("save",function (next){
  const connectionRequest=this;

  //Check if the fromUserid is same as the toUserid
   if(connectionRequest.fromuserId.equals(connectionRequest.touserId)){
    throw new Error(`You cannot send connection request to yourself`)
   }
   next();//always call next
})

const ConnectionRequestModel=new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequestModel;