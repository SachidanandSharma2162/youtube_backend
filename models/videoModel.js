const mongoose = require('mongoose');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const VideoSchema=new mongoose.Schema({
    videoFile:{
        type:String, // cloudinary url
        required:true,
    },
    title:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    thumbnail:{
        type:String, // cloudinary url
        required:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    category:{
        type:String,
        required:true,
        trim:true,
    },
    duration:{
        type:Number,
        default:0
    },
    views:{
        type:Number,
        default:0
    },
    likes:{
        type:Number,
        default:0
    },
    dislikes:{
        type:Number,
        default:0
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    isPublished:{
        type:Boolean,
        default:true
    },
},{
    timestamps:true
})

VideoSchema.plugin(aggregatePaginate);
module.exports = mongoose.model('Video',VideoSchema);