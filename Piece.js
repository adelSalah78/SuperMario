var Piece = function(id,width,left,top,land) {
	this.id = "piece-"+id;
	this.width = width;
	this.left = left;
	this.top = top;
	this.height = land.height;
	
	this.draw = function() {
		var piece = document.createElement("div");
		piece.setAttribute("id",this.id);
		piece.setAttribute("style","width:" + this.width+"px;background-color:black;position:absolute;left:"+this.left+"px;top:"+this.top+"px;height:"+this.height+"px");
		document.getElementById("map").appendChild(piece);
	}
}