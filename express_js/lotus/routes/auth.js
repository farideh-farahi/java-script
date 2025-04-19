const express = require("express");
const pool = require("../database/db");
const bcrypt = require("bcrypt");
const validateToken = require("../middleware/authmiddleware");
const {generateToken} = require("../utils/tokenHelper")
const router = express.Router();

// LOGIN ROUTE
router.post('/login',async (req, res) => {

    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({success:false, msg: "Missing required fields!"});
    }

    try {
        const user = await pool.query('SELECT * FROM users WHERE username=$1', [username]);

        if (user.rows.length === 0) return res.status(404).json({ success: false, msg: "User Not Found" });

        const isValid = await bcrypt.compare(password, user.rows[0].password);
        if (!isValid) return res.status(401).json({ success: false, msg: "Invalid Password" });

        const token = generateToken();
        await pool.query('UPDATE users SET token = $1 WHERE id = $2', [token , user.rows[0].id])
        return res.json({ success: true, msg: "Login successful", token});
    } catch (err) {

        res.status(500).json({ success: false, msg: "Server error", error: err.message });
    }
});

//SING UP ROUTE
router.post('/register', async(req, res) => {

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ success: false, msg: "All fields are required!" });
    }
    const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValidation.test(email)) {
        return res.status(400).json({ success: false, msg: "Invalid email format!" });
    }

    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ success: false, msg: "Username already exists, please choose another one." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );

        return res.json({ success: true, msg: "You signed up successfully!" });

    } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).json({ success: false, msg: "Server error", error: error.message });
    }
});

//LOGOUT ROUTE

router.post('/logout', validateToken, async (req, res) => {
    try {
        const user_id = req.user.id;

        if (!req.user.token) {
            return res.json({ success:true , msg: "you are alradey logout"})
        }
        await pool.query('UPDATE users SET token = NULL WHERE id = $1', [user_id]); // Replace NULL with ''
        return res.json({ success: true, msg: 'Successfully logged out!' });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error", error: err.message });
    }
});

module.exports = router;
