
const Controller = require("../../controller")

class SmsController extends Controller{

    async getInventory(req,res,next) {        
        try {
            const MelipayamakApi = require('melipayamak');
            const username = '09164524864';
            const password = '32edm46';
            const api = new MelipayamakApi(username,password);
            const smsRest = api.sms('soap');
            const x = await smsRest.getCredit();
            return res.status(200).json({
                status:200,
                success:true,
                data:x
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = {
   SmsController: new SmsController()
}