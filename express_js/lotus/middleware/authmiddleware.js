const { User } = require("../database/models");

async function validateToken(req, res, next) {
    const token = req.headers["authorization"]?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ success: false, msg: "No token provided" });
    }
    try{
      const foundUser = await User.findOne({ where: { token: token } });
      
      if(!foundUser) {
        return res.status(401).json({ success: false, msg: "Invalid token" });
      }
      req.user = foundUser;
      next();
    }
    catch(err) {
        return res.status(500).json({ 
        success: false, 
        msg: "Server error during token validation", 
        error: err.message });
      }
    }

module.exports = validateToken;
