const pool = require("../database/db");

function validateToken(req, res, next) {
    const token = req.headers["authorization"]?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ success: false, msg: "No token provided" });
    }
  
    pool.query('SELECT * FROM users WHERE token = $1', [token], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, msg: "Server error", error: err.message });
      }
  
      if (result.rows.length === 0) {
        return res.status(401).json({ success: false, msg: "Invalid token" });
      }
  
      req.user = result.rows[0];
      next();
    });
  }
  
module.exports = validateToken;
