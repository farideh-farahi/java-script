const http = require("http");

const Server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200,{'Content-Type' : 'text/html'});
        res.write('<h1>This is home page</h1>');
        res.end();
    }
    else {
        res.writeHead(404,{'Content-Type' : 'text/html'});
        res.write('<h3>sorry the page does not exist</h3>');
        res.end();   
    }
})

Server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});