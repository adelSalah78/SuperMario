var Mario = function(direction,left,top,width,height) {
	this.direction = direction;
	this.left = left;
	this.top = top;
	this.width = width;
	this.height = height;
	
	const speed = 10;
	const jumpRate = 60;
	const fallRate = 5;
	
	const screenMargin = 100;
	
	this.jumpCount = 0;
	this.fallCount = 0;
	this.alreadyFall = false;
	
	this.isJumping = false;
	this.isMoving = false;
	
	this.moveInterval = null;
	
	this.windowStart = 0;
	this.windowEnd = window.innerWidth;
	
	this.holes = [];
	this.pieces = [];
	
	this.init = function(holes,pieces) {
		var mario = document.createElement("div");
		mario.setAttribute("id","mario");
		var imageUrl = "";
		imageUrl = "background-image: url('img/mario-still-right.jpg')";
		mario.setAttribute("style","z-index:-90;height:"+this.height+"px;width:" + this.width+"px;" + imageUrl + ";position:absolute;left:"+this.left+"px;top:"+this.top+"px;");
		document.getElementById("map").appendChild(mario);
		this.holes = holes;
		this.pieces = pieces;
	}
	
	this.fall = function(fallSpeed) {
		this.stop();
		if(this.alreadyFall == true)
			return;
		var imageUrl = "";
		if(this.direction === 'left') {
			imageUrl = "url('img/mario-still-left.jpg')";
		}
		else{
			imageUrl = "url('img/mario-still-right.jpg')";
		}
		
		document.getElementById('mario').style.backgroundImage = imageUrl;
		
		
		var interval = setInterval(function(){
			if(this.alreadyFall == true){
				this.fallCount = 0;
				clearInterval(interval);
				return;
			}
				
			if(this.fallCount<20){
				this.top-=fallRate;
			}
			else{
				this.top+=fallRate;
			}
			this.fallCount++;
			
			document.getElementById('mario').style.top = this.top+"px";
			if(this.fallCount == 80){
				this.fallCount = 0;
				clearInterval(interval);
				this.alreadyFall = true;
			}
			
		}.bind(this),fallSpeed);
	}
	
	this.setDirection = function(direction) {
		this.direction = direction;
	}
	
	this.isMarioFallInTheHole = function() {
		for(var i=0;i<this.holes.length;i++) {
			if(this.left>this.holes[i].left && this.left+this.width< this.holes[i].left + this.holes[i].width){
				return true;
			}
		}
		return false;
	}
	
	this.move = function() {
		if(gameOver == true){
			clearInterval(this.moveInterval);
			this.fall(20);
			music.stopHappy();
			music.playLose();
			return;
		}
		
		if(this.isJumping)
			return;
			
		var imageUrl = "";
		if(this.direction === 'left') {
			this.left = this.left<=0 ? 0 : this.left - speed;
			imageUrl = "url('img/mario-left.gif')";
		}
		else {
			this.left = this.left+this.width>=map.mapWidth ? map.mapWidth-this.width : this.left + speed;
			imageUrl = "url('img/mario-right.gif')";
		}
		document.getElementById('mario').style.left = this.left +'px';
		document.getElementById('mario').style.backgroundImage = imageUrl;
		
		if(this.isMarioFallInTheHole()){
			gameOver = true;
		}
		
		if(this.direction == 'right' && this.left>screenMargin){
			window.scrollTo(window.scrollX+speed,0);
		}
		else if(this.direction == 'left' && map.mapWidth - this.left+this.width > screenMargin+this.width) {
			window.scrollTo(window.scrollX-speed,0);
		}
	}
	
	this.stop = function() {
		if(this.isJumping)
			return;
		var imageUrl = "";
		if(this.direction === 'left') {
			imageUrl = "url('img/mario-still-left.jpg')";
		}
		else{
			imageUrl = "url('img/mario-still-right.jpg')";
		}
		document.getElementById('mario').style.backgroundImage = imageUrl;
	}	
	
	
	this.jump = function() {
		if(this.isJumping == true || gameOver == true)
			return;
		this.isJumping = true;
		var leftVar = 0;
		var imageUrl = "";
		if(this.direction == 'left'){
			leftVar-=speed;
			imageUrl = "url('img/mario-still-left.jpg')";
		}
		else{
			leftVar+=speed;
			imageUrl = "url('img/mario-still-right.jpg')";
		}
		
		document.getElementById('mario').style.backgroundImage = imageUrl;
		
		var interval = setInterval(function(){
			if(this.jumpCount<3){
				this.top-=jumpRate;
			}
			else{
				this.top+=jumpRate;
			}
			this.jumpCount++;
			if(this.isMoving && (!(this.left - leftVar<=0 || this.left + leftVar >= map.mapWidth))) {
				this.left += leftVar;
			}
			document.getElementById('mario').style.top = this.top+"px";
			document.getElementById('mario').style.left = this.left+"px";
			
			if(this.isMarioFallInTheHole() && parseInt(this.top + this.height) >= land.top){
				gameOver = true;
				this.jumpCount = 0;
				clearInterval(interval);
				clearInterval(this.moveInterval);
				this.fall(20);
				music.stopHappy();
				music.playLose();
				return;
			}
			if(this.jumpCount == 6){
				this.jumpCount = 0;
				clearInterval(interval);
				this.isJumping = false;
			}
		}.bind(this),100);
	}
	
	this.keyCodeForDirection=function() {
		if(this.direction == 'left') {
			return 37;
		}
		else {
			return 39;
		}
	}
}