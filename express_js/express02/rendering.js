const path = require('path');

const express = require('express');
const app = express();

/*const helmet = require('helmet');
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
*/


app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded());

app.set('view engine' , 'ejs');
//app.set('view engine' , 'hbs');
//app.set('view engine' , 'pug');
app.set('views' , path.join(__dirname, 'views'));

function validateUser(req, res, next){
    res.locals.validate = true
    next()
}
app.use(validateUser)

app.get('/',(req, res, next) =>{
    res.render('index',/*{
        async: true,
        msg : "Succcess!",
        msg2 : "Failure",
        html : "<p><p/>"
    }*/);
})

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

