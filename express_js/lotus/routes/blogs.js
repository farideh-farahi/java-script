const express = require("express");
const pool = require("../database/db");
const validateToken = require("../middleware/authmiddleware");
const router = express.Router();

//ROUTE FOR SHOWING ALL BLOGS TO EVERY USER
router.get('/all',validateToken, async(req, res) => {
  try{
    const blogs = await pool.query("SELECT * FROM blogs WHERE is_active = TRUE")
    if (blogs.rows.length === 0) {
      return res.status(200).json({success: true, msg: "No blogs found"})
    } 
    res.json({success: true, blogs : blogs.rows})

  }catch(err){
    return res.status(500).json({success: false, msg: "Server error", error: err.message})
  }
})

//ROUTE FOR SHOEING ALL BLOGS TO CREATOR
router.get('/',validateToken, async(req, res) => {
  const user_id = req.user.id 

  try{
    const blogs = await pool.query(
      'SELECT * FROM blogs WHERE user_id = $1 AND is_active = TRUE ORDER BY ID DESC',
      [user_id]);
    if (blogs.rows.length === 0) {
      return res.status(200).json({success: true, msg: "No blogs found"})
    }

    res.json({success: true, blogs : blogs.rows})

  }catch(err) {
    res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
})

//ROUTE FOR SENDING NEW BLOG
router.post('/',validateToken, async(req, res)=> {
  const { title, content, is_active} = req.body;
  if (typeof is_active !== "boolean") {
    return res.status(400).json({ success: false, msg: "Invalid value for is_active. Must be TRUE or FALSE." });
  }

  if (!title || !content || !is_active) {
    return res.status(400).json({success:false, msg: "Missing required fields!"});
  }

  try {
    const user_id = req.user.id;
    const newBlog = await pool.query(
        "INSERT INTO blogs (title, content,user_id, is_active) VALUES ($1, $2, $3, $4) RETURNING *",
        [title, content, user_id, is_active]
    );
    res.json({success: true, msg: "Blog created successfully", blog: newBlog.rows[0] });

   }catch (err) {
    res.status(500).json({success: false, msg: "Server error: ", error: err.message});
  }

})

//ROUTE FOR SHOWING SINGLE BLOG TO CREATOR
router.get('/:id', validateToken, async (req, res) => {
  const blogId = req.params.id;

  try {
    // Query to fetch the blog along with user details
    const singleBlog = await pool.query(
      `SELECT 
         blogs.id AS blog_id,
         blogs.title,
         blogs.content,
         blogs.is_active,
         users.username AS author_username,
         users.email AS author_email
       FROM blogs
       INNER JOIN users ON blogs.user_id = users.id
       WHERE blogs.id = $1 AND blogs.is_active = TRUE`,
      [blogId]
    );

    if (singleBlog.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "Blog not found or you do not have access to this blog" });
    }

    res.json({ success: true, blog: singleBlog.rows[0] });

  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
});

//Route For Update Blog
router.put('/:id', validateToken, async (req, res) => {
  const blogId = req.params.id;
  const user_id = req.user.id;
  const { title, content , is_active} = req.body;
  if (!title || !content) {
      return res.status(400).json({ success: false, msg: "Title and content are required!" });
  }

  try {
      const blog = await pool.query("SELECT * FROM blogs WHERE id=$1 AND user_id=$2", [blogId, user_id]);
      if (blog.rows.length === 0) {
          return res.status(403).json({ success: false, msg: "You do not have permission to update this blog" });
      }

      const updatedBlog = await pool.query(
          "UPDATE blogs SET title=$1, content=$2, is_active=$3 WHERE id=$4 AND user_id=$5 RETURNING *",
          [title, content,is_active, blogId, user_id]
      );
      
      res.json({ success: true, msg: "Blog updated successfully!", blog: updatedBlog.rows[0] });

  } catch (err) {
      res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
});

module.exports = router;
