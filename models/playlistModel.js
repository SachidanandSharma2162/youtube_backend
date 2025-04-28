const mongoose =require("mongoose");

const playlistSchema=mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        required:true
    },
    videos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps: true,
  })

module.exports=mongoose.model("Playlist",playlistSchema);