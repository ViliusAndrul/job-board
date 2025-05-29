const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    //check if token exists and starts with 'bearer'
    if(!authHeader || !authHeader.startWith('Bearer')) {
        return res.status(401).json({error: 'No token provided'});
    }

    //extracting the token from the header
    const token = authHeader.split(' ')[1];

    try { 
        //verifying the token using secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //attaching user info to the request object
        req.user = decoded;
        //moving to actual route handler
        next();
    } catch(err) {
        return req.status(401).json({error: 'Token is invalid or expired'});
    }
};