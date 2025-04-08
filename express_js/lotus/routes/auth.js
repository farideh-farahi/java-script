const express = require ("express");
const pool = require("../database/db");
const bcrypt = require ("bcrypt");

const router = express.Router()
//login route
router.get('/login',(req, res) => {
    res.render('login')
  });
  
  router.post('/login',async(req, res, next) => {
    const {username, password} = req.body;
    try {
      const user = await pool.query ('SELECT * FROM users WHERE username= $1', [username]);
      if (user.rows.length === 0)return next(new Error('User Not Found'));
      
        const isValid = await bcrypt.compare(password, user.rows[0].password);
        if (!isValid) return next(new Error('Password Is Wrong'));

        req.session.user = {
          id: user.rows[0].id, 
          name: user.rows[0].username
      };
  
        res.redirect('/');
    }catch (err) {
      next(err);
    }
  });
// register route
router.get('/register', (req, res) => {
    res.render('register')
});

router.post('/register', async(req, res, next) => {
    const {username,email, password} = req.body
    try{
        const existingUser = await pool.query('SELECT * FROM users WHERE username=$1', [username])
        if(existingUser.rows.length > 0) {
            return res.status(400).send('username has already exist, take another one')
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',[username, email, hashedPassword]);
        res.redirect('/auth/login')
    } catch(err){
        next(err);
    }
});

module.exports = router