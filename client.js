$(document).ready(function() {  
    var socket = io;
    socket = socket.connect("http://infinitum.dyndns.org:8000", {
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
        var pingmsg = "Latency"
        if(msg.latency) pingmsg += ": " + msg.latency + "ms";
        console.log(pingmsg);
        
        socket.emit("pong", msg)
    });
    
});

var g = new Game();



var h = 600, w = 600;
var cont = $("<div />");
$("body").append(cont);

g.initDisplay(cont, w, h);

g.createTestGameState(100, w, h);

var x = 100;
var y = 100;
var position = Vector.create([x,y]);
var velocity = Vector.create([0,0]);
var player = new Player("RealPlayer", position, velocity);
player.color = "#00ff00";
g.addPlayer(player);

x = w / 2;
y = h / 2;
position = Vector.create([x,y]);
velocity = Vector.create([0,0]);
var target = new Player("Target", position, velocity);
g.addPlayer(target);

var keytranslations = {
    37: "left", // left arrow
    65: "left", // a
    38: "up", // up arrow
    87: "up", // w
    39: "right", // right arrow
    68: "right", // d
    40: "down", // down arrow
    83: "down" // s
}

$(document).keydown(function(e){
    if(!keytranslations.hasOwnProperty(e.keyCode)) return;    
    player.toggleThruster(keytranslations[e.keyCode], true);
});
$(document).keyup(function(e){
    if(!keytranslations.hasOwnProperty(e.keyCode)) return;    
    player.toggleThruster(keytranslations[e.keyCode], false);
});


g.update();
g.refreshDisplay();
setInterval(function() {

    g.updateTestGameState(player);

    g.update();
    g.refreshDisplay();
    
    console.log("Frame");
}, 30);

