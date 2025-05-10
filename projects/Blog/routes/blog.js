const express = require("express");
const { getAllBlogs, getUserBlogs, createBlog, getSingleBlog, updateBlog, deleteBlog } = require("../controllers/blog");
const validateToken = require("../middleware/tokenValidation");

const router = express.Router();

router.get("/all", getAllBlogs);
router.get("/", validateToken, getUserBlogs);
router.post("/", validateToken, createBlog);
router.get("/:id", validateToken, getSingleBlog);
router.put("/:id", validateToken, updateBlog);
router.delete("/:id", validateToken, deleteBlog)

module.exports = router;