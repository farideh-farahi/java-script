const { User, Blog, LikeBlogs, sequelize } = require("../models");

// Like or Unlike a Blog
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

// Show All Details Blogs
const getBlogsWithLikes = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      attributes: [
        'id',
        'title',
        'content',
        [sequelize.fn('COUNT', sequelize.col('BlogLikes.blog_id')), 'like_count']
      ],
      group: ["Blog.id", "User.id"],
      include: [
        { model: User, attributes: ["username"] },
        {
          model: LikeBlogs,
          as: "BlogLikes",
          attributes: [],
          required: false,
        }
      ],
    });

    if (blogs.length === 0) {
      return res.status(200).json({ success: true, msg: "No blogs have been liked yet." });
    }

    res.json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error while fetching blogs and likes", error: err.message });
  }
};


module.exports = { likeBlog, getBlogsWithLikes };