const http = require("http");

const fs = require("fs")

const Server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200,{'Content-Type' : 'text/html'});
        const homePage = fs.readFileSync("node.html")
        res.write(homePage);
        res.end();
    }
    else if(req.url === '/nodeJs.png') {
        res.writeHead(200,{'Content-Type' : 'nodeJs/png'});
        const image = fs.readFileSync("nodeJs.png")
        res.write(image);
        res.end();}    
    else if(req.url === '/style.css') {
        res.writeHead(200,{'Content-Type' : 'text/css'});
        const style_css = fs.readFileSync("style.css")
        res.write(style_css);
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