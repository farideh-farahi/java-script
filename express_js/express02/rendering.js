const path = require('path');

const express = require('express');
const app = express();

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



app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded());

app.set('view engine' , 'ejs');
//app.set('view engine' , 'hbs');
//app.set('view engine' , 'pug');
app.set('view ' , path.join(__dirname, 'views'));

app.get('/',(req, res, next) =>{
    res.render('index');
})

app.listen(3000)
