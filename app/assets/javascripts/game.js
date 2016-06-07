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

  this.easelShape = this.defineEaselShape(x, y, radius, color);
  this.addClickSound(sound);
}

// Game singleton
var Game = {
  canvasId: "gameCanvas",
  circleCount: 0,
  startTime: null,
  lastFrameTime: null,
  currentFrameTime: null,
  elapsedFrameTime: 0,
  elapsedTime: 0,
  secondsDisplay: 0,
  computedFPS: 0,

  start: function() {
    this.stage = new createjs.Stage(this.canvasId);
    this.addCircle("DeepSkyBlue", "sounds/thunder.mp3");
    this.addCircle("Red", "//s3-us-west-2.amazonaws.com/pagescape/BBCNNBC.mp3");
    this.stage.update();
    window.requestAnimationFrame(this.executeFrame.bind(this));
  },

  executeFrame: function() {
    this.setFrameTimes();
    this.processActions();
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

  processActions: function() {
    var elapsedSeconds = Math.floor(this.elapsedTime / 1000);
    if (this.secondsDisplay != elapsedSeconds) {
      this.secondsDisplay = elapsedSeconds;
      console.log("" + this.secondsDisplay + ": " + this.computedFPS + "fps")
    }
  },

  drawFrame: function() {
  },

  addCircle: function(color, soundUri) {
    this.circleCount++;
    this.sound = new Sound("Sound" + this.circleCount, soundUri);
    this.circle = new Circle(200 * this.circleCount, 100, 50, color, this.sound);
    this.stage.addChild(this.circle.easelShape);
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
