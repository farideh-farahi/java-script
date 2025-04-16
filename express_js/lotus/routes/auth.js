const express = require("express");
const pool = require("../database/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validateToken = require("../middleware/authmiddleware");
const router = express.Router();

// LOGIN ROUTE
router.post('/login', async (req, res) => {

    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({success:false, msg: "Missing required fields!"});
    }

    try {
        const user = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
        if (user.rows.length === 0) return res.status(404).json({ success: false, msg: "User Not Found" });

        const isValid = await bcrypt.compare(password, user.rows[0].password);
        if (!isValid) return res.status(401).json({ success: false, msg: "Invalid Password" });
        await pool.query('UPDATE users SET is_logged_in = $1 WHERE id = $2', [true, user.rows[0].id])
        return res.json({ success: true, msg: "Login successful", token: user.rows[0].token});
    } catch (err) {

        res.status(500).json({ success: false, msg: "Server error", error: err.message });
    }
});

//SING UP ROUTE
router.post('/register', async(req, res) => {
    console.log("Token received in /login route:", req.userToken);
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ success: false, msg: "All fields are required!" });
    }

    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ success: false, msg: "Username already exists, please choose another one." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const token = crypto.randomBytes(32).toString("hex");
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password, token) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, hashedPassword, token]
        );

        return res.json({ success: true, msg: "You signed up successfully!", token });

    } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).json({ success: false, msg: "Server error", error: error.message });
    }
});

//LOGOUT ROUTE

router.post('/logout', validateToken, async (req, res) => {
    try {
        const user_id = req.user.id;
        const user_token = req.user.token;

        if (!req.user.is_logged_in) {
            return res.json({ success:true , msg: "you are alradey logout"})
        }
        await pool.query('UPDATE users SET is_logged_in = $1 WHERE id = $2', [false , user_id]); // Replace NULL with ''
        return res.json({ success: true, msg: 'Successfully logged out!' });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error", error: err.message });
    }
});

module.exports = router;
