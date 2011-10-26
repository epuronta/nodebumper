function Game() {

    this.gamestate = new GameState();

    function GameState() {
        this.players = [];
    
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
        }
    }
    
    
    
    
    Game.prototype.createTestGame = function() {
        var p1 = new Player();
        var a1 = new Avatar(Vector.create([100, 100]), Vector.create([1,1]));
        a1.thrusters.up.on = true;
        a1.move();
        a1.accelerate();
        p1.avatar = a1;
        
        
        var p2 = new Player();
        var a2 = new Avatar(Vector.create([150, 150]), Vector.create([-1,1]));
        p2.avatar = a2;
    }

























}

















