var express = require('express');
var router = express.Router();
var {isLoggedIn}=require('../middlewares/isLoggedIn') 
var {registerUser, loginUser,logoutUser, RefreshAccessToken}=require('../controllers/authController');
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
router.post('/refresh-token',RefreshAccessToken)
module.exports = router;
 