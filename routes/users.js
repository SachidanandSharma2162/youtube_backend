var express = require('express');
var router = express.Router();
var {isLoggedIn}=require('../middlewares/isLoggedIn') 
var {
  registerUser, 
  loginUser,
  logoutUser, 
  RefreshAccessToken, 
  changeUserPassword, 
  updateUserDetails, 
  updateCoverImage,
  updateAvatar,
  getUserChannelProfile,
  getUserHistory}=require('../controllers/authController');
const upload = require('../middlewares/multerConfig');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});   

router.post('/register',upload.fields([
  {
    name: 'avatar',
    maxCount: 1
  },
  {
    name: 'coverImage',
    maxCount: 1
  },{

  }
]),registerUser)

router.post('/login', loginUser)
router.get('/logout', isLoggedIn, logoutUser)
router.post('/change-password',isLoggedIn,changeUserPassword);
router.post('/update-user',isLoggedIn,updateUserDetails);
router.post('/refresh-token',RefreshAccessToken)
router.post('/change-coverimage',upload.single("coverImage"),isLoggedIn,updateCoverImage);
router.post("/change-avatar",upload.single("avatar"),isLoggedIn,updateAvatar)
router.get("/profile",isLoggedIn,getUserChannelProfile);
router.get("/history",isLoggedIn,getUserHistory);
module.exports = router;
 