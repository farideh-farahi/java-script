const { User, Blog } = require("../database/models");
const validateToken = require("../middleware/authmiddleware");

//ROUTE FOR SHOWING ALL BLOGS TO EVERY USER
router.get('/all',validateToken, async(req, res) => {
  try{
    const blogs = await Blog.findAll({ where : { is_active: true } })
    if (blogs.length === 0) {
      return res.status(200).json({success: true, msg: "No blogs found"})
    } 
    res.json({success: true, blogs : blogs.rows})

  }catch(err){
    return res.status(500).json({
      success: false,
      msg: "Server error while fetching blogs",
      error: err.message})
  }
})

//ROUTE FOR SHOEING ALL BLOGS TO CREATOR
router.get('/',validateToken, async(req, res) => {
  const user_id = req.user.id 

  try{
    const blogs = await Blog.findAll({
      where : { user_id, is_active: true },
      order: [['id', 'DESC']]
    })
    if (blogs.length === 0) {
      return res.status(200).json({success: true, msg: "No blogs found"})
    }
    res.json({success: true, blogs})

  }catch(err) {
    res.status(500).json({ 
      success: false,
      msg: "Server error while fetching user's blogs",
      error: err.message });
  }
})

//ROUTE FOR CREATING BLOG
router.post('/',validateToken, async(req, res)=> {
  const { title, content, is_active} = req.body;
  if (!title || !content || typeof is_active !== "boolean") {
    return res.status(400).json({success:false, msg: "Invalid or missing required fields!"});
  }

  try {
    const user_id = req.user.id;
    const blog = await Blog.create({title, content, user_id, is_active})
    res.json({success: true, msg: "Blog created successfully", blog });

   }catch (err) {
    res.status(500).json({
      success: false,
      msg: "Server error while creating blog ",
      error: err.message});
  }
})

//ROUTE FOR SHOWING SINGLE BLOG TO CREATOR
router.get('/:id', validateToken, async (req, res) => {
  const blogId = req.params.id;
  const user_id = req.user.id
  try {
    const blog = await Blog.findOne({
      where : { id: blogId, user_id, is_active: true },
      include: [
        {
        model: User,
        attributes: ["username", "email"]
        }
      ]
    })

    if (!blog) {
      return res.status(404).json({ success: false, msg: "Blog not found or you do not have access to this blog" });
    }

    res.json({ success: true, blog });

  } catch (err) {
    res.status(500).json({ success: false,
      msg: "Server error while fetching the blog",
      error: err.message });
  }
});

//Route For Update Blog
router.put('/:id', validateToken, async (req, res) => {
  const blogId = req.params.id;
  const user_id = req.user.id;
  const { title, content , is_active} = req.body;
  if (!title || !content) {
      return res.status(400).json({ success: false, msg: "Title and content are required!" });
  }

  try {
      const blog = await Blog.findOne({ where: {id: blogId, user_id} })
      if (!blog) {
          return res.status(403).json({ success: false, msg: "You do not have permission to update this blog" });
      }

      await blog.update({ title, content, is_active })
      res.json({ success: true, msg: "Blog updated successfully!", blog });

  } catch (err) {
      res.status(500).json({
        success: false,
        msg: "Server error while updating blog",
        error: err.message });
  }
});

module.exports = router;
