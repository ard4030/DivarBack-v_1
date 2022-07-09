const createError = require("http-errors");
const { StatuModel } = require("../../../../models/statu");
const Controller = require("../../controller")

class StatuController extends Controller{

    async getAllStatus(req,res,next){
        try {
         const result = await StatuModel.find({})
         res.status(200).json({
             status:200,
             message:"اطلاعات دریافت شد",
             success:true,
             data:result
         })
        } catch (error) {
            next(error)
        }
     }
 
 
     async createStatu(req,res,next){
         try {
             const {title} = req.body;
             let result = await StatuModel.create({title})
             if(!result) throw {status:400,message:"افزودن وضعیت به مشکل مواجه شد"}
             return res.status(200).json({
                 status:200,
                 success:true,
                 message:"وضعیت  با موفقیت ایجاد شد"
             })  
         } catch (error) {
             next(error)
         }
     }
 


}

module.exports = {
    StatuController: new StatuController()
}