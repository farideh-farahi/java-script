const express = require("express")
const pool = require("../database/db")

const router = express.Router()

router.get('/:id', async(req, res) => {
    const blogId = req.params.id
    try{
        const singleBlog = await pool.query("SELECT * FROM blogs WHERE id=$1",[blogId])
        if (singleBlog.rows.length === 0){
            return res.status(404).json({success:false, msg: "blog not found"})
        }
        res.json({success: true, blog : singleBlog.rows[0]})

    }catch(err){
        res.status(500).json({success: false, msg: "Error retrieving blog"})
    }
})

module.exports = router