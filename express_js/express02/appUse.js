const express = require("express");
const app = express();

function validateUser(req, res, next) {
    res.locals.validated = true;
    console.log("VALIDATED RUN!!");
    next();
}

// This will run validateUser on all path and all methods
app.use(validateUser)

// This will run validateUser on '/admin' path and all methods
app.use('/admin', validateUser)

// This will run validateUser on '/' path and GET method
app.get('/', validateUser)

app.get('/',(req, res, next) => {
    res.send("<h1>Main Page</h1>");
    console.log(res.locals.validated);

});

app.get('/admin', (req, res, next) => {
    res.send("<h1>Admin Page</h1>");
    console.log(res.locals.validated);
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});