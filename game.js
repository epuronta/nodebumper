function Game() {

    this.gamestate = new GameState();
    this.display = new GameDisplay();
    
    Game.prototype.initDisplay = function(container, height, width) {
        this.display.init(container, height, width);
    }
    
    Game.prototype.addPlayer = function(player) {
        this.gamestate.addPlayer(player);
    }
    
    Game.prototype.removePlayer = function(player) {
        this.gamestate.removePlayer(player);
    }
    
    Game.prototype.refreshDisplay = function() {
        this.display.drawState(this.gamestate);
    }
    
    Game.prototype.update = function() {
        this.gamestate.update();
    }

    function GameState() {
        this.players = [];
        
        this.playerDistances = [];
        
        GameState.prototype.addPlayer = function(p) {
            if(!(p instanceof Player)) throw "Cannot add player to playerstate - not Player";
            
            for(var i = 0; i < this.players.length; i++) {
                if(p == this.players[i]) {
                    throw "Can't add same player twice";
                }
            }
        
            this.players.push(p);
        }
        
        GameState.prototype.removePlayer = function(p) {
            if(!(p instanceof Player)) throw "Cannot remove player from playerstate - not Player";
            
            var i = this.players.indexOf(p);
            if(i > -1) {
                this.players = this.players.splice(i, 1);
            }
        }
        
        GameState.prototype.calculatePlayerDistances = function() {
            var distances = [];
            
            for(var i = 0; i < this.players.length; i++) {
                distances[i] = [];
                var p1 = this.players[i];
                for(var j = 0; j < this.players.length; j++) {
                    var p2 = this.players[j];
                    // Equal players, distance 0
                    if(p1 === p2) {
                        distances[i][j] = 0;
                        continue;
                    }
                    
                    // If calculation done already the other way around, use that
                    if(distances[j] && distances[j][i]) {
                        distances[i][j] = distances[j][i];
                        continue;
                    }             
                    
                    var d = p1.position.distanceFrom(p2.position);
                    distances[i][j] = d;
                }
            }
            
            this.playerDistances = distances;
        }
        
        GameState.prototype.update = function() {
        
            this.calculatePlayerDistances();
        
            // Calculate velocities for players
            for(var i = 0; i < this.players.length; i++) {
                var p = this.players[i];
                
                // Thrust + friction
                p.accelerate();
            
                // Collisions
                var collisions = [];
                var distances = this.playerDistances[i];
                p.colliding = false;
                for(var d = 0; d < distances.length; d++) {
                    if(d == i) continue;
                    var p2 = this.players[d];                    
                    if(distances[d] - p2.radius - p.radius < 0) {
                        p.colliding = true;
                        collisions.push(p2);
                    }
                }
                
                // Sum of colliders
                //console.log("Collisions: " + collisions.length);
                for(var j = 0; j < collisions.length; j++) {
                    var p2 = collisions[j];
                    
                    var difference = p2.velocity.subtract(p.velocity);
                    var impulseDirection = p.position.subtract(p2.position).toUnitVector();
                    var impactSpeed = difference.dot(impulseDirection);                    
                    var multiplier = Math.sqrt(Math.abs(impactSpeed) * p.mass * p2.mass);
                    var impulseVector = impulseDirection.multiply(multiplier);
                    p.velocity = p.velocity.add(impulseVector.multiply(1/p.mass));
                }
            
            }
            
            // Move all players
            for(var i = 0; i < this.players.length; i++) {
                var p = this.players[i];
                p.capVelocity();
                p.move();            
            }
        }
    
    }
    
    function GameDisplay() {
        this.container = "";        
        this.canvas = "";
        this.context = "";
        this.lineWidth = 4;
        
        // Prepare canvas in container
        GameDisplay.prototype.init = function(container, width, height) {
        
            container = $(container);
        
            if (container.length != 1 || container[0].tagName != "DIV") throw "Invalid container";
            this.container = container;
        
            this.canvas = $("<canvas />")
				.attr("width", width)
				.attr("height", height);
			this.container.append(this.canvas);
			this.ctx = this.canvas[0].getContext("2d");
        }
        
        // GameState s
        GameDisplay.prototype.drawState = function(s) {
            var c = this.ctx;
            
            c.clearRect(0, 0, this.canvas.attr("width"), this.canvas.attr("height"));
            
            
            // Draw players
            for(var i = 0; i < s.players.length; i++) {
                var pl = s.players[i];
                var p = pl.position;
                var v = pl.velocity;
                
                var x = p.elements[0];
                var y = p.elements[1];
                
                
                                
                c.beginPath();
                c.fillStyle = pl.colliding ? "red" : pl.color;
                c.fillStyle = pl.color;
                c.strokeStyle = pl.colliding ? "red" : pl.color;
                c.arc(x,
                    y,
                    pl.radius - this.lineWidth/2,
                    0,
                    Math.PI * 2,
                    false);
                c.lineWidth = this.lineWidth;
                //c.fill();
                c.stroke();
                c.fillText(pl.name, x - pl.radius, y - pl.radius - 2);
                
                /*c.beginPath();
                c.arc(x,
                    y,
                    pl.radius / 3,
                    0,
                    Math.PI * 2,
                    false);
                c.fillStyle = "#eeee00";
                c.fill();
                
                for(var t in pl.thrusters) {
                    var thrust = pl.thrusters[t];
                    if(thrust.on) {
                        c.beginPath();
                        c.strokeStyle = "#eeee00";
                        c.lineWidth = 6;
                        
                        
                        c.moveTo(x, y);
                        var point = p.subtract(thrust.vector.multiply(pl.radius + 2));                        
                        c.lineTo(point.elements[0], point.elements[1]);
                        c.stroke();
                        
                    }                    
                }*/
            }
        
        }
        
    }   
    
    
    Game.prototype.createTestGameState = function(playercount, width, height) {
    
        for(var i = 0; i < playercount; i++) {
            var x = Math.random() * width;
            var y = Math.random() * height;
            
            var position = Vector.create([x,y]);
            var velocity = Vector.create([0,0]);
            
            var player = new Player("Player" + i, position, velocity);
            
            /*var color='#';
            for (var i = 0; i < 6; i++) {
                color += Math.round(Math.random()*14).toString(16);
            }
            avatar.color = color;*/
            
            
            this.gamestate.addPlayer(player);
        }

    }
    
    Game.prototype.updateTestGameState = function (player) {
        var s = this.gamestate;
        
        for(var i = 0; i < s.players.length; i++) {
        
            if(s.players[i] == player) continue;
        
            var directions = ["up", "down", "left", "right"];
            for(var dir in directions) {
                s.players[i].toggleThruster(directions[dir], (Math.random() > 0.7));
            }
            
        }
    }
    
}


function Player(name, position, velocity) {
    
    if(!(position instanceof Vector)) {
        throw "Position is not Vector";
    }
    this.position = position;
    
    if(!(velocity instanceof Vector)) {
        throw "Velocity is not Vector";
    }
    
    this.socket = "";
    this.name = name;
    this.velocity = velocity;
    this.mass = 3;
    this.radius = Math.sqrt(this.mass) * 10;
    this.thrustMagnitude = 0.7;
    this.maxVelocity = 5;
    this.colliding = false;
    
    this.color = "#000000";
    var color='#';
    for (var i = 0; i < 6; i++) {
        color += Math.round(Math.random()*9 + 2).toString(16);
    }
    this.color = color;        
    
    this.thrusters = {
        "up": { vector: Vector.create([0,-1]), on: false },
        "down": { vector: Vector.create([0,1]), on: false },
        "left": { vector: Vector.create([-1,0]), on: false },
        "right": { vector: Vector.create([1,0]), on: false }
    }
    
    Player.prototype.move = function() {
        this.position = this.position.add(this.velocity);
    }
    
    Player.prototype.accelerate = function() {
        if(this.colliding) return;
        var steeringTotal = Vector.create([0,0]);
    
        var thrustersTotal = Vector.create([0,0]);                
        for(var v in this.thrusters) {
            var thrust = this.thrusters[v];
            if(!thrust.on) continue;            
            thrustersTotal = thrustersTotal.add( thrust.vector.multiply(this.thrustMagnitude) );
        }
        steeringTotal.add(thrustersTotal);
        
        var friction = this.velocity.subtract(this.velocity.multiply(0.02));
        
        this.velocity = thrustersTotal.add(friction);
    }
    
    Player.prototype.toggleThruster = function(dir, on) {
    
        if(!(dir == "up" || dir == "down" || dir == "left" || dir == "right")) throw "Invalid direction: " + dir;
    
        this.thrusters[dir].on = on;
    }
    
    Player.prototype.capVelocity = function() {
        if( Math.sqrt(this.velocity.dot(this.velocity)) > this.maxVelocity) {
            this.velocity = this.velocity.toUnitVector().multiply(this.maxVelocity);
        }
    }
}
