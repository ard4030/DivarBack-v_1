const mongoose = require("mongoose");

const UploadSchema = new mongoose.Schema({
    url : {type : String,required : true},
    mobile : {type : String},
    isUsed : {type : Boolean  ,require :true, default : false}
}, {
    timestamps : true
});
const UploadModel = mongoose.model("upload", UploadSchema);
module.exports = {
    UploadModel
}