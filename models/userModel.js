const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
    },
    email: {
        type: String,  
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
    },
    fullName: {
        type: String,
        required: true,
        trim: true, 
    },
    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    coverImage: {
        type: String, // cloudinary url
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }
},{
    timestamps: true
})

userSchema.pre('save', async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()  
})
userSchema.methods.isPasswordMatch = async function (password) {
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.createAccessToken = function () {
    return jwt.sign({
        id: this._id,
        userName: this.userName,
        email: this.email,
        fullName: this.fullName,
     }, 
     process.env.ACCESS_TOKEN_SECRET, 
     { 
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY 
    });
}
userSchema.methods.createRefreshToken = function () {
    return jwt.sign({
        id: this._id,
     }, 
     process.env.REFRESH_TOKEN_SECRET,  
     { 
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY 
    });
}
    
module.exports = mongoose.model('User', userSchema);



// Ya kahani jarur padhne

// access token hamesha chota hota hai, refresh token bada hota hai, kyuki refresh token ko hum use karte hai access token ko generate karne ke liye, aur refresh token ko hum use karte hai user ko login karne ke liye, jab access token expire ho jata hai.
// access token ko hum use karte hai user ko authenticate karne ke liye, jab user login karta hai, to hum access token ko generate karte hai, aur usko user ko bhejte hai, taaki user ko authenticate kar sake.
// agar user kisi karad se logout ho gya to refresh token ko use karke hum user ko dobara login kar sakte hai, kyuki refresh token ko hum use karte hai access token ko generate karne ke liye, aur refresh token ko hum use karte hai user ko login karne ke liye, jab access token expire ho jata hai.
// agar user kisi karad se logout ho gya to refresh token joki database me store hota hai, usko use karke hum user ko dobara login kar sakte hai, kyuki refresh token ko hum use karte hai access token ko generate karne ke liye.

// accessToken shortLived hota hai aur refreshToken database me stored hota hai, to jab bhi user koi problem face krta hai to compare kr lete hai aur session ko restart kr dete hai.