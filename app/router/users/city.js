const { CityController } = require('../../http/controllers/user/city/city.conntroller');

const router = require('express').Router();


router.post('/getAll',CityController.getAllCity)
router.post('/createCity',CityController.createCity)




module.exports = {
    CityRoutes : router
}