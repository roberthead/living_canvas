// Vector class
function Vector(xVelocity, yVelocity) {
  // per second
  this.xVelocity = xVelocity;
  this.yVelocity = yVelocity;
}

// Sound class
function Sound(id, uri) {
  var myself = this;
  this.id = id;

  this.register = function(uri) {
    createjs.Sound.registerSound(uri, this.id);
  };

  this.play = function(event) {
    createjs.Sound.play(myself.id);
  }

  this.register(uri);
}

function distance(x1, y1, x2, y2) {
  return Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2), 0.5);
}

// Circle class
function Circle(x, y, radius, color, sound) {
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
  }

  this.radius = radius;
  this.sound = sound;
  this.easelShape = this.defineEaselShape(x, y, radius, color);
  this.addClickSound(sound);

  var maxSpeed = 5;
  this.vector = new Vector(
    Math.random() * 2 * maxSpeed - maxSpeed,
    Math.random() * 2 * maxSpeed - maxSpeed
  );

  this.collidingWith = function(otherCircle) {

  }

  this.move = function(elapsedTime, stage) {
    this.easelShape.x = this.easelShape.x + this.vector.xVelocity * elapsedTime / 50.0;
    this.easelShape.y = this.easelShape.y + this.vector.yVelocity * elapsedTime / 50.0;
    var xMin = this.radius;
    var xMax = stage.canvas.width - this.radius;
    var yMin = this.radius;
    var yMax = stage.canvas.height - this.radius;
    if (this.easelShape.x < xMin) {
      console.log("too close to the left!");
      this.easelShape.x = xMin;
      this.vector.xVelocity = Math.abs(this.vector.xVelocity);
      this.playSound();
    } else if (this.easelShape.x > xMax) {
      console.log("too close to the right!");
      this.easelShape.x = xMax;
      this.vector.xVelocity = Math.abs(this.vector.xVelocity) * -1;
      this.playSound();
    }
    if (this.easelShape.y < yMin) {
      console.log("too close to the top!");
      this.easelShape.y = yMin;
      this.vector.yVelocity = Math.abs(this.vector.yVelocity);
      this.playSound();
    } else if (this.easelShape.y > yMax) {
      console.log("too close to the bottom!");
      this.easelShape.y = yMax;
      this.vector.yVelocity = Math.abs(this.vector.yVelocity) * -1;
      this.playSound();
    }
  }

  return this;
}

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

// Game singleton
var Game = {
  canvasId: "gameCanvas",
  circles: [],
  circleCount: 0,
  startTime: null,
  lastFrameTime: null,
  currentFrameTime: null,
  elapsedFrameTime: 0,
  elapsedTime: 0,
  secondsDisplay: 0,
  computedFPS: 0,
  counter: null,

  start: function() {
    this.stage = new createjs.Stage(this.canvasId);
    this.addCircle("#222277", "sounds/thunder.mp3");
    this.addCircle("#552200", "//s3-us-west-2.amazonaws.com/pagescape/BBCNNBC.mp3");
    this.addCounter();
    this.stage.update();
    window.requestAnimationFrame(this.executeFrame.bind(this));
  },

  executeFrame: function() {
    this.setFrameTimes();
    this.processMotion();
    this.drawFrame();
    window.requestAnimationFrame(this.executeFrame.bind(this));
  },

  setFrameTimes: function() {
    // all times in milliseconds
    // all absolute times in milliseconds since Epoch
    this.startTime = this.startTime || new Date().getTime();
    this.lastFrameTime = this.currentFrameTime || this.startTime;
    this.currentFrameTime = new Date().getTime();
    this.elapsedFrameTime = this.currentFrameTime - this.lastFrameTime;
    this.elapsedTime = this.currentFrameTime - this.startTime;
    // average two cycles to get framerate
    var currentFPS = this.elapsedFrameTime > 0 ? 1000.0 / this.elapsedFrameTime : 60;
    this.computedFPS = ((this.computedFPS || currentFPS) + currentFPS) / 2;
  },

  processMotion: function() {
    var elapsedSeconds = Math.floor(this.elapsedTime / 1000);
    if (this.secondsDisplay != elapsedSeconds) {
      this.secondsDisplay = elapsedSeconds;
      this.counter.update(this.secondsDisplay);
    }
    for (circle of this.circles) {
      circle.move(this.elapsedFrameTime, this.stage);
    }
  },

  drawFrame: function() {
    this.stage.update();
  },

  addCircle: function(color, soundUri) {
    this.circleCount++;
    var sound = new Sound("Sound" + this.circleCount, soundUri);
    var circle = new Circle(200 * this.circleCount, 100, 50, color, sound);
    this.circles.push(circle);
    this.stage.addChild(circle.easelShape);
  },

  addCounter: function() {
    this.counter = new Counter();
    this.stage.addChild(this.counter.easelShape);
  },

  log: function(content) {
    console.log(content);
  }
};

(function(window, document, undefined) {
  function start() {
    Game.start();
  }

  window.addEventListener('load', start, false);
})(window, document);
