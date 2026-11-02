const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({
            message: "Autentication token is required",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {userId: decoded.userId};
            return next();
    } catch (error) {
        console.error("jwt verification error:", error.message);
        return res.status(401).json({
            message: "Invaild or expired token",
        });
    }

   

   
        
    
}


module.exports = authMiddleware;