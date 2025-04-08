const express = require("express");
const pool = require("../database/db");

const router = express.Router();

router.get('/', async(req, res) => {
  try{
    const blogs = await pool.query('SELECT * FROM blogs ORDER BY ID DESC');
    res.render("index", {blogs : blogs.rows})

  }catch(err){
    res.status(500).send("Error retrieving blogs");
  }
})

module.exports = router