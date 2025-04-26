const mongoose=require("mongoose")

const subscriberSchema=({
    subscriber:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps: true
})

module.exports=mongoose.model("Subscriber",subscriberSchema)