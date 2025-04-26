const mongoose = require('mongoose');
// const express = require('express');
// const app = express();
const dotenv = require('dotenv');
const connectDB = async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/practise`)
        console.log('MongoDB connected successfully');
    }catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);  
    }
}

module.exports={connectDB}


// using effi
/*
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/practise`)
        app.on('error', (err) => {
            console.error('MongoDB connection error:', err.message);
            process.exit(1);  
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);  
    }
})()
*/