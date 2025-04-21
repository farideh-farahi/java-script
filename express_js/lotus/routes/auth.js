const { User } = require("../database/models")
const bcrypt = require("bcrypt");
const validateToken = require("../middleware/authmiddleware");
const {generateToken} = require("../utils/tokenHelper");

// LOGIN ROUTE
router.post('/login',async (req, res) => {

    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({success:false, msg: "Missing required fields!"});
    }

    try {
        const user = await User.findOne({ where : { username }})
        if (!user) return res.status(404).json({ success: false, msg: "User Not Found" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ success: false, msg: "Invalid Password" });

        const token = generateToken();
        await user.update({ token })
        return res.json({ success: true, msg: "Login successful", token});

    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Server error during login",
            error: err.message });
    }
});

//SING UP ROUTE
router.post('/register', async(req, res) => {

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ success: false, msg: "All fields are required!" });
    }

    const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValidation.test(email)) {
        return res.status(400).json({ success: false, msg: "Invalid email format!" });
    }

    try {
        const existingUserCheck = await User.findOne({ where: {username} });
        if (existingUserCheck) {
            return res.status(400).json({ success: false, msg: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({username, email, password: hashedPassword})
        return res.json({ success: true, msg: "You signed up successfully!" });

    } catch (err) {
        res.status(500).json({ success: false, msg: "Server error", error: err.message });
    }
});

//LOGOUT ROUTE
router.post('/logout', validateToken, async (req, res) => {
    try {
        const user = req.user
        if (!user.token) {
            return res.json({ success:true , msg: "You are already logged out"})
        }

        await User.update({ token : null }, { where: { id : user.id }})
        return res.json({ success: true, msg: 'Successfully logged out!' });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            msg: "Server error during logout ",
            error: err.message });
    }
});

module.exports = router;
