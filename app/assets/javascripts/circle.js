// Circle class
function Circle(x, y, radius, color, sound, onBottom) {
  this.defineEaselShape = function(x, y, radius, color) {
    var circle = new createjs.Shape();
    circle.graphics.beginFill(color).drawCircle(0, 0, radius);
    circle.x = x;
    circle.y = y;
    return circle;
  }

  this.addClickSound = function(sound) {
    this.easelShape.addEventListener("click", sound.play);
  }

  this.playSound = function() {
    this.sound.play();
    this.sound.setVolume(Math.random());
  }

  this.radius = radius;
  this.sound = sound;
  this.easelShape = this.defineEaselShape(x, y, radius, color);
  this.addClickSound(sound);
  this.onBottom = onBottom;

  this.setOnBottom = function(onBottom) {
    this.onBottom = onBottom;
  }

  var maxSpeed = 5;
  this.vector = new Vector(
    Math.random() * 2 * maxSpeed - maxSpeed,
    Math.random() * 2 * maxSpeed - maxSpeed
  );
  if (this.vector.xVelocity < 0 && this.vector.xVelocity > -1) {
    this.vector.xVelocity = this.vector.xVelocity - 1.5;
  }
  if (this.vector.xVelocity > 0 && this.vector.xVelocity < 1) {
    this.vector.xVelocity = this.vector.xVelocity + 1.5;
  }
  if (this.vector.yVelocity < 0 && this.vector.yVelocity > -1) {
    this.vector.yVelocity = this.vector.yVelocity - 1.5;
  }
  if (this.vector.yVelocity > 0 && this.vector.yVelocity < 1) {
    this.vector.yVelocity = this.vector.yVelocity + 1.5;
  }

  this.move = function(elapsedTime, stage) {
    this.easelShape.x = this.easelShape.x + this.vector.xVelocity * elapsedTime / 50.0;
    this.easelShape.y = this.easelShape.y + this.vector.yVelocity * elapsedTime / 50.0;
    var xMin = this.radius;
    var xMax = stage.canvas.width - this.radius;
    var yMin = this.radius;
    var yMax = stage.canvas.height - this.radius;
    if (this.easelShape.x < xMin) {
      this.easelShape.x = xMin;
      this.vector.xVelocity = Math.abs(this.vector.xVelocity);
      // this.playSound();
    } else if (this.easelShape.x > xMax) {
      this.easelShape.x = xMax;
      this.vector.xVelocity = Math.abs(this.vector.xVelocity) * -1;
      // this.playSound();
    }
    if (this.easelShape.y < yMin) {
      this.easelShape.y = yMin;
      this.vector.yVelocity = Math.abs(this.vector.yVelocity);
      this.playSound();
    } else if (this.easelShape.y > yMax) {
      this.easelShape.y = yMax;
      this.vector.yVelocity = Math.abs(this.vector.yVelocity) * -1;
      if (this.onBottom) {
        this.onBottom();
      }
    }
  }

  return this;
}
