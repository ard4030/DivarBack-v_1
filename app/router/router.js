const { AdminRoutes } = require('./admin/admin')
const { HomeRoutes } = require('./api')
const { UserAuthRoutes } = require('./users/auth')
const { CategoryRoutes } = require('./users/category')
const { CityRoutes } = require('./users/city')
const { ProductRoutes } = require('./users/product')
const { StatuRoutes } = require('./users/statu')
const { TypeRoutes } = require('./users/type')

const router = require('express').Router()

router.use('/user',UserAuthRoutes)
router.use('/product',ProductRoutes)
router.use('/category',CategoryRoutes)
router.use('/statu',StatuRoutes)
router.use('/city',CityRoutes)
router.use('/type',TypeRoutes)
router.use('/',HomeRoutes)

// AdminRoutes
router.use('/admin',AdminRoutes)


module.exports = {
    AllRoutes : router
}