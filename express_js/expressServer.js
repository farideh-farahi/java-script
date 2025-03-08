const path = require("path")
const express = require("express");
const app = express();

app.use(express.static('public'))


app.all('/',(req, res) => {
    //res.send(`<h1>This is home page</h1>`)
    console.log(path.join(__dirname + '/node.html'))
    res.sendFile(path.join(__dirname + '/node.html'))
    
})

app.all('*', (req, res) => {
    res.send("Sorry!! the page does not exist")
})

app.listen(3000)
console.log('Server is running on http://localhost:3000');