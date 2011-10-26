$(document).ready(function() {  
    var socket = io;
    socket = socket.connect("http://192.168.11.150:8000", {
        "reconnect": true,
        "reconnection delay": 5,
        "max reconnection attempts": 5
    });
    
    socket.on("announcement", function(data) {
        console.log(data);
        $("body").prepend( $("<code />").text(data.message) );
    });
    
    socket.on("disconnect", function(data) {
        console.log("Disconnected");
        $("body").prepend( $("<code />").text(data.message) );
    });
    
    socket.on("message", function(msg) {
        $("body").prepend( $("<p />").text(msg) );
    });
    
    socket.on("ping", function(msg) {
        console.log("Ping");
        socket.emit("pong", msg)
    });
    
});

var g = new Game();



var h = 800, w = 1500;
var cont = $("<div />");
$("body").append(cont);

g.initDisplay(cont, w, h);

g.createTestGameState(500, w, h);

g.update();
g.refreshDisplay();
setInterval(function() {

    g.updateTestGameState();

    g.update();
    g.refreshDisplay();
    
    console.log("Frame");
}, 30);