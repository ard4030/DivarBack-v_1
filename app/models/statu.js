const mongoose = require("mongoose");

const StatuSchema = new mongoose.Schema({
    title : {type : String,required : true},
}, {
    timestamps : true
});
const StatuModel = mongoose.model("statu", StatuSchema);
module.exports = {
    StatuModel
}