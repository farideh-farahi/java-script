const { User, Blog, LikeBlogs, sequelize } = require("../models");

// ✅ Like or Unlike a Blog
const likeBlog = async (req, res) => {
  const { blog_id, like } = req.body;
  const user_id = req.user.id;

  if (!blog_id || typeof like !== "boolean") {
    return res.status(400).json({ success: false, msg: "Missing or invalid Blog ID and 'like' value" });
  }

  try {
    const existingLike = await LikeBlogs.findOne({ where: { blog_id, user_id } });

    if (like) {
      if (existingLike) {
        return res.status(400).json({ success: false, msg: "You have already liked this blog" });
      }
      const likeResult = await LikeBlogs.create({ blog_id, user_id, liked: true });
      return res.json({ success: true, msg: "Blog liked successfully", like: likeResult });
    } else {
      if (!existingLike) {
        return res.status(404).json({ success: false, msg: "You have not liked this blog yet." });
      }

      await existingLike.destroy();
      return res.json({ success: true, msg: "Blog disliked successfully" });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error during like/unlike operation", error: err.message });
  }
};

// ✅ Show All Liked Blogs
const getLikedBlogs = async (req, res) => {
  try {
    const likedBlogs = await LikeBlogs.findAll({
      attributes: [
        "blog_id",
        [sequelize.fn("COUNT", sequelize.col("blog_id")), "like_count"]
      ],
      where: { liked: true },
      group: ["blog_id", "Blog.id"],
      include: [{ model: Blog, attributes: ["title", "content"] }],
    });

    if (likedBlogs.length === 0) {
      return res.status(200).json({ success: true, msg: "No blogs have been liked yet." });
    }

    res.json({ success: true, likedBlogs });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error while fetching liked blogs", error: err.message });
  }
};

module.exports = { likeBlog, getLikedBlogs };