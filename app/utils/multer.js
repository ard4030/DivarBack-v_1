const createError = require("http-errors");
const multer = require("multer");
const path = require("path");
const { createUploadPath } = require("../utils/functions");


const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,createUploadPath(req.headers.mobile))
    },
    filename : (req,file,cb) => {
        const type = path.extname(file?.originalname || "")
        cb(null, Date.now() + type)
    }
})

function fileFilter(req,file,cb){
    const ext = path.extname(file.originalname);
    const mimtypes = [".jpg",".jpeg",".png"];
    if(mimtypes.includes(ext)){
        return cb(null,true)
    }

    return cb(createError.BadRequest("فرمت ارسال شده صحیح نیست"))

}
const maxSize = 12000000;
const uploadMulter = multer({storage,fileFilter,limits:{fileSize : maxSize}})


module.exports = {
    uploadMulter
}