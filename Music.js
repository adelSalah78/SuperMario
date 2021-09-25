var Music = function(happyCasePath,losePath) {
	this.happyCasePath = happyCasePath;
	this.losePath = losePath;
	this.isPlaying = false;
	
	this.happyMusic = new Audio(this.happyCasePath);
	this.loseMusic = new Audio(this.losePath);
	
	this.playHappyRepeated = function() {
		if(this.isPlaying)
			return;
		
		this.happyMusic.loop = true;
		this.happyMusic.play();
		this.isPlaying = true;
	}
	
	this.stopHappy = function() {
		this.happyMusic.pause();
		this.happyMusic.currentTime = 0;
	}
	
	this.playLose = function() {
		if(mario.alreadyFall == false)
			this.loseMusic.play();
	}
}