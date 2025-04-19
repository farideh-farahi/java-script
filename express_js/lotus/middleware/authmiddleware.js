const pool = require("../database/db");

function validateToken(req, res, next) {
    const token = req.headers["authorization"]?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ success: false, msg: "No token provided" });
    }
  
    pool.query('SELECT * FROM users WHERE token = $1', [token], (err, result) => {
      if (err) {
        console.error("Token validation error:", err);
        return res.status(500).json({ success: false, msg: "Server error" });
      }
  
      if (result.rows.length === 0) {
        return res.status(401).json({ success: false, msg: "Invalid token" });
      }
  
      req.user = result.rows[0]; // Attach user data (e.g., id, username) to `req.user`
      next();
    });
  }
module.exports = validateToken;
