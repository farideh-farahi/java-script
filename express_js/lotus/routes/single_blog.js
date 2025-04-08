const express = require("express")
const pool = require("../database/db")

const router = express.Router()

router.get('/blog/:id', async(req, res) => {
    const blogId = req.params.id
    try{
        const singleBlog = await pool.query("SELECT * FROM blogs WHERE id=$1",[blogId])
        if (singleBlog.rows.length === 0){
            return res.status(404).send("blog not found")
        }
        res.render("single_blog", {blog : singleBlog.rows[0]})

    }catch(err){
        res.status(500).send("Error retrieving blog")
    }
})

module.exports = router