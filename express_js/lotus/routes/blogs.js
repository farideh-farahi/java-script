const express = require("express");
const pool = require("../database/db");

const router = express.Router();

router.get('/', async(req, res) => {
  try{
    const blogs = await pool.query('SELECT * FROM blogs ORDER BY ID DESC');
    if (blogs.rows.length ===0) {
      return res.json({success: true, msg: "No blogs found"})
    }

    res.json({success: true, blogs : blogs.rows})

  }catch(err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
})

router.post('/', async(req, res)=> {

  const { title, content , token} = req.body;

  if (!title || !content ) {
      return res.status(400).json({success:false, msg: "Missing required fields!"});
  }
  try {
    const user = await pool.query('SELECT * FROM users WHERE token=$1', [token]);

    if (user.rows.length === 0) return res.status(401).json({ success: false, msg: "Invalid token" });

    const user_id = user.rows[0].id;

    const newPost = await pool.query(
        "INSERT INTO blogs (title, content,user_id) VALUES ($1, $2, $3) RETURNING *",
        [title, content, user_id]
    );
    console.log("New post added:", newPost.rows[0]);
    res.json({success: true, msg: "Blog post created successfully", blog: newPost.rows[0] })
} catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({success: false, msg: "Server error: ", error: err.message});
}

})

module.exports = router;