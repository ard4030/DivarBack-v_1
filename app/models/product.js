const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title : {type : String,required : true},
    category : {type : String, required : true},
    city : {type : String,required : true},
    price : {type : String},
    typee : {type : String, default : "عادی"},
    statu : {type : String , default : ""},
    mobile : {type : String , default : "",required:true},
    description : {type : String,required : true},
    images : {type : [String] , required : true},
    timee : {type : String},
    userCradit : {type : String,required:true},
    adminDesc : {type : String,default:''},
    status : {type : String,default:"1"},
    address : {type : String,default:"بدون آدرس"}
}, {
    timestamps : true
});
const ProductModel = mongoose.model("product", ProductSchema);
module.exports = {
    ProductModel
}