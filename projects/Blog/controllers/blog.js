const {User, Blog} = require("../models")

//ROUTE FOR SHOWING ALL BLOGS TO EVERY USER
const getAllBlogs = async (req, res) => {
 try{
    const blogs = await Blog.findAll({where : {is_active: true}})
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
         where : {writer : req.user.id, is_active: true},
         order: [["id", 'DESC']]
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

   try {
      const writer = req.user.id;
      const blog = await Blog.create({title, content, writer, is_active})

      res.json({success: true, msg: "Blog created successfully", blog })
   }catch(err){
      res.status(500).json({ success: false, msg: "Server error while creating blog", error: err.message });
   }
}

//ROUTE FOR SHOWING SINGLE BLOG TO CREATOR
 const getSingleBlog = async (req, res) => {
   try{
   const blog = await Blog.findOne({
      where: {id: req.params.id, writer: req.user.id, is_active: true},
      include: [{ model: User, attributes: ["username"] }]
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
     const blog = await Blog.findOne({ where: { id: req.params.id, writer: req.user.id } });
 
     if (!blog) {
       return res.status(403).json({ success: false, msg: "You do not have permission to update this blog" });
     }
 
     await blog.update({ title, content, is_active });
 
     res.json({ success: true, msg: "Blog updated successfully!", blog });
   } catch (err) {
     res.status(500).json({ success: false, msg: "Server error while updating blog", error: err.message });
   }
 };


module.exports = {getAllBlogs, getUserBlogs, createBlog, getSingleBlog, updateBlog}