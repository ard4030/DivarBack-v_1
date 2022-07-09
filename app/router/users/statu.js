const { StatuController } = require('../../http/controllers/user/statu/statu.controller');

const router = require('express').Router();


router.post('/getAll',StatuController.getAllStatus)
router.post('/createStatu',StatuController.createStatu)




module.exports = {
    StatuRoutes : router
}