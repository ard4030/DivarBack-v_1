const homeController = require('../../http/controllers/api/home.controller');
const { VerifyAccessToken } = require('../../http/middlewares/verifyAccessToken');
const router = require('express').Router();
/**
 * @swagger
 * tags:
 *    name : IndexPage
 *    description : This is Index Page
 */
/**
 * @swagger
 * /:
 *  get:                 
 *      summary: index of route
 *      tags : [IndexPage]
 *      description: Get All Data
 *      parameters:
 *          -   in: header
 *              name: access-token
 *              example: Bearer Your Token
 *      responses:
 *          200:
 *              description: success    
 *          404:
 *              description: not found
 *               
 */
router.post('/',VerifyAccessToken,homeController.indexPage)

module.exports = {
    HomeRoutes : router
}