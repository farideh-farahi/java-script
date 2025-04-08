const express = require("express")
const pool = require("../database/db")

const router = express.Router()

router.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login'); // Redirect to login if not logged in
    }

    res.render('new_post', { username: req.session.user.name, user_id: req.session.user.id });
});


router.post('/', async (req, res) => {
    console.log("Received POST request:", req.body);
    console.log("Request keys:", Object.keys(req.body)); // ✅ Log actual request keys

    const { title, content, user_id } = req.body;

    if (!title || !content || !user_id) {
        console.error("Missing required fields:", req.body);
        return res.status(400).send("Missing required fields!");
    }

    try {
        const newPost = await pool.query(
            "INSERT INTO blogs (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
            [title, content, user_id]
        );
        console.log("New post added:", newPost.rows[0]);
        res.redirect('/');
    } catch (err) {
        console.error("Database error:", err.message);
        res.status(500).send("Error creating blog: " + err.message);
    }
});



   
module.exports = router