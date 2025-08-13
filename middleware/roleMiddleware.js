module.exports = (requiredRole) => {
    return(req, res, next) => {
        if(!req.user) {
            return res.status(401).json({error: 'User not authenticated'});
        }

        if(req.user.role !== requiredRole) {
            return res.status(403).json({error: `Access denied. Required role: ${requiredRole}`});
        }

        next();
    };
};