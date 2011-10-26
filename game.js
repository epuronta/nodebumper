function Game() {

    this.gamestate = new GameState();
    this.display = new GameDisplay();
    
    Game.prototype.initDisplay = function(container, height, width) {
        this.display.init(container, height, width);
    }
    
    Game.prototype.refreshDisplay = function() {
        this.display.drawState(this.gamestate);
    }
    
    Game.prototype.update = function() {
        this.gamestate.update();
    }

    function GameState() {
        this.players = [];
        
        GameState.prototype.addPlayer = function(p) {
            if(!(p instanceof Player)) throw "Cannot add player to playerstate - not Player";
        
            this.players.push(p);
        }
        
        GameState.prototype.removePlayer = function(p) {
            if(!(p instanceof Player)) throw "Cannot remove player from playerstate - not Player";
            
            var i = this.players.indexOf(p);
            if(i > -1) {
                this.players = this.players.splice(i, 1);
            }
        }
        
        GameState.prototype.update = function() {
            for(var i = 0; i < this.players.length; i++) {
                var p = this.players[i];
                
                p.avatar.move();
                p.avatar.accelerate();
            }
        }
    
    }
    
    function GameDisplay() {
        this.container = "";        
        this.canvas = "";
        this.context = "";
        
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
                var a = s.players[i].avatar;
                var p = a.position;
                var v = a.velocity;
                
                var x = p.elements[0];
                var y = p.elements[1];
                                
                c.beginPath();
                c.fillStyle = a.color;
                c.strokeStyle = a.color;
                c.arc(x,
                    y,
                    10,
                    0,
                    Math.PI * 2,
                    false);
                c.lineWidth = 3;
                c.stroke();
                
                /*c.fillRect(
                    a.position.elements[0],
                    a.position.elements[1],
                    5,
                    5
                );*/
                
            }
        
        }
        
    }
    
    
    
    function Player() {
        this.socket = "";
        this.avatar = "";
    }
    
    function Avatar(position, velocity) {
        if(!(position instanceof Vector)) throw "Position is not Vector";
        this.position = position;
        
        if(!(velocity instanceof Vector)) throw "Velocity is not Vector";
        this.velocity = velocity;
        
        this.thrustMagnitude = 1
        this.maxVelocity = 5;
        
        this.color = "#000000";
        var color='#';
        for (var i = 0; i < 6; i++) {
            color += Math.round(Math.random()*10 + 5).toString(16);
        }
        this.color = color;
            
        
        this.thrusters = {
            "up": { vector: Vector.create([0,1]), on: false },
            "down": { vector: Vector.create([0,-1]), on: false },
            "left": { vector: Vector.create([-1,0]), on: false },
            "right": { vector: Vector.create([1,0]), on: false }
        }
        
        Avatar.prototype.move = function() {
            this.position = this.position.add(this.velocity);
        }
        
        Avatar.prototype.accelerate = function() {
            var overallThrust = Vector.create([0,0]);
            for(var v in this.thrusters) {
                var thrust = this.thrusters[v];
                if(!thrust.on) continue;
                
                overallThrust = overallThrust.add( thrust.vector.multiply(this.thrustMagnitude) );
            }
            
            this.velocity = this.velocity.add(overallThrust);
            
            // Cap velocity
            if( Math.sqrt(this.velocity.dot(this.velocity)) > this.maxVelocity) {
                this.velocity = this.velocity.toUnitVector().multiply(this.maxVelocity);
            }
        }
    }
    
    
    
    
    Game.prototype.createTestGameState = function(playercount, width, height) {
    
        for(var i = 0; i < playercount; i++) {
        
            var player = new Player();
            
            var x = Math.random() * width;
            var y = Math.random() * height;
            
            var position = Vector.create([x,y]);
            var velocity = Vector.create([0,0]);
            
            var avatar = new Avatar(position, velocity);
            
            /*var color='#';
            for (var i = 0; i < 6; i++) {
                color += Math.round(Math.random()*14).toString(16);
            }
            avatar.color = color;*/
            
            player.avatar = avatar;
            
            this.gamestate.addPlayer(player);
        }

    }
    
    Game.prototype.updateTestGameState = function () {
        var s = this.gamestate;
        
        for(var i = 0; i < s.players.length; i++) {
            var a = s.players[i].avatar;
            
            for(var dir in a.thrusters) {
                a.thrusters[dir].on = (Math.random() > 0.5);
            }
           

        }
    }
    
    

























}

















