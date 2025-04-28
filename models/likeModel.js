const mongoose = require("mongoose");

const likeSchema=({
    video:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Video",
    },
    comment:{
        type: mongoose.Schema.Types.ObjectId, // one who is subscribed
        ref: "Comment",
    },
    tweet:{
        type: mongoose.Schema.Types.ObjectId, // one who is subscribed
        ref: "Tweet",
    },
    likedBy:{
        type: mongoose.Schema.Types.ObjectId, // one who is subscribed
        ref: "User",
    }
},{
    timestamps:true
})

module.exports=mongoose.model("Like",likeSchema)