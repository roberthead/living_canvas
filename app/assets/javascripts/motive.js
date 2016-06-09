// Circle class
function Motive(id, uri, color) {
  this.triggeredAt = null;
  this.radius = 10;
  this.sound = new SynchronizedSound(id, uri);
  this.circle = new Circle(this.radius, color, this.sound);

  this.distance = function(x1, y1, x2, y2) {
    return Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2), 0.5);
  }

  this.isInContactWith = function(circle) {
    var distance = this.distance(this.circle.easelShape.x, this.circle.easelShape.y, circle.easelShape.x, circle.easelShape.y);
    return distance < 60;
  }

  this.millisecondsSinceTriggered = function() {
    if (!this.triggeredAt) {
      return null;
    }
    return new Date().getTime() - this.triggeredAt;
  }

  this.readyToPlay = function() {
    return !this.triggeredAt || this.millisecondsSinceTriggered > 2000;
  }

  this.interactWith = function(circle, elapsedTime) {
    if (this.isInContactWith(circle)) {
      console.log("contact!");
      if (this.readyToPlay()) {
        console.log("ready to play!");
        console.log(this.sound);
        this.triggeredAt = new Date().getTime();
        this.sound.trigger(elapsedTime);
      }
    }
  }
}
