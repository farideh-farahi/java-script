const express = require("express");
const { likeBlog, getBlogsWithLikes } = require("../controllers/likeBlog");
const validateToken = require("../middleware/tokenValidation");

const router = express.Router();

router.post("/", validateToken, likeBlog); // Like/unlike a blog
router.get("/", validateToken, getBlogsWithLikes); //Show liked blogs

module.exports = router;