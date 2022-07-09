const JWT = require('jsonwebtoken');
const createError = require('http-errors')
const {UserModel} = require("../models/user");
const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require('./constans');
const path = require("path")
const fs = require("fs")

function RandomNumberGenerator(){
    return Math.floor((Math.random() * 90000) + 10000)
}

function SignAccessToken(userId){
    return new Promise(async (resolve,reject) => {
        const user = await UserModel.findById(userId)
        const payload = {
            mobile: user.mobile,
        };
        const option = {
            expiresIn : "2d"
        };
        JWT.sign(payload,ACCESS_TOKEN_SECRET_KEY,option,(error,token) => {
            if(error) reject(createError.InternalServerError("خطای سیستمی"))
            resolve(token)
        })
    })
}

function SignRefreshToken(userId){
    return new Promise(async (resolve,reject) => {
        const user = await UserModel.findById(userId)
        const payload = {
            mobile: user.mobile,
        };
        const option = {
            expiresIn : "1y"
        };
        JWT.sign(payload,REFRESH_TOKEN_SECRET_KEY,option,(error,token) => {
            if(error) reject(createError.InternalServerError("خطای سیستمی"))
            resolve(token)
        })
    })
}

function VerifyRefreshToken(token){
       return new Promise((resolve,reject) => {
        JWT.verify(token,REFRESH_TOKEN_SECRET_KEY,async (err,payload) => {
            if(err) reject(createError.Unauthorized("لطفا وارد حساب کاربری خود شوید"))
            const {mobile} = payload || {};
            const user = await UserModel.findOne({mobile} , {password : 0,otp:0})
            if(!user) reject(createError.Unauthorized("حساب کاربری یافت نشد"))
            resolve(mobile)
        })
       })
}

function createUploadPath(mobile) {
    const userUploadId = mobile+""
    const uploadPath = path.join(__dirname,"..","..","public","imagUpload",userUploadId);
    fs.mkdirSync(uploadPath,{recursive:true});
    return path.join("public","imagUpload",userUploadId)
}

function createUrlImage(req) {
    const publicUrl = path.join(__dirname,"..","..") + "\\" 
    return publicUrl; 
}


module.exports = {
    RandomNumberGenerator,
    SignAccessToken,
    SignRefreshToken,
    VerifyRefreshToken,
    createUploadPath,
    createUrlImage
}