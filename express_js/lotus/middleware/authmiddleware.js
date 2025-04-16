const pool = require("../database/db");

// middleware/auth.js
function validateToken(req, res, next) {
    const token = req.headers["authorization"]?.split(' ')[1];
    console.log("Token from header:", token);
    if (!token) {
        return res.status(401).json({ success: false, msg: "No token provided" });
    }
    try{
        pool.query('select * from users where  token = $1', [token], (err, result) => {
            if (err){
                console.error("Token validation error:", err);
                return res. status(500).json({success : false, msg: "Server error"})
            }
            console.log("Query result:", result.rows);
            if(result.rows.length === 0 ) {
                return res.status(401).json({success: false, msg: "Invalid token"})
            }
            req.user = result.rows[0];
            if (!req.user.is_logged_in) {
                return res.status(401).json({ success: false, msg: "You are already logged out. Please log in again." });
            }
            next();
        })

    }catch(err){
        console.error("Error validating token:", err);
        res.status(500).json({ success: false, msg: "Server error", error: error.message });
    
    }
}

module.exports = validateToken;
