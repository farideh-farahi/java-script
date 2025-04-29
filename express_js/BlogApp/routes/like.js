const { users, blogs, like_blog } = require("../database/models");
const validateToken = require("../middleware/authmiddleware");

//ROUTE FOR LIKING BLOG
router.post('/', validateToken, async (req, res) => {
  const { blog_id, like } = req.body; 
  const user_id = req.user.id; 
  if (!blog_id || typeof like !== 'boolean') {
    return res.status(400).json({ success: false, msg: "Missing or invalid Blog ID and 'like' value" });
  }

  try {
    const existingLike = await like_blog.findOne( {where : { blog_id, user_id }})

    if (like) {
      if (existingLike) {
        return res.status(400).json({ success: false, msg: "You have already liked this blog" });
      }const likeResult = await like_blog.create({ blog_id, user_id, liked: true });
      return res.json({ success: true, msg: "Blog liked successfully", like: likeResult });
    } else {
      if (!existingLike) {
        return res.status(404).json({ success: false, msg: "You have not liked this blog yet." });
      }

      await existingLike.destroy();
      return res.json({ success: true, msg: "Blog disliked successfully" });
    }

  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Server error during like/unlike operation",
      error: err.message });
  }
  
});

//ROUTE FOR SHOWING BLOGS THAT HAS BEEN LIKED
router.get('/', validateToken, async (req, res) => {

  try{
    const likedBlogs = await like_blog.findAll({ where: { liked: true } });


    if (likedBlogs.length === 0) {
      return res.status(200).json({ success: true, msg: "No blogs have been liked yet." });
    }

    res.json({ success: true, likedBlogs });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Server error while fetching liked blogs",
      error: err.message,
    });
  }
});

module.exports = router;