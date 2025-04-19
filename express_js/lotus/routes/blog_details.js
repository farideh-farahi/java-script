const express = require("express")
const pool = require("../database/db")
const validateToken = require("../middleware/authmiddleware")

const router = express.Router()

router.get('/:id',validateToken, async(req, res) => {
    const blogId = req.params.id
    const user_id = req.user.id;
    try{

        const singleBlog = await pool.query("SELECT * FROM blogs WHERE id=$1 AND user_id=$2",[blogId, user_id])
        if (singleBlog.rows.length === 0){
            return res.status(404).json({success:false, msg: "Blog not found or you do not have access to this blog"})
        }

        res.json({success: true, blog : singleBlog.rows[0]})
    }catch(err){
        res.status(500).json({success: false, msg: "Error retrieving blog"})
    }
    
})

router.get('/:id', validateToken, async (req, res) => {
    const blogId = req.params.id;
    const user_id = req.user.id;
    
    try {
        const singleBlog = await pool.query("SELECT * FROM blogs WHERE id=$1 AND user_id=$2", [blogId, user_id]);
        if (singleBlog.rows.length === 0) {
            return res.status(404).json({ success: false, msg: "Blog not found or you do not have access to this blog" });
        }

        res.json({ success: true, blog: singleBlog.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, msg: "Error retrieving blog" });
    }
});

// Update Route
router.put('/update/:id', validateToken, async (req, res) => {
    const blogId = req.params.id;
    const user_id = req.user.id;
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ success: false, msg: "Title and content are required!" });
    }

    try {
        const blog = await pool.query("SELECT * FROM blogs WHERE id=$1 AND user_id=$2", [blogId, user_id]);

        if (blog.rows.length === 0) {
            return res.status(403).json({ success: false, msg: "You do not have permission to update this blog" });
        }
        const updatedBlog = await pool.query(
            "UPDATE blogs SET title=$1, content=$2 WHERE id=$3 AND user_id=$4 RETURNING *",
            [title, content, blogId, user_id]
        );

        res.json({ success: true, msg: "Blog updated successfully!", blog: updatedBlog.rows[0] });
    } catch (err) {
        console.error("Database error:", err.message);
        res.status(500).json({ success: false, msg: "Server error", error: err.message });
    }
});

module.exports = router;

module.exports = router