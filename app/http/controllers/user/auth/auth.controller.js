const createError = require("http-errors");
const { RandomNumberGenerator, SignAccessToken, VerifyRefreshToken, SignRefreshToken } = require("../../../../utils/functions");
const {getOtpSchema , checkOtpSchema} = require('../../../validators/user/auth.schema')
const {UserModel} = require('../../../../models/user');
const { EXPIRES_IN, USER_ROLE } = require("../../../../utils/constans");
const Controller = require("../../controller");
const { ProductModel } = require("../../../../models/product");
const { sendingSms } = require("../../../../utils/sendSMS");

class UserAuthController extends Controller{

   async getOtp(req,res,next){
        try {
            await getOtpSchema.validateAsync(req.body);
            const {mobile} = req.body;
            const code = RandomNumberGenerator();
            const resultSms = sendingSms(mobile,code);
            if(resultSms.success == false) throw {status:400,message:"خطا در ارسال اس ام اس"}  
            const result = await this.saveUser(mobile,code)
            if(!result) throw createError.Unauthorized("مشکل در ورود")
            return res.status(200).send({
                data : {
                    statusCode:200,
                    message : "کد اعتبار سنجی با موفقیت ارسال شد",
                    // code,
                    mobile
                }
            })
        } catch (error) {
            next(error)
        }
    } 

   async checkOtp(req,res,next){
       try {
           await checkOtpSchema.validateAsync(req.body)
           const {mobile , code} = req.body;
           const user = await UserModel.findOne({mobile})
           if(!user) throw createError.NotFound("کاربری یافت نشد");
           if(user.otp.code != code) throw createError.Unauthorized("کد ارسال شده صحیح نمیباشد");
           const now = Date.now();
           console.log(user.otp.expiresIn,now)
           if(+user.otp.expiresIn < now) throw createError.Unauthorized("کد شما منقضی شده است")
           const accessToken = await SignAccessToken(user._id);
           const refreshToken = await SignRefreshToken(user._id);
           return res.json({
               data:{
                accessToken , 
                refreshToken, 
                Role : user.Role
               }
           })
       } catch (error) {
           next(error)
       }
   } 

   async refreshToken(req,res,next){
       try {
           const {refreshToken} = req.body;
           const mobile = await VerifyRefreshToken(refreshToken)
           const user = await UserModel.findOne({mobile})
           const accessToken = await SignAccessToken(user._id)
           const newRefreshToken = await SignRefreshToken(user._id);
           return res.json({
               data: {
                accessToken,
                refreshToken : newRefreshToken

               }
           })

       } catch (error) {
           next(error)
       }
   }

   async saveUser(mobile,code){
        let otp = {
            code,
            expiresIn : EXPIRES_IN
        }
        const result = await this.checkExistUser(mobile);
        if(result){
          return (await this.updateUser(mobile,{otp}))
        }

        return !!(await UserModel.create({
            mobile,
            otp,
            Roles : [USER_ROLE]
        }))
   } 
   
   async checkExistUser(mobile){
        const user = await UserModel.findOne({mobile})
        return !!user
   }

   async updateUser(mobile,objectData = {}){
        Object.keys(objectData).forEach(key => {
            if([""," ",0,null,undefined,NaN,"0"].includes(objectData[key])) delete objectData[key]
        })
        const updateResult = UserModel.updateOne({mobile},{$set : objectData})
        return !!(await updateResult).modifiedCount
   }

   
   async saveBookmark(req,res,next){
    try {
        const {productId} = req.body;
        /*  await UserModel.updateOne({_id:userId},{$push :{bookmarks:productId}}*/
        const result = await UserModel.findOne({_id:req.user._id})
        if(!result) throw {status:400,message:"خطا در دریافت"}
        const isBookmark = result.bookmarks.includes(productId)
        return res.status(200).json({
            status:200,
            success:true,
            data : isBookmark
        })
        
    } catch (error) {
        next(error)
    }
   }

   async toggleBookmark(req,res,next){
        try {
            const {productId} = req.body;
            const result = await UserModel.findOne({_id:req.user._id});
            if(!result) throw {status:400,message:"خطا در دریافت"}
            const isBookmark = result.bookmarks.includes(productId);
            if(isBookmark){
                await UserModel.updateOne({_id:req.user._id},{$pull :{bookmarks:productId}})
            }else{
                await UserModel.updateOne({_id:req.user._id},{$push :{bookmarks:productId}})
            } 

            return res.status(200).json({
                status:200,
                success:true
            })



        } catch (error) {
            next(error)
        }
   }

   async getBookmarks(req,res,next){
    try {
        const result = await UserModel.findOne({_id:req.user._id})
        if(!result) throw {status:400,message:"خطا در انجام عملیات"}
        const result2 = await ProductModel.find({_id:{$in:result.bookmarks}})
        if(!result) throw {status:400,message:"خطا در انجام عملیات"}
        return res.status(200).json({
            status:200,
            success:true,
            data:result2
        })
        
        
    } catch (error) {
        next(error)
    }
   }

   async getUserProfile(req,res,next){
    try {
        const result = await UserModel.findOne({mobile:req.user.mobile})
        if(!result) throw "عملیات با خطا مواجه شد";
        res.status(200).json({
            status:200,
            success:true,
            data:result
        })
    } catch (error) {
        next(error)
    }
    }

    async updateProfile(req,res,next){
        try {
            const{name,birs,city,address,mobile} = req.body;
            const result = await UserModel.updateOne({mobile},{$set : {firts_name:name,birs,city,address}})
            if(!result) throw "آپدیت با مشکل مواجه شد"
            return res.status(200).json({
                status:200,
                success:true
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    UserAuthController: new UserAuthController()
}