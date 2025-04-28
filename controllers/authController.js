const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const userModel=require('../models/userModel');
const {asyncHandler}=require('../utils/asyncHandler');
const {uploadFileOnCloudinary}=require('../utils/cloudinary');
const { default: mongoose } = require('mongoose');

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        const accessToken = user.createAccessToken();
        const refreshToken = user.createRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
};

 module.exports.registerUser=asyncHandler(async (req,res)=>{
    try {
        // take user input from the body
        // validate - not empty
        // check if user already exists - userName, email
        // check for image
        // upload image to cloudinary, avatar
        // create user object- in db
        // remove password and refresh token from the response
        // check for user creation
        // return response with user object and token
        console.log(req.body); // or whatever you're inserting

        let {fullName,userName,email,password}=req.body;
        
        if(!fullName || !userName || !email || !password){
            return res.status(400).json({message:'Please fill all the fields'})
        }
    const existedUser=await userModel.findOne({
        $or:[{email},{userName}]
    });
    if(existedUser){
        return res.status(409).json({message:'User already exists with this email or username'})
    }
    const avatar=req.files?.avatar[0]?.path; 
    let coverImage;
if (
  req.files &&                                // check if files exist
  Array.isArray(req.files.coverImage) &&      // check if coverImage is an array
  req.files.coverImage.length > 0             // ensure it's not empty
) {
  coverImage = req.files?.coverImage[0]?.path;  // get the file path
}

    
    if(!avatar){
        return res.status(400).json({message:'Please upload an avatar'})
    }
    const avatarUpload=await uploadFileOnCloudinary(avatar);
    const coverImageUpload=await uploadFileOnCloudinary(coverImage);
    const user=await userModel.create({
        fullName,
        userName:userName.toLowerCase(),
        email,
        password,
        avatar:avatarUpload?.url,
        coverImage:coverImageUpload?.url || "",
    }); 
    const createdUser=await userModel.findById(user._id).select('-password -refreshToken');
    if(!createdUser){
        return res.status(500).json({message:'User not created'})
    }
    return res.status(201).json({
        message:'User created successfully',
        user:createdUser,
    })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Internal server error'})
    }
})

module.exports.loginUser = asyncHandler(async (req, res) => {
    
    try {
        
        const { userName, email, password } = req.body;
        console.log(req.body);
        

        if (!(userName || email)) {
            return res.status(400).json({ message: 'Please provide username or email' });
        }

        const loggingUser = await userModel.findOne({
            $or: [{ email }, { userName }]
        });
        console.log(loggingUser);
        
        if (!loggingUser) {
            return res.status(401).json({ message: 'Invalid username or email' });
        }

        const isPasswordMatch = await loggingUser.isPasswordMatch(password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(loggingUser._id);

        const user = await userModel.findById(loggingUser._id).select('-password -refreshToken');

        const options = {
            httpOnly: true,
            secure: true,
        };

        res
            .status(200)
            .cookie('refreshToken', refreshToken, options)
            .cookie('accessToken', accessToken, options)
            .json({
                message: 'User logged in successfully',
                user,
                accessToken,
                refreshToken
            });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports.logoutUser=asyncHandler(async (req,res)=>{
    try {
        //remove refresh token from db
        //remove cookies from the browser
        //return response with message
        const user=await userModel.findOneAndUpdate(req.user._id,{
            refreshToken:undefined 
        },{
            new:true
        })
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        return res.status(200).json({message:'User logged out successfully'})
    } catch (error) {
        
    }
})

module.exports.RefreshAccessToken=asyncHandler(async(req,res)=>{
    try {
        const incomingRefreshToken=req.cookie.refreshToken;
        if(!incomingRefreshToken){
            res.status(401).send("Unathorized Access")
        }
        const decodedToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user=await userModel.findById(decodedToken.id)
        if(!user){
            res.status(401).send('Invalid Refresh Token')
        }
        if(incomingRefreshToken!==user.refreshToken){
            res.status(401).send("Refresh Token is expired or used");
        }
        const options={
            httpOnly:true,
            secure:true
        }
        const {accessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id);
        res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json({
            message: 'Access token refreshed',
            user,
            accessToken,
            newRefreshToken
        });
    } catch (error) {
        res.status(401).send("Invalid access token")
    }
   
})

module.exports.changeUserPassword=asyncHandler(async(req,res)=>{
    try {
        console.log(req.body);
        let {oldPassword,newPassword,confirmPassword}=req.body;
        
        if(newPassword!==confirmPassword){
            return res.send("New Password and Confirm Password do not match!")
        }
        const user=await userModel.findById(req.user._id);
        const isPasswordMatch=await user.isPasswordMatch(oldPassword)
        if(!isPasswordMatch){
            res.send("incorrect old password");
        }
        user.password=newPassword
        await user.save({
            validateBeforeSave:false
        })
        return res.status(201).send("Password changed successfully. You can now login!")
    } catch (error) {
        res.status(401).send(error.message)
    }
})

module.exports.updateUserDetails=asyncHandler(async(req,res)=>{
    try {
        let {fullName,email}=req.body;

        if(!fullName || !email){
            return res.send("please fill out all fields!");
        }
        const user=await userModel.findByIdAndUpdate(req.user._id,{
            $set:{
                fullName,
                email
            }
        },{
            new:true
        }
).select("-password");
    
        return res.status(200).json({
            user,
            message:"Infomation updated successfully!"
        })
    } catch (error) {
        res.status(401).json({
            message:"something went worng, try again!"
        })
    }
})

module.exports.updateCoverImage = asyncHandler(async (req, res) => {
    try {
      let coverImage = req.file?.path;
      if (!coverImage) {
        return res.status(401).send("Please upload cover image!");
      }
  
      const coverImageUpload = await uploadFileOnCloudinary(coverImage);
      if (!coverImageUpload.url) {
        return res.status(401).send("Error in uploading cover image");
      }
  
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            coverImage: coverImageUpload.url,
          },
        },
        { new: true }
      ).select("-password");
  
      res.status(200).json({
        success: true,
        message: "Cover image updated successfully!",
        user: updatedUser,
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong while updating cover image, try again later!");
    }
  });

module.exports.updateAvatar = asyncHandler(async (req, res) => {
    try {
      let localAvatar = req.file?.path;
      if (!localAvatar) {
        return res.status(401).send("Please upload Avatar!");
      }
  
      const avatarUpload = await uploadFileOnCloudinary(localAvatar);
      if (!avatarUpload.url) {
        return res.status(401).send("Error in uploading cover image");
      }
  
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            avatar: avatarUpload.url,
          },
        },
        { new: true }
      ).select("-password");
  
      res.status(200).json({
        success: true,
        message: "Avatar updated successfully!",
        user: updatedUser,
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong while updating avatar, try again later!");
    }
});

module.exports.getUserChannelProfile = asyncHandler(async (req, res) => {
  try {    
    const username = req.query.username?.toLowerCase();
    
    if (!username) {
      return res.status(400).json({ message: "username is missing!" });
    }

    const channel = await userModel.aggregate([
      {
        $match: {
          userName: username,
        },
      },
      {
        $lookup: {
          from: "subscribers", // collection name must be lowercase
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscribers",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $addFields: {
          subscriberCounts: { $size: "$subscribers" },
          channelSubscribedToCounts: { $size: "$subscribedTo" },
          isSubscribed: {
            $cond: {
              if: { $in: [req.user?._id, "$subscribers.subscriber"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          fullName: 1,
          userName: 1,
          subscriberCounts: 1,
          channelSubscribedToCounts: 1,
          isSubscribed: 1,
          avatar: 1,
          coverImage: 1,
          email: 1,
        },
      },
    ]);

    if (!channel.length) {
      return res.status(400).send("channel does not exist");
    }

    return res.status(200).json({
      channel: channel[0], // return single object
      message: "user channel found successfully!",
    });
  } catch (error) {
    console.error(error); // important for debugging
    return res.status(500).json({ message: "something went wrong!" });
  }
});

module.exports.getUserHistory=asyncHandler(async(req,res)=>{
    const user=userModel.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"Video",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[{
                    $lookup:{
                        from:"User",
                        localField:"owner",
                        foreignField:"_id",
                        as:"owner",
                        pipeline:[{
                            $project:{
                                fullName:1,
                                userName:1,
                                avatar:1
                            }
                        }]
                    }
                },{
                    $addFields:{
                        owner:{
                            $first:"$owner"
                        }
                    }
                }]
            }
        }
    ])
    return res.status(200).json({
        data:user.watchHistory,
        message:"User History Fetched Successfully"
    })
})