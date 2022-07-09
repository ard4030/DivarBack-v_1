const {TypeController} = require('../../http/controllers/user/type/type.controller');


const router = require('express').Router();


router.post('/getAll',TypeController.getAllTypes)
router.post('/createType',TypeController.createType)




module.exports = {
    TypeRoutes : router
}