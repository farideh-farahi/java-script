const express = require('express');
const{register, login, logout} = require("../controllers/auth")
const validateToken = require ("../middleware/tokenValidation")

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/logout",validateToken, logout)


module.exports = router;
