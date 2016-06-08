// Counter class
function Counter() {
  this.color = "#999999";
  this.font = "20px Avenir";
  this.xPosition = 5;
  this.yPosition = 0;

  this.defineEaselShape = function() {
    var text = new createjs.Text("0", this.font, this.color);
    text.x = this.xPosition;
    text.y = this.yPosition;
    return text;
  }

  this.update = function(text) {
    this.easelShape.text = text;
  }

  this.easelShape = this.defineEaselShape();
}
