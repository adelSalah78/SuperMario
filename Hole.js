var Hole = function(id,width,left,land) {
	this.id = "hole-"+id;
	this.width = width;
	this.left = left;
	this.top = land.top;
	this.height = land.height;
	
	this.draw = function() {
		var hole = document.createElement("div");
		hole.setAttribute("id",this.id);
		hole.setAttribute("style","z-index:-100;width:" + this.width+"px;background-color:white;position:absolute;left:"+this.left+"px;top:"+this.top+"px;height:"+20+"px");
		document.getElementById("map").appendChild(hole);
	}
}