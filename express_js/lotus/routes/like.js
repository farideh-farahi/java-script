const express = require("express");
const pool = require("../database/db");
const validateToken = require("../middleware/authmiddleware");
const router = express.Router();

//ROUTE FOR LIKING BLOG

router.post('/', validateToken, async (req, res) => {
  const { blog_id, like } = req.body; 
  const user_id = req.user.id; 

  if (!blog_id || typeof like !== 'boolean') {
    return res.status(400).json({ success: false, msg: "Missing or invalid Blog ID and 'like' value" });
  }

  try {
    const existingLike = await pool.query(
      "SELECT * FROM like_blog WHERE blog_id = $1 AND user_id = $2",
      [blog_id, user_id]
    );

    if (like) {
      if (existingLike.rows.length > 0) {
        return res.status(400).json({ success: false, msg: "You have already liked this blog" });
      }
      const likeResult = await pool.query(
        "INSERT INTO like_blog (blog_id, user_id, liked) VALUES ($1, $2, TRUE) RETURNING *",
        [blog_id, user_id]
      );

      return res.json({ success: true, msg: "Blog liked successfully", like: likeResult.rows[0] });
    } else {

      if (existingLike.rows.length === 0) {
        return res.status(404).json({ success: false, msg: "You have not liked this blog yet." });
      }

      await pool.query("DELETE FROM like_blog WHERE blog_id = $1 AND user_id = $2", [blog_id, user_id]);
      return res.json({ success: true, msg: "Blog disliked successfully" });
    }
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
});

//ROUTE FOR SHOWING BLOGS THAT HAS BEEN LIKED

router.get('/', validateToken, async (req, res) => {
  try{
  const likedBlogs = await pool.query("SELECT * FROM like_blog WHERE liked = TRUE")
  if(likedBlogs.rows.length === 0) {
    return res.status(200).json({ success: true, msg: "No blogs have been liked yet." });
  }
  res.json({success: true, likedBlogs: likedBlogs.rows})
}
  catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
})

module.exports = router;