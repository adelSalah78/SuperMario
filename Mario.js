var Mario = function(direction,left,top,width,height) {
	this.direction = direction;
	this.left = left;
	this.top = top;
	this.width = width;
	this.height = height;
	
	const moveSpeed = 1;
	const jumpSpeed = 1;
	const jumpDownMargin = 130;
	const jumpRate = 1;
	const fallRate = 5;
	
	const screenMargin = 200;
	
	this.jumpCount = 0;
	this.fallCount = 0;
	this.alreadyFall = false;
	
	this.isJumping = false;
	this.isMoving = false;
	this.isMarioHitSide = false;
	
	this.moveInterval = null;
	
	this.windowStart = 0;
	this.windowEnd = window.innerWidth;
	
	this.holes = [];
	this.pieces = [];
	
	this.currentPieceIndex = -1;
	
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
	
	this.moveOverPiece = function() {
		if(this.left+this.width<this.pieces[this.currentPieceIndex].left || 
		this.left>this.pieces[this.currentPieceIndex].left + this.pieces[this.currentPieceIndex].width) {
				this.currentPieceIndex = -1;
				var interval = setInterval(function(){
				this.top+=jumpRate;
				document.getElementById('mario').style.top = this.top+"px";
				document.getElementById('mario').style.left = this.left+"px";
				if(this.top + this.height == land.top){
							this.currentPieceIndex = -1;
							this.jumpCount = 0;
							clearInterval(interval);
							this.isJumping = false;
							return;
						}
				if(this.isHitPiecesFromUpSideWhileMovingOverPiece()) {
					this.jumpCount = 0;
					clearInterval(interval);
					this.isJumping = false;
				}
			}.bind(this),1);
		}
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
		if(this.currentPieceIndex != -1){ // Mario is over a piece now
			this.moveOverPiece();
		}
		
		if(this.isHitPiecesFromRightSide() || this.isHitPiecesFromLeftSide()){
			this.isMarioHitSide = true;
			return;
		}
		else
			this.isMarioHitSide = false;
			
		var imageUrl = "";
		if(this.direction === 'left') {
			this.left = this.left<=0 ? 0 : this.left - moveSpeed;
			imageUrl = "url('img/mario-left.gif')";
		}
		else {
			this.left = this.left+this.width>=map.mapWidth ? map.mapWidth-this.width : this.left + moveSpeed;
			imageUrl = "url('img/mario-right.gif')";
		}
		document.getElementById('mario').style.left = this.left +'px';
		document.getElementById('mario').style.backgroundImage = imageUrl;
		
		if(this.isMarioFallInTheHole() && parseInt(this.top + this.height) >= land.top){
			gameOver = true;
		}
		
		if(this.direction == 'right' && this.left>screenMargin){
			//window.scrollTo(window.scrollX + this.cameraSpeed,0);
			window.scrollTo(this.left-screenMargin,0);
		}
		else if(this.direction == 'left' && map.mapWidth - this.left+this.width > screenMargin+this.width) {
			//window.scrollTo(window.scrollX - this.cameraSpeed,0);
			window.scrollTo(this.left-screenMargin,0);
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

	

	this.isHitPiecesFromDownSide = function() {
		for(var i=0;i<this.pieces.length;i++) {
			if(i==this.currentPieceIndex)
				continue;
			if(this.top == this.pieces[i].top + this.pieces[i].height)
			{
				if(this.left+this.width > this.pieces[i].left && this.left+this.width<this.pieces[i].left+this.pieces[i].width){
					return true;
				}
				if(this.left>this.pieces[i].left && this.left<this.pieces[i].left + this.pieces[i].width){
					return true;
				}
			}
		}
		return false;
	}
	
	this.isHitPiecesFromLeftSide = function() {
		for(var i=0;i<this.pieces.length;i++) {
			if(this.left+this.width >= this.pieces[i].left &&  this.left+this.width<= this.pieces[i].left + this.pieces[i].width && this.direction == 'right'){
				if(this.pieces[i].top + this.pieces[i].height > this.top && this.pieces[i].top + this.pieces[i].height < this.top + this.height)
					return true;
			}
		}
		return false;
	}
	
	this.isHitPiecesFromRightSide = function() {
		for(var i=0;i<this.pieces.length;i++) {
			if(this.left <= this.pieces[i].left + this.pieces[i].width && this.left >=this.pieces[i].left && this.direction == 'left'){
				//console.log('hi')
				//console.log(this.pieces[i].top)
				//console.log(this.pieces[i].height)
				
				//console.log(this.top)
				//console.log(this.height)
				if(this.pieces[i].top + this.pieces[i].height > this.top && this.pieces[i].top + this.pieces[i].height < this.top + this.height){
					//console.log('hi2')
					return true;
				}
					
			}
		}
		return false;
	}

	
	this.isHitPiecesFromUpSideWhileJumping = function() {
		for(var i=0;i<this.pieces.length;i++) {
			if((this.top+this.height)==this.pieces[i].top && this.jumpCount > jumpDownMargin){
				if(this.left+this.width > this.pieces[i].left && this.left+this.width<this.pieces[i].left+this.pieces[i].width){
					this.currentPieceIndex = i;
					return true;
				}
				if(this.left>this.pieces[i].left && this.left<this.pieces[i].left + this.pieces[i].width){
					this.currentPieceIndex = i;
					return true;
				}
			}
		}
		return false;
	}

		
	this.isHitPiecesFromUpSideWhileMovingOverPiece = function() {
		for(var i=0;i<this.pieces.length;i++) {
			if((this.top+this.height)==this.pieces[i].top){
				if(this.left+this.width > this.pieces[i].left && this.left+this.width<this.pieces[i].left+this.pieces[i].width){
					this.currentPieceIndex = i;
					return true;
				}
				if(this.left>this.pieces[i].left && this.left<this.pieces[i].left + this.pieces[i].width){
					this.currentPieceIndex = i;
					return true;
				}
			}
		}
		return false;
	}
	
	this.jump = function() {
		if(this.isJumping == true || gameOver == true)
			return;
		if(this.isMarioHitSide)
			this.isMoving = false;
		this.isJumping = true;
		var leftVar = 0;
		var imageUrl = "";
		if(this.direction == 'left'){
			leftVar-=jumpSpeed;
			imageUrl = "url('img/mario-still-left.jpg')";
		}
		else{
			leftVar+=jumpSpeed;
			imageUrl = "url('img/mario-still-right.jpg')";
		}
		
		document.getElementById('mario').style.backgroundImage = imageUrl;
		
		var interval = setInterval(function(){
			var jumpingUp = false;
			if(this.isHitPiecesFromLeftSide() || this.isHitPiecesFromRightSide()) {
				console.log('hihihihihi');
				this.isMarioHitSide = true;
			}
			if(this.jumpCount<jumpDownMargin){
				this.top-=jumpRate;
				jumpingUp = true;
			}
			else{
				this.top+=jumpRate;
			}
			this.jumpCount++;
				
			if(!this.isMarioHitSide && this.isMoving && (!(this.left - leftVar<=0 || this.left + leftVar >= map.mapWidth))) {
				this.left += leftVar;
			}
			if(jumpingUp && this.isHitPiecesFromDownSide()){
				this.jumpCount = jumpDownMargin;
			}
			else if(this.isHitPiecesFromUpSideWhileJumping()) {
				this.jumpCount = 0;
				clearInterval(interval);
				this.isJumping = false;
				this.isMarioHitSide = false;
				document.getElementById('mario').style.top = this.top+"px";
				document.getElementById('mario').style.left = this.left+"px";
				return;
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
			if(this.top + this.height >= land.top){
				this.currentPieceIndex = -1;
				this.jumpCount = 0;
				clearInterval(interval);
				this.isJumping = false;
				this.isMarioHitSide = false;
			}
			
			if(this.isMoving && this.direction == 'right' && this.left>screenMargin){
				//window.scrollTo(window.scrollX + this.cameraSpeed,0);
				window.scrollTo(this.left-screenMargin,0);
			}
			else if(this.isMoving && this.direction == 'left' && map.mapWidth - this.left+this.width > screenMargin+this.width) {
				//window.scrollTo(window.scrollX - this.cameraSpeed,0);
				window.scrollTo(this.left-screenMargin,0);
			}
		}.bind(this),1);
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