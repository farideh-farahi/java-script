const express = require("express")
const pool = require("../database/db")
const validateToken = require("../middleware/authmiddleware")

const router = express.Router()

router.get('/:id',validateToken, async(req, res) => {
    const blogId = req.params.id
    try{
        const user_id = req.user.id;

        const singleBlog = await pool.query("SELECT * FROM blogs WHERE id=$1 AND user_id=$2",[blogId, user_id])
        if (singleBlog.rows.length === 0){
            return res.status(404).json({success:false, msg: "Blog not found or you do not have access to this blog"})
        }

        res.json({success: true, blog : singleBlog.rows[0]})
    }catch(err){
        res.status(500).json({success: false, msg: "Error retrieving blog"})
    }
    
})

module.exports = router