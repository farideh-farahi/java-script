const { where } = require("sequelize");
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
  const { isLiked, userId, isUser } = req.query;
  try {
    const whereConditions = {};
    if (userId) {
      whereConditions.writer = userId;
    }

    const includeOptions = [
      {
        model: LikeBlogs,
        as: "BlogLikes",
        attributes: [],
        required: false
      },
    ];

    if (isUser === "true"){
      includeOptions.push({
        model: User,
        attributes: ["username"]
      })
    }

    const blogs = await Blog.findAll({
      attributes: [
        'id',
        'title',
        'content',
        [sequelize.fn("SUM", sequelize.literal('CASE WHEN "BlogLikes"."liked" = true THEN 1 ELSE 0 END')), "like_count"]
      ],
       group: ["Blog.id", ...(isUser === "true" ? ["User.id"] : [])],
      include: includeOptions,
      where: whereConditions,
      having: isLiked !== undefined 
      ? sequelize.literal(
        `SUM(CASE WHEN "BlogLikes"."liked" = true THEN 1 ELSE 0 END) ${
          isLiked == 1 ? ">" : "="
        } 0`
      ) 
        : undefined
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