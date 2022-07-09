const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({
    title : {type : String,required : true},
}, {
    timestamps : true
});
const CityModel = mongoose.model("city", CitySchema);
module.exports = {
    CityModel
}