const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const userModel=require('../models/userModel');
const {asyncHandler}=require('../utils/asyncHandler');
const {uploadFileOnCloudinary}=require('../utils/cloudinary');

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