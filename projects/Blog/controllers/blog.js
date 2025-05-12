const {User, Blog,LikeBlogs ,sequelize} = require("../models");


//ROUTE FOR SHOWING ALL BLOGS TO EVERY USER
const getAllBlogs = async (req, res) => {
 try{
    const blogs = await Blog.findAll({
      where : { is_active: true },
      include: [{ model:User , attributes: ["username", "email"]}]
   })
    if (!blogs || blogs.length === 0) {
      return res.status(200).json({ success: true, msg: "No blogs found" });
  }
    res.json({ success: true, blogs });

 }catch(err){
    return res.status(500).json({success: false, msg: "Server error during showing all blogs"})
 }
}

//ROUTE FOR SHOEING ALL BLOGS TO CREATOR
const getUserBlogs = async (req, res) => {
   try{
      const blogs = await Blog.findAll({
         where : {writer : req.user.user_id},
         order: [["id", 'DESC']],
         include: [{ model:User , attributes: ["username", "email"]}]

      })

      if(blogs.length === 0){
         return res.status(200).json({ success: true, msg: "No blogs found" });
     }
     res.json({ success: true, blogs });

   }catch(err){
    res.status(500).json({ success: false, msg: "Server error while fetching user's blogs", error: err.message });
   }
}

//ROUTE FOR CREATING BLOG
const createBlog = async (req, res) => {
   const { title, content, is_active } = req.body;
   if(!title || !content || typeof is_active !== "boolean"){
      return res.status(400).json({ success: false, msg: "Invalid or missing required fields!" });
   }
console.log("Decoded user:", req.user);
   try {
      const writer = req.user.user_id;

      const blog = await sequelize.transaction(async (t) => {
         const newBlog = await Blog.create({ title, content, writer, is_active }, { transaction: t });

         await LikeBlogs.create({ blog_id: newBlog.id, user_id: writer, liked: false }, { transaction: t });

         return newBlog;
      });

      res.json({success: true, msg: "Blog created successfully", blog })
   }catch(err){
      res.status(500).json({ success: false, msg: "Server error while creating blog", error: err.message });
   }
}

//ROUTE FOR SHOWING SINGLE BLOG TO CREATOR
 const getSingleBlog = async (req, res) => {
   try{
   const blog = await Blog.findOne({
      where: {id: req.params.id, writer: req.user.user_id , is_active: true},
      include: [{ model: User, attributes: ["username", "email"] }]
   })
   if (!blog) {
      return res.status(404).json({ success: false, msg: "Blog not found or you do not have access to this blog" });
    }

    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error while fetching the blog", error: err.message });
  }
};

//Route For Update Blog
const updateBlog = async (req, res) => {
   const { title, content, is_active } = req.body;
 
   if (!title || !content) {
     return res.status(400).json({ success: false, msg: "Title and content are required!" });
   }
 
   try {
     const blog = await Blog.findOne({ where: { id: req.params.id, writer: req.user.user_id } });
 
     if (!blog) {
       return res.status(403).json({ success: false, msg: "You do not have permission to update this blog" });
     }
 
     await blog.update({ title, content, is_active });
 
     res.json({ success: true, msg: "Blog updated successfully!", blog });
   } catch (err) {
     res.status(500).json({ success: false, msg: "Server error while updating blog", error: err.message });
   }
 };
//ROUTE FOR DELETING BLOG BY color-interpolation-filters: 
const deleteBlog = async (req, res) => {
   const blog_id = req.params.id;

   try{
      const blog = await Blog.findOne({ where: { id: blog_id, writer: req.user.user_id } });
      if(!blog){
         return res.status(404).json({success: false, msg:"Blog not found or you do not have permission to delete this blog"})
      }

      await blog.destroy();
      res.json({ success: true, msg: "Blog deleted successfully!" });

   }catch(err){
     res.status(500).json({ success: false, msg: "Server error while deleting blog", error: err.message });
   }
}

module.exports = {getAllBlogs, getUserBlogs, createBlog, getSingleBlog, updateBlog, deleteBlog}