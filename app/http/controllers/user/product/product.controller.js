const createError = require("http-errors");
const { CategoryModel } = require("../../../../models/category");
const { ProductModel } = require("../../../../models/product");
const { UploadModel } = require("../../../../models/upload")
const { createUrlImage } = require("../../../../utils/functions");
const Controller = require("../../controller");
const fs = require("fs")

class ProductController extends Controller{

    async getAllProduct(req,res,next){
        try {
            const {limit} = req.body;
            const result = await ProductModel.find({}).limit(limit)
            if(!result) throw {status:400,message:"خطا در دریافت اطلاعات"}
            return res.status(200).json({
                status:200,
                success:true,
                result
            })
        } catch (error) {
            next(error)
        }
    }

    async getProduct(req,res,next){
        try {
            const {title,category,statu,city,typee,offset} = req.body;
                const result2 = await CategoryModel.aggregate([
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

                
                 let titles = ["null","null","null","null","null","null"];
                result2.forEach(element => {
                    if(element.title === category){
                        element.children.map((row,index) => {
                            titles[index] = row.title
                           /*  titles.push() */
                        })
                        
                    }
                }); 


             const result = await ProductModel.find({
                title: {'$regex': title},
                 $or: [ 
                     {category:{'$regex': titles[0]}} ,
                      {category:{'$regex': titles[1]}},
                      {category:{'$regex': titles[2]}},
                      {category:{'$regex': titles[3]}},
                      {category:{'$regex': titles[4]}},
                      {category:{'$regex': titles[5]}},
                      {category:{'$regex': category}} ],  
                statu: {'$regex': statu},
                city: {'$regex': city},
                typee: {'$regex': typee},
                offset: {'$regex': offset},
                status:2
            }).skip(offset).limit(12).sort({_id:-1});

            return res.status(200).json({                  
               result
            })

        } catch (error) {
            next(error)
        }
    }

    async uploadImage(req,res,next) {
        try {
            const url = req.body.image.replace(/[\\\\]/gm, "/")
            const result = await UploadModel.create({url:url,mobile:req.user.mobile})
            if(!result) throw "مشکل "
            res.status(200).json({
                status:200,
                message:"آپلود انجام شد",
                success:true,
                data:url
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteImage(req,res,next){
       try { 
           const {urlImage} = req.body;     
           const baseUrl = createUrlImage(req);
           const imageUrl = urlImage.replace(/[\/\/]/gm,"\\") 
           const result =  await UploadModel.deleteOne({url:urlImage})
           if(!result) throw "مشکل"
           const fullUrl = baseUrl+imageUrl;
            fs.unlinkSync(fullUrl) 
           return res.status(200).json({
               status:200,
               success:true,
           })  
           
       } catch (error) {
           next(error)
       }
    }

    async deleteImages(req,res,next){
        try { 
            const {urlImages} = req.body;
            urlImages.forEach(async (row,index) => {
                const baseUrl = createUrlImage(req);
                const imageUrl = row.replace(/[\/\/]/gm,"\\") 
                await UploadModel.deleteOne({url:row})
                const fullUrl = baseUrl+imageUrl;
                if (fs.existsSync(fullUrl)) fs.unlinkSync(fullUrl) 
            })

            return res.status(200).json({
                status:200,
                success:true,
            })  
            
        } catch (error) {
            next(error)
        }
     }

    async createProduct(req,res,next){
        try {
            let {title,category,city,price,typee,statu,mobile,description,images,timee,address} = req.body;
            let typProd = "1"
            if(typee === "فوری")  typProd = "6";
            if(address == "" || address == " ") address = "بدون آدرس"

            const result = await ProductModel.create({
                title,category,city,price
                ,typee,statu,mobile,description
                ,images,timee,userCradit:req.user._id,address,status:typProd
            })
            if(!result) throw "مشکل در ایجاد آگهی . لطفا مجدد تلاش نمایید";
            const result2 = await UploadModel.updateMany({url:{$in :images}},{$set : {isUsed:true}})
            if(!result2) throw "مشکل در ایجاد آگهی . لطفا مجدد تلاش نمایید";

            return res.status(200).json({
                status:200,
                success:true,
                message:"آگهی شما با موفقیت ثبت شد"
            })
        } catch (error) {
            next(error)
        }
    }

    async getProductById(req,res,next){
        try {
            const {id} = req.body;
            const result = await ProductModel.find({_id:id});
            if(!result) throw {status:400,message:"خطا در دریافت اطلاعات"}
            res.status(200).json({
                status:200,
                success:true,
                result
            })
        } catch (error) {
            next(error)
        }
    }

    //For Delete Images Not USEd Only Admins
    async deleteImagesMany(req,res,next){
        try { 
            const result = await UploadModel.find({isUsed:false});
            if(result.length > 0) {
                result.forEach(async element => {
                    const baseUrl = createUrlImage(req);
                    const imageUrl = element.url.replace(/[\/\/]/gm,"\\") 
                    await UploadModel.deleteOne({url:element.url})
                    const fullUrl = baseUrl+imageUrl;
                    if (fs.existsSync(fullUrl)) fs.unlinkSync(fullUrl) 
                });

                return res.status(200).json({
                    message:"عملیات با موفقیت انجام شد",
                    success : true
                })
            }

            return res.status(200).json({
                message:"خطا در انجام عملیات",
                success : false
            })
            
            
            
        } catch (error) {
            next(error)
        }
     }

    async getAllProductCount(req,res,next){
        try {
         const result = await ProductModel.count()
          if(!result) throw {status:200,message:"حطا در دریافت"}
         return res.status(200).json({
             status:200,
             success:true,
             data:result
         }) 
         
        } catch (error) {
            next(error)
        }
    }

    async getAllProductOkCount(req,res,next){
        try {
         const result = await ProductModel.find({status:2}).count();
          if(!result) throw {status:200,message:"حطا در دریافت"}
         return res.status(200).json({
             status:200,
             success:true,
             data:result
         }) 
         
        } catch (error) {
            next(error)
        }
    }

    async getProductsOnAdmin(req,res,next){
        try {
            const {statu,mobile,typee,city,timee,title,offset} = req.body;
            const result = await ProductModel.find({
                statu: {'$regex': statu}, 
                mobile: {'$regex': mobile},
                city: {'$regex': city},
                typee: {'$regex': typee},
                timee: {'$regex': timee},
                title: {'$regex': title}
            }).skip(offset).limit(12).sort({_id:-1}); 
            return res.status(200).json({
                status:200,
                success:true,
                result
            })
        } catch (error) {
            next(error)
        }
    }

    async updateProductOnAdmin(req,res,next){
        try {
            const {_id,adminDesc} = req.body;
            const result = await ProductModel.updateOne({_id},{$set :{adminDesc:adminDesc}}).sort({'_id':-1})
            if(!result) throw{status:200,message:"خطا دردریافت اطلاعات"}
            return res.status(200).json({
                status:200,
                success:true,
                message:"اطلاعات با موفقیت بروز شد"
            })
        } catch (error) {
            next(error)
        }
    }

    async updateProductStatus(req,res,next){
        try {
            const {productId,statu} = req.body;
            const result = await ProductModel.updateOne({_id:productId},{$set :{status:statu}})
            if(!result) throw {status:400,message:"خطا در انجام عملیات"}
            return res.status(200).json({
                status:200,
                success:true,
            })
        } catch (error) {
            next(error)
        }
    }

    async getAllProductUser(req,res,next){
        try {
            const {mobile} = req.user;
            const result = await ProductModel.find({mobile}).sort({'_id':-1})
            if(!result) throw {status:400,message:"خطا در دریافت اطلاعات"}
            return res.status(200).json({
                status:200,
                success:true,
                data:result
            })
        } catch (error) {
            next(error)
        }
    }

    async updateProduct(req,res,next){
        try {
            const {title,category,city,price,typee,statu,description,images,timee,id,address} = req.body;
            let typProd = "1"
            if(typee === "فوری")  typProd = "6"      
            const result = await ProductModel.updateOne({_id:id},{$set :{
                status:typProd,
                title,category,city,price,typee,mobile:req.user.mobile,description,images,timee,address,statu
            }})
            if(!result) throw "مشکل در ایجاد آگهی . لطفا مجدد تلاش نمایید";
            return res.status(200).json({
                status:200,
                success:true,
                message:"آگهی شما با موفقیت ثبت شد"
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = {
    ProductController: new ProductController()
}