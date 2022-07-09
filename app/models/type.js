const mongoose = require("mongoose");

const TypeProdSchema = new mongoose.Schema({
    title : {type : String,required : true},
}, {
    timestamps : true
});
const TypeModel = mongoose.model("typeProd", TypeProdSchema);
module.exports = {
    TypeModel
}