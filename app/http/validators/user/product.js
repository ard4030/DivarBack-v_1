
  const {body} = require("express-validator");  

  function productValidator(){
       return [
           body("title").isLength({min:5,max:20}).withMessage("موضوع آگهی حداقل 5 و حداکثر 20 کاراکتر"),
           body("description").isLength({min:15,max:2000}).withMessage("توضیحات حداقل 15 و حداکثر 2000 کاراکتر"),
           body("city").notEmpty().withMessage("لطفا یک شهر را انتخاب کنید"),
           body("price").custom((value,ctx) => {
             if((value+"").length > 4 ||  value == 0){return true}else{throw "قیمت حداقل 1000 یا توافقی"}
           }),
           body("images").custom((value,ctx) => {
             if(value.length < 1) throw "حداقل یک عکس را بارگزاری نمایید"
             if(value.length > 5) throw "تعداد تصاویر حداکثر 5 عکس"
             return true
           })
      ] 
  }
  
  module.exports = {
    productValidator
  }