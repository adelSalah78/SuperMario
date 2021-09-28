var Land = function(id,width,left,top,height) {
	this.id = id;
	this.width = width;
	this.left = left;
	this.top = top;
	this.height = height;
	
	this.draw = function() {
		var land = document.createElement("div");
		land.setAttribute("id",this.id);
		land.setAttribute("style","z-index:-110;width:" + this.width+"px;background-color:black;position:absolute;left:"+this.left+"px;top:"+this.top+"px;height:"+this.height+"px");
		document.getElementById("map").appendChild(land);
	}
}