const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.authMiddleware = async(req, res, next) => {

    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET_KEY.toString(), 
            async(err, decodedToken) => {
                if(err){
                    res.json({authStatus : false, message : err.message});
                }else{
                    next();
                }
            }
        )
    }else{
        res.json({authStatus : false, message : 'Unauthorized!! Login to continue'});
    }

}