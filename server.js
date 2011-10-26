require("./sylvester.src.js");

var http = require("http")
    ,url = require("url")
    ,fs = require("fs")
    ,path = require("path")
    ,sys = require("sys")
    ,socketio = require("socket.io");
    

// Main request handler for HTTP server
var handleHttpRequest = function (request, response) {
    //console.log("Incoming request: " + request.url);

    try {
        // Parse requested file name from request url
        var requestPath = url.parse(request.url).pathname;
        
        // Site root defaults to client.htm
        if(requestPath == "/") requestPath = "/client.htm";
        
        
        // Serve files only from inside server directory
        var realPath = path.join(__dirname, path.normalize(requestPath));
        if(path.basename(realPath) != "") { // Actual file requested
        
            path.exists(realPath, function(fileExists) {
                if(!fileExists) {
                    response.writeHead(404);
                    response.end();
                } else {
                
                    fs.readFile(realPath, "ascii", function(err, data) {
                        if(err) {
                            response.writeHead(404);
                            response.end();
                        } else {
                        
                            var contenttypes = {
                                ".js": "application/javascript"
                                ,".htm": "text/html"
                                ,".html": "text/html"
                                ,".css": "text/css"
                            };

                            response.writeHead(200, {
                                "Content-Type": contenttypes[path.extname(realPath)] ? contenttypes[path.extname(realPath)] : "text/plain"
                            });
                            response.write(data);
                            response.end();
                        }
                
                    });
                }
            });
        }        
        
    } catch(e) {
        console.log("Error occurred: " + e);
        response.write(500);
        response.end();
    }
}
// Create server, map it to function above
var server = http.createServer(handleHttpRequest);
server.listen(8000);
console.log("HTTP server running in port 8000.");


var io = socketio.listen(server);
io.set("log level", 1);
io.sockets.on("connection", function(socket) {
    io.sockets.emit("announcement", { message: "User connected" });

    socket.on("message", function(msg) {
        io.sockets.emit("message", msg)
        console.log(msg);
    });
    
    socket.on("disconnect", function() {
        io.sockets.emit("announcement", { message: "User disconnected" });
    });

    socket.on("pong", function(msg) {
        if(msg.timestamp) {
            var latency = (new Date()).getTime() - msg.timestamp;
            console.log( "Latency from " + socket.handshake.address.address + ": " + latency);
            //console.log("Latency: " + latency);
            socket.set("latency", latency);
        }
    });
    
});

setInterval(function() {
    io.sockets.emit("ping", { timestamp: (new Date()).getTime() });
}, 1000);





















