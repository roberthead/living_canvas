function distance(x1, y1, x2, y2) {
  return Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2), 0.5);
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
