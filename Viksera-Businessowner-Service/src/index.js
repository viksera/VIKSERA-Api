const http = require("http");

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('business owner service is running ');
    res.end();
  }).listen(8000);