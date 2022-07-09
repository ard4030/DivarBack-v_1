const createError = require("http-errors");
const { UserModel } = require("../../models/user");
const JWT = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET_KEY } = require("../../utils/constans");

function VerifyAccessToken(req,res,next){
    const headers = req.headers;
    const [bearer,token] = headers.accesstoken?.split(" ") || [];
    if(token && ["Bearer","bearer"].includes(bearer)){
        JWT.verify(token,ACCESS_TOKEN_SECRET_KEY,async (err,payload) => {
            if(err) return next(createError.Unauthorized("لطفا وارد حساب کاربری خود شوید"))
            const {mobile} = payload || {};
            const user = await UserModel.findOne({mobile} , {password : 0,otp:0})
            //کد های بالا اگر مقدارشون 0 قرار بدیم برنمیگردونه
            if(!user) return next(createError.Unauthorized("حساب کاربری یافت نشد"))
            req.user = user;
            return next()
        })
    }

   else return  next(createError.Unauthorized("لطفا وارد حساب کاربری خود شوید"))
}

module.exports = {
    VerifyAccessToken
}