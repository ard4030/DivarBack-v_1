 const Joi = require('@hapi/joi')
 
 const getOtpSchema = Joi.object({
     mobile : Joi.string().length(11).pattern(/^09[0-9]{9}$/).error(new Error("شماره موبایل صحیح نیست"))
 })

 const checkOtpSchema = Joi.object({
    mobile : Joi.string().length(11).pattern(/^09[0-9]{9}$/).error(new Error("شماره موبایل صحیح نیست")),
    code : Joi.string().min(4).max(6).error(new Error("کد ارسال شده صحیح نیست"))

})

 module.exports = {
    getOtpSchema,
    checkOtpSchema
 }