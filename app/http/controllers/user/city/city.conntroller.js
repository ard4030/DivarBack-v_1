const createError = require("http-errors");
const { CityModel } = require("../../../../models/city");
const Controller = require("../../controller")

class CityController extends Controller{

    async getAllCity(req,res,next){
        try {
         const result = await CityModel.find({})
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
 
 /*     async getCityById(req,res,next){
         try {
          const {parentID} = req.body
          const result = await CategoryModel.findOne({_id:parentID})
          console.log(result)
          
         } catch (error) {
             next(error)
         }
      } */
 
     async createCity(req,res,next){
         try {
             const {title} = req.body;
             let result = await CityModel.create({title})
             if(!result) throw {status:400,message:"افزودن شهر به مشکل مواجه شد"}
             return res.status(200).json({
                 status:200,
                 success:true,
                 message:"شهر  با موفقیت ایجاد شد"
             })  
         } catch (error) {
             next(error)
         }
     }
 
 


}

module.exports = {
   CityController: new CityController()
}