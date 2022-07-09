const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    title : {type : String,required : true},
    parent : {type : mongoose.Types.ObjectId,default:undefined , required:false},
}, {
    timestamps : true
});
const CategoryModel = mongoose.model("category", CategorySchema);
module.exports = {
    CategoryModel
}