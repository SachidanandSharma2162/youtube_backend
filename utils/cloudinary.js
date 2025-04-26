var {v2:cloudinary}=require('cloudinary');
var fs=require('fs');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadFileOnCloudinary=async (filePath)=>{
    try {
        if(!filePath) {
            return null;
        }
        const result=await cloudinary.uploader.upload(filePath,{
            resource_type:'auto',
        })
        // the file from local storage uploaded to Cloudinary
        console.log('File uploaded to Cloudinary:', result.url);
        fs.unlinkSync(filePath); // delete the file from local storage
        return result;
    } catch (error) {
        fs.unlinkSync(filePath); // delete the file from local storage
        return null
    }
}

module.exports={uploadFileOnCloudinary}