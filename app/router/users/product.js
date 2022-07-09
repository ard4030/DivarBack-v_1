const { ProductController } = require('../../http/controllers/user/product/product.controller');
const { expressValidatorMapper } = require('../../http/middlewares/checkError');
const { VerifyAccessToken } = require('../../http/middlewares/verifyAccessToken');
const { ImageResize } = require('../../utils/imageresize');
const { uploadMulter } = require('../../utils/multer');
const {productValidator} = require("../../http/validators/user/product");
const { checkAdmin1 } = require('../../http/middlewares/checkAdmin');

const router = require('express').Router();


router.post('/getProduct',VerifyAccessToken,ProductController.getProduct)
router.post('/upload',VerifyAccessToken,uploadMulter.single("image"),ImageResize,ProductController.uploadImage)
router.post("/delete",VerifyAccessToken,ProductController.deleteImage)
router.post("/deleteImages",VerifyAccessToken,ProductController.deleteImages)
router.post("/createProduct",VerifyAccessToken,productValidator(),expressValidatorMapper,ProductController.createProduct)
router.post("/getProductById",VerifyAccessToken,ProductController.getProductById)
router.post("/deleteImagesMany",VerifyAccessToken,checkAdmin1,ProductController.deleteImagesMany)
router.post("/getAllProductCount",VerifyAccessToken,checkAdmin1,ProductController.getAllProductCount)
router.post("/getAllProduct",VerifyAccessToken,ProductController.getAllProduct)
router.post('/getProductsOnAdmin',VerifyAccessToken,checkAdmin1,ProductController.getProductsOnAdmin)
router.post('/updateProductOnAdmin',VerifyAccessToken,checkAdmin1,ProductController.updateProductOnAdmin)
router.post('/updateProductStatus',VerifyAccessToken,checkAdmin1,ProductController.updateProductStatus)
router.post('/getAllProductUser',VerifyAccessToken,ProductController.getAllProductUser)
router.post('/updateProduct',VerifyAccessToken,ProductController.updateProduct)
router.post('/getAllProductOkCount',VerifyAccessToken,ProductController.getAllProductOkCount)





module.exports = {
    ProductRoutes : router
}