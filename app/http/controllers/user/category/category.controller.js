const { CategoryModel } = require("../../../../models/category")


class CategoryController {
    async getAllCategorys(req,res,next){
        try {
         const result = await CategoryModel.aggregate([
             {
                 $lookup : {
                     from :"categories",
                     localField:"_id",
                     foreignField:"parent",
                     as :"children"
                 }
             },{
                 $project :{
                     __v :0
                 }
             },{
                 $match : {
                     parent:undefined
                 }
             }
         ])
         res.status(200).json({
             status:200,
             success:true,
             data:result
         })
        } catch (error) {
            next(error)
        }
     }
 
     async getCategoryById(req,res,next){
         try {
          const {parentID} = req.body
          const result = await CategoryModel.findOne({_id:parentID})
          console.log(result)
          
         } catch (error) {
             next(error)
         }
      }

    async createCategory(req,res,next){
        try {
            let {title,parent} = req.body;
            let result = await CategoryModel.findOne({title})
            if(result) throw {status:400,message:"این دسته بندی قبلا ایجاد شده"};
            if(parent == 0) {
                result = await CategoryModel.create({title})
            }else{
                result = await CategoryModel.create({title,parent})
            }
            if(!result) throw {status:400,message:"افزودن دسته به مشکل مواجه شد"}
            return res.status(200).json({
                status:200,
                success:true,
                message:"دسته بندی با موفقیت ایجاد شد"
            })  
        } catch (error) {
            next(error)
        }
    }

    async getChild(req,res,next){
        const {id} = req.body;
        const result = await CategoryModel.find({parent:id})
        console.log(result)
    }

    async getAllParents(req,res,next){
        try {
            const {parentOne} = req.body;
            let parents = [];
            let par = parentOne;


             while (par != 0) {
                let result = await CategoryModel.findOne({_id:par})
                parents.push(result)
                par = result.parent; 
            } 
            res.status(200).json({
                status:200,
                success:true,
                message :"عملیات با موفقیت انجام شد",
                data : parents
            })
        } catch (error) {
             next(error) 
        }
    }

}

module.exports = {
    CategoryController : new CategoryController()
}