const { User } = require("../models")
const bcrypt = require("bcrypt")
const { generateToken } = require("../utils/tokenHelper.js")

//Register User
const register = async (req, res) => {7
    const { username, email, password } = req.body

    if (!username || !email || !password){
        return res.status(400).json({success: false, msg: "Missing required field"})
    }

    try{
        const existingUser = await User.findOne({ where : {email}})
        if(existingUser){
            return res.status(409).json({success: false, msg: "This email is already register"})
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({username, email, password: hashPassword})
        return res.status(201).json({success: true, msg: "User registered successfully"})

    }catch(err){
        return res.status(500).json({success: false, msg: "Server error during registration", err})
    }
}
//Login user

const login = async (req, res) => {
    const {username, password} = req.body

    if (!username || !password){
        return res.status(400).json({success: false, msg: "Missing required field"})
    }
    try{
        const user = await User.findOne({ where: {username}})
        if(!user){
            return res.status(404).json({success:false, msg: "User don't exist"})
        }
        
        const isValid = await bcrypt.compare(password, user.password)
        if(!isValid){
            return res.status(401).json({success:false, msg: "Password is wrong"})
        }

        const token = generateToken(user.id)
        await user.update({ token })
        return res.json({ success: true, msg: "Login successful", token });


    }catch(err){
        return res.status(500).json({success: false, msg: "Server error during login", err})
    }
}

//Logout user
const logout = async (req, res) => {
    try{
        req.user.update({token: null})
        return res.status(200).json({success: true, msg: "Logout successful"})

    }catch(err){
        return res.status(500).json({success: false, msg: "Server error during logout", err})

    }
}

module.exports = {register, login, logout};