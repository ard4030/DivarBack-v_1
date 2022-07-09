const { UserAuthController } = require('../../http/controllers/user/auth/auth.controller');
const { VerifyAccessToken } = require('../../http/middlewares/verifyAccessToken');
const router = require('express').Router();


router.post('/get-otp',UserAuthController.getOtp)
router.post('/check-otp',UserAuthController.checkOtp)
router.post('/refresh-token',UserAuthController.refreshToken)
router.post('/saveBookmark',VerifyAccessToken,UserAuthController.saveBookmark)
router.post('/toggleBookmark',VerifyAccessToken,UserAuthController.toggleBookmark)
router.post('/getUserProfile',VerifyAccessToken,UserAuthController.getUserProfile)
router.post('/updateProfile',VerifyAccessToken,UserAuthController.updateProfile)
router.post('/getBookmarks',VerifyAccessToken,UserAuthController.getBookmarks)



module.exports = {
    UserAuthRoutes : router
}