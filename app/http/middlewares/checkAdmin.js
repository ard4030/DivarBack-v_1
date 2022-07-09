
function checkAdmin1 (req,res,next) {
    if(!req.user.Roles.includes("ADMIN")){
        throw {
            status:401,
            message : "شما به این قسمت دسترسی ندارید"
        }
    }

    next()
}

module.exports = {
    checkAdmin1,
}