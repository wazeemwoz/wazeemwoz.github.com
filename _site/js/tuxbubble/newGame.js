var pause = true, width = 600, height = 500, platformHeight = 10, c = document.getElementById('c'), ctx = c.getContext('2d');
var myClouds = new Clouds(10,1), UP = 'a', DOWN = 'd', RIGHT = 'r', LEFT = 'l', arrows, score,gLoop,bLoop, breaking, luck;
var REGULAR = 1, BUSTER = 2, TIME = 3, BLACK = 4, timeStopped;
var luck_modifier = 0.00012;

c.width = width;
c.height = height;


function clear(){
    ctx.fillStyle = '#d0e7f9';
    ctx.beginPath();
    ctx.rect(0,0,width,height);
    ctx.closePath();
    ctx.fill();
}

function clamp(value, min, max){
    return value < min ? min : value > max ? max : value;
    /*if(Math.abs(value-a) < Math.abs(value-b)){
	return a;
    }
    return b;*/
}

function isCollisionCircleRect(x, y, radius, l, r, t, b){
    var closestX = clamp(x, l, r);
    var closestY = clamp(y, t, b);
    
    var distX = x - closestX;
    var distY = y - closestY;

    var distSqr = Math.pow(distX,2) + Math.pow(distY, 2);
    return (distSqr < (Math.pow(radius, 2)));
}

function Clouds(howManyCircles, speedOfMovement){

    this.speed = speedOfMovement;
    this.count = howManyCircles;
    this.circles = [];

    for (var i = 0; i < this.count; i++)
	this.circles.push([Math.random() * width, Math.random() * height, Math.random() * 100, Math.random() / 2]);

    this.DrawCircles = function(){
		for(var i = 0; i < this.count; i++) { 
			ctx.fillStyle = 'rgba(255,255,255, ' + this.circles[i][3] + ')';
			ctx.beginPath();
			ctx.arc(this.circles[i][0], this.circles[i][1], this.circles[i][2], 0, Math.PI * 2, true);

			ctx.closePath();
			ctx.fill();
		}
    };
	
    this.MoveCircles = function(deltaY){
		for (var i = 0; i < this.count; i++){
			if(this.circles[i][1] - this.circles[i][2] > height) {
				this.circles[i][0] = Math.random() * width;
				this.circles[i][2] = Math.random() * 100;
				this.circles[i][1] = 0 - this.circles[i][2];
				this.circles[i][3] = Math.random() / 2;
			}else{
				this.circles[i][1] += deltaY;
			}
		}
    };
};

var DrawFloor = function(){
    ctx.fillStyle="#4444FF";
    ctx.fillRect(0,height-platformHeight,width,height);
};

function Bubble(X, Y, size, speed, gravity, push, doBreak, type, freezeAmount){

    var me = this;
    me.size = size;
    me.Gravity = gravity;
    me.X = X;
    me.Y = Y;
    me.vert = push;
    me.horz = speed;
    me.c1 = "#FF0000";
    me.c2 = "#FF8888";
    me.doBreak = typeof doBreak !== 'undefined' ? doBreak : false;
    me.type = typeof type !== 'undefined' ? type : REGULAR;
	me.freezeAmount = freezeAmount;
    
    if(me.type == BUSTER){
		me.c1 = "#FFFF00";
		me.c2 = "#FFFF88";
	}else if(me.type == TIME){
		me.c1 = "#0000FF";
		me.c2 = "#8888FF";	
	}else if(me.type == BLACK){
		me.c1 = "#000000";
		me.c2 = "#888888";
	}
    
    me.Draw = function(){
		var grd=ctx.createRadialGradient(me.X,me.Y,me.size, me.X, me.Y, 2);
		grd.addColorStop(0,me.c1);
		grd.addColorStop(1,me.c2);
		ctx.fillStyle=grd;
		
		ctx.beginPath();
		ctx.arc(me.X,me.Y,me.size,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();/**/
		
    }

    me.ApplyGravity = function(){
		me.vert += me.Gravity;
		me.Y += me.vert;
		if(me.Y > height-platformHeight){
			me.vert = -10;
		}
    }

    me.MoveSide = function(){
		if(me.X + me.horz < 0 || me.X + me.horz > width){
			me.horz = me.horz * -1;
		}
		me.X += me.horz;
    }

    me.Move = function(){
		me.ApplyGravity();
		me.MoveSide();
    }
    
    me.ApplyBreaks = function(){
		if(doBreak == true){
			if(me.Y > (height-100) && me.vert > 0){
				return true;
			}
		}
		return false;
    }
}

function Container(){
    var me = this;
    me.length = 0;
	me.weight = 0;
    me.keymaker = 0;
    
    me.add = function(value) { 
		me[me.keymaker] = value;
		if(value.type == REGULAR){
			me.weight += value.size;
		}
		me.length++;
		me.keymaker++;
    }

    me.remove = function(key) {
    	if(me[key].type == REGULAR){
			if (me.hasOwnProperty(key)) { 
				if(me[key].size != 8){			
					//console.log("Creating " + me[key].size/2 + " " + (-(Math.abs(me[key].horz)+1)) + " " + (me[key].Gravity + ((me[key].size == 16) ? 0.2 : 0.1)));
					me.add(new Bubble(me[key].X-(me[key].size/2), me[key].Y, me[key].size/2, -(Math.abs(me[key].horz)+1), me[key].Gravity + ((me[key].size == 16) ? 0.2 : 0.1),-10,me[key].doBreak));
					//console.log("Creating " + me[key].size/2 + " " + (Math.abs(me[key].horz)+1) + " " + (me[key].Gravity + ((me[key].size == 16) ? 0.2 : 0.1)));
					me.add(new Bubble(me[key].X+(me[key].size/2), me[key].Y, me[key].size/2, Math.abs(me[key].horz)+1, me[key].Gravity + ((me[key].size == 16) ? 0.2 : 0.1),-10,me[key].doBreak));
				}
				me.weight -= me[key].size;
				if(!me[key].doBreak){
					luck += luck_modifier;
				}
				delete me[key]; 
				me.length--;
				score.Modify(5);
			}
		}else if(me[key].type == BUSTER){
			delete me[key];		
			me.length--;
			breakAll(true);
		}else if(me[key].type == TIME){
			timeStopped = true;
			bLoop = setTimeout(resumeTime, me[key].freezeAmount);
			delete me[key];			
			me.length--;
		}else if(me[key].type == BLACK){
			delete me[key];			
			me.length--;
			breakAll(false);
		}
    }
}

function Arrow(X, Y, spd){
    var me = this;
	me.ystart = height-platformHeight;;
    me.X = X;
    me.Y = Y;
    me.vert = spd;
    me.c1 = "#0000FF";
    me.c2 = "#8888FF";
    me.height = (height-platformHeight)-me.Y;
	me.width = 4;
	
    me.Draw = function(){
		//console.log("radial grad values :" + me.X + " " + me.Y  + " " + me.size);
		var grd=ctx.createRadialGradient(me.X,me.Y,16, me.X, me.Y, 2);
		grd.addColorStop(0,me.c1);
		grd.addColorStop(1,me.c2);
		ctx.fillStyle=grd;
		
		// Filled triangle  
		ctx.beginPath();  
		ctx.moveTo(me.X,me.Y);  
		ctx.lineTo(me.X-4,me.Y+4);  
		ctx.lineTo(me.X+4,me.Y+4);  
		ctx.fill();
		ctx.fillStyle=me.c1;
		ctx.fillRect(me.X-2,me.Y+4,4,me.height);
		//ctx.fillRect(me.left(),me.top(),me.right(),me.bottom());
		//ctx.fillRect(me.X-10,me.Y+20,me.x+10,me.ystart);
    }
	
	me.Move = function(){
		me.Y += -me.vert;
		me.height = (height-platformHeight)-me.Y;
    }
	 
	me.left = function(){ return me.X-5; }
	me.right = function(){ return me.X+5; }
	me.top = function(){ return me.Y; }
	me.bottom = function(){ return height; }
}

var player = new (function(){
    var me = this;
    me.width = 32;
    me.height = 32;
	me.colPadding = 5;
	me.frameRate = 4;
	me.arrSpeed = 5;
	me.speed = 5;
    me.col = "#00FF00";
    me.X = 0;
    me.Y = 0;
    me.imgLoc = "/img/tuxbubble/"

    me.init = function(){
		me.imgIndex = 0;
		me.counter = 0;
		me.isShooting = false;
		me.alive = true;
		me.frames = 1;
		me.actualFrame = 0;
		me.interval = 0;
		me.image = new Image();
		me.image.src = me.imgLoc + "r1.png";
		me.setPosition(~~((width+me.width)/2), height-(me.height+platformHeight));
	}
	
    me.setPosition = function(x,y){
		me.X = x;
		me.Y = y;
    }
    
	me.left = function(){ return me.X+me.colPadding; }
	me.right = function(){ return me.X+me.width-me.colPadding; }
	me.top = function(){ return me.Y+me.colPadding; }
	me.bottom = function(){ return me.Y+me.height; }
	
    me.draw = function(){
		try{
			ctx.fillStyle=me.col;
			//ctx.fillRect(me.X,me.Y,me.width,me.height);
			ctx.drawImage(me.image, 0, 0, me.width, me.height, me.X, me.Y, me.width, me.height);
		}catch(e) {};
		if(me.interval == 4){
			if(me.actualFrame == me.frames){
				me.actualFrame = 0;
			}else{
				me.actualFrame++;
			}
			me.interval = 0;
		}
		me.interval++;
    }

    me.moveLeft = function(){  
		if (me.X-me.speed > 0) {  
			//check whether the object is inside the screen  
			me.setPosition(me.X - me.speed, me.Y);
			me.counter++;
			if(me.frameRate == me.counter){
				me.imgIndex++;
				me.counter = 0;
			}
			if(me.imgIndex == 4){
				me.imgIndex = 0;
			}
			me.image.src = me.imgLoc + "l" + me.imgIndex + ".png";
			//console.log(me.imgIndex);
		}  
    }
  
    me.moveRight = function(){  
		if (me.X + me.width + me.speed < width) {  
			//check whether the object is inside the screen  			
			me.setPosition(me.X + me.speed, me.Y);
			me.counter++;
			if(me.frameRate == me.counter){
				me.imgIndex++;
				me.counter = 0;
			}
			if(me.imgIndex == 4){
				me.imgIndex = 0;
			}
			me.image.src = me.imgLoc + "r" + me.imgIndex + ".png";
		}  
    }/**/

	me.fireShot = function(){
		me.image.src = me.imgLoc + "s0.png";
		if(me.alive){
			if(arrows.arrow1 == undefined){
				arrows.arrow1 = new Arrow(me.X+(me.width/2), me.Y, me.arrSpeed);
			}else{
				if(arrows.arrow2 == undefined){
					arrows.arrow2 = new Arrow(me.X+(me.width/2), me.Y, me.arrSpeed);
				}
			}
		}
	}
	
    me.update = function() {
		if (Key.isDown(Key.LEFT)) me.moveLeft();
		if (Key.isDown(Key.RIGHT)) me.moveRight();
    };

})();

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

var Key = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
	SHOT: 32,
	PAUSE: 13,
	DEBUG: 80,
    
    isDown: function(keyCode) {
		return this._pressed[keyCode];
    },
	
    onKeydown: function(event) {
		if(event.keyCode == this.SHOT){
			if(player != undefined){
				player.fireShot();
			}
		}
	
		this._pressed[event.keyCode] = true;
    },
    
    onKeyup: function(event) {
		if(event.keyCode == this.PAUSE){
			if(!player.alive){
				reset();
			}else{
				pause = !pause;
			}
		}
	
		/*if(event.keyCode == this.DEBUG){
			breakAll();
		}*/
		
		delete this._pressed[event.keyCode];
    }
};


function isCollisionWithBubble(bubble, obj){
	if(bubble == undefined)
	{
		return false;
	}
	
	if(obj == undefined)
	{
		return false;
	}
	
	if(isCollisionCircleRect(bubble.X,bubble.Y, bubble.size, obj.left(), obj.right(), obj.top(), obj.bottom())){
		return true;
	}
	return false;
}

var GameLoop = function(){
	if(!pause && player.alive){
		clear();
		myClouds.MoveCircles(1);
		myClouds.DrawCircles();
		
		for(var ar in arrows){
			arrows[ar].Move();
			arrows[ar].Draw();
		}
			
		for(var i in bubbles){
			if(bubbles[i].hasOwnProperty('Move')){
				if(!timeStopped){
					bubbles[i].Move();
				}
				bubbles[i].Draw();
				
				for(var ar in arrows){
					if(isCollisionWithBubble(bubbles[i], arrows[ar])){
						bubbles.remove(i);
						delete arrows[ar]; 
					}
				}
				
				if(isCollisionWithBubble(bubbles[i], player)){
					player.alive = false;
					player.image.src = "";
				/*	bubbles[i].c1 = "#00FF00";
					player.col = "#FF0000";
				}else{
					bubbles[i].c1 = "#FF0000";
					player.col = "#00FF00";*/
				}
				
				if(bubbles[i] != undefined){
					if(bubbles[i].ApplyBreaks()){
						bubbles.remove(i);
					}
				}
			}
		}
		
		DrawFloor();
		//player.draw();
		player.update();
		if(window.breaking == false || bubbles.weight == 0){
			makeBubble();
			window.breaking = false;
		}
		player.draw();
		score.Draw();
	}
	gLoop = setTimeout(GameLoop, 1000 / 50);
}

function makeBubble(){
	threshold = 64+(Math.round((score.score+1)/100)*16);
	if(bubbles.weight < threshold){
		bubbles.add(new Bubble(Math.random() * width, 0, 64,1,0.2,0, false));
	}
	
	if(Math.random() < luck){
		bubbles.add(new Bubble(Math.random() * width, 0, 16,2,0.1,0,false, BUSTER));
		luck = 0;
	} 

	if(Math.random() < luck){
		bubbles.add(new Bubble(Math.random() * width, 0, 16,2,0.1,1,false, TIME, 5000));
		luck = 0;
	} 

	if(Math.random() < luck){
		bubbles.add(new Bubble(Math.random() * width, 0, 16,5,0.3,0,false, BLACK));
		luck = 0;
	} 
}

function Score(X, Y, score){
    var me = this;
    me.X = X;
    me.Y = Y;
	me.score = score;
    me.col = "#000000";
    
    me.Draw = function(){
		ctx.font="20px Georgia";
		ctx.fillStyle=me.col;
		ctx.fillText("Score: " + me.score,me.X,me.Y);
    }
	
	me.Modify = function(value){
		me.score += value;
	}
}

function reset(){
	window.pause = true;
	window.bubbles = new Container();
	window.arrows = new Object;
	window.score = new Score(10, 20, 0);
	player.init();
	window.pause = false;
	window.breaking = false;
	timeStopped = false;
	luck = 0;
	clear();
}

function breakAll(fullBreak){
	window.breaking = fullBreak;
	for(var i in bubbles){
		if(bubbles[i].hasOwnProperty('Move')){
			bubbles[i].doBreak = fullBreak;
			bubbles.remove(i);
		}
	}
}

function resumeTime(){
	timeStopped = false;
}

reset();
GameLoop();
