const express = require('express');
const app = express();
const Port = 3030;

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.post('/hello', function(req, res){
   res.send("You just called the post method at '/hello'!\n");
});

app.listen(Port, () => {
    console.log('Server is running on http://localhost:3000');
})
