
const { SmsController } = require('../../http/controllers/admin/sms/sms.controller');
const { ProductController } = require('../../http/controllers/user/product/product.controller');
const { checkAdmin1 } = require('../../http/middlewares/checkAdmin');
const { VerifyAccessToken } = require('../../http/middlewares/verifyAccessToken');
const router = require('express').Router();


router.post('/getInventory',VerifyAccessToken,checkAdmin1,SmsController.getInventory)







module.exports = {
    AdminRoutes : router
}