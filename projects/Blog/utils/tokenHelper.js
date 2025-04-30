const crypto = require("crypto");

function generateToken(userId) {  
    return `${userId}-${crypto.randomBytes(32).toString("hex")}`;
}

module.exports = { generateToken };