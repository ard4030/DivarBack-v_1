const createError = require("http-errors");
const { authSchema } = require("../../validators/user/auth.schema");
const Controller = require("../controller");
 
module.exports = new (class HomeController extends Controller {

   async indexPage (req,res,next) {
            try {
                return res.status(200).json({
                    user:req.user
                })
            } catch (error) {
                next(error)
            }
    }

})();