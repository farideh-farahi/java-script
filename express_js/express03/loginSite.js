const path = require('path');

const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');

const helmet = require('helmet');

app.use(helmet());
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                "script-src": ["'self'", "'unsafe-inline'"],
            },
        },
    })
);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));

app.use((req, res, next) => {
    if (req.query.msg === 'fail') {
        res.locals.msg = `Sorry`
    }else {
        res.locals.msg = ``
    }
    next()
})
app.param('id', (req, res, next, id) => {
    console.log("param called :",id);
    next();
})

app.get('/story/:id',(req, res, next) => {
    res.send(`<h1>this is story number ${req.params.id}</h1>`)
})

app.get('/',(req, res, next)=>{
    res.send('Sanity check')
});

app.get('/login',(req, res, next) => {
    res.render('login')
});

app.post('/process_login',(req, res, next) => {
    const username = req.body.username
    const password = req.body.password
    if (password === "x"){
        res.cookie('username', username)
        res.redirect('/welcome')
    }else{
        res.redirect('login?msg=fail')
    }
});

app.get('/welcome',(req, res, next) => {
    res.render('welcome',{
        username : req.cookies.username
    })
});

app.get('/logout',(req, res, next) => {
    res.clearCookie('username')
    res.redirect('/login')
});

app.listen(3000,() => {
    console.log("Server is running on http://localhost:3000");
});


