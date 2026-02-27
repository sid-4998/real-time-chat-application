const jwt = require('jsonwebtoken');
const response = require('../utils/responseHandler');
const dotenv = require('dotenv');
dotenv.config();

const AuthMiddleware = (req,res,next) => {
    const auth_token = req.cookies?.authToken;

    if(!auth_token) {
        return response(res, 401, 'Unauthorized access');
    }

    try {
        const decode = jwt.verify(auth_token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch(error) {
        console.error(error.message);
        return response(res, 401, 'Invalid or expired token');
    }
}

module.exports = AuthMiddleware;