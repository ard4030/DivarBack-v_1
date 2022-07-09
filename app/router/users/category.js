const {CategoryController} = require('../../http/controllers/user/category/category.controller');
const { VerifyAccessToken } = require('../../http/middlewares/verifyAccessToken');
const { checkAdmin1 } = require('../../http/middlewares/checkAdmin');


const router = require('express').Router();


router.post('/getAllCategory',VerifyAccessToken,CategoryController.getAllCategorys)
router.post('/createCategory',VerifyAccessToken,checkAdmin1,CategoryController.createCategory)



module.exports = {
    CategoryRoutes : router
}