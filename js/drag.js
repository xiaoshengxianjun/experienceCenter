function Drag(id) {
	this.dom = document.getElementById(id);
	var self = this;
	this.dom.onmousedown = function(e) {
		self.fnMouseDown(e);
		return false;
	};
};
Drag.prototype.fnMouseDown = function(e) {
	var evt = e || window.event;
	this.l = evt.offsetX;
	this.t = evt.offsetY;
	var self = this;
	document.onmousemove = function(e) {
		self.fnMouseMove(e);
	};
	document.onmouseup = function() {
		self.fnMouseUp();
	};

}
Drag.prototype.fnMouseMove = function(e) {
	var evt = e || window.event;
	var toLeft = evt.clientX - this.l;
	var toTop = evt.clientY - this.t;

	this.dom.style.left = toLeft + "px";
	this.dom.style.top = toTop + "px";
}
Drag.prototype.fnMouseUp = function() {
	document.onmousemove = null;
	document.onmouseup = null;
}