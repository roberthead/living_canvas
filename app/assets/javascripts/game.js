function distance(x1, y1, x2, y2) {
  return Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2), 0.5);
}

// Game singleton
var Game = {
  canvasId: "gameCanvas",
  circles: [],
  motives: [],
  circleCount: 0,
  startTime: null,
  lastFrameTime: null,
  currentFrameTime: null,
  elapsedFrameTime: 0,
  elapsedTime: 0,
  secondsDisplay: 0,
  computedFPS: 0,
  counter: null,
  nightSounds: null,
  daySounds: null,
  drumTrack: null,
  drumTail: null,
  stingerSound: null,

  start: function() {
    this.stage = new createjs.Stage(this.canvasId);
    this.addCircle("Orange", "sounds/thunder.mp3");
    this.stingerSound = new SynchronizedSound("Stinger", "//s3-us-west-2.amazonaws.com/pagescape/BBCNNBC.mp3", null);
    // this.addCircle("#552200", "//s3-us-west-2.amazonaws.com/pagescape/BBCNNBC.mp3");
    this.addCounter();
    this.addNightSounds();
    this.addDaySounds();
    this.addDrumTrack();
    this.addMotives();
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
    if (elapsedSeconds > 0) {
      for (circle of this.circles) {
        circle.move(this.elapsedFrameTime, this.stage);
      }
      this.nightSounds.respondToLocation(this.circles[0].easelShape.x);
      this.daySounds.respondToLocation(this.circles[0].easelShape.x);
      for (motive of this.motives) {
        motive.interactWith(this.circles[0], this.elapsedTime);
        motive.circle.move(this.elapsedFrameTime, this.stage);
      }
    }
  },

  drawFrame: function() {
    this.stage.update();
  },

  addCircle: function(color, soundUri) {
    this.circleCount++;
    var sound = new Sound("Circle" + this.circleCount, soundUri);
    var circle = new Circle(50, color, sound);
    this.circles.push(circle);
    this.stage.addChild(circle.easelShape);
  },

  addCounter: function() {
    this.counter = new Counter();
    this.stage.addChild(this.counter.easelShape);
  },

  addNightSounds: function() {
    this.nightSounds = new HorizontalSound("Night", "//s3-us-west-2.amazonaws.com/pagescape/nighttime.mp3", 0);
  },

  addDaySounds: function() {
    this.daySounds = new HorizontalSound("Day", "//s3-us-west-2.amazonaws.com/pagescape/forest-crows.mp3", 960);
  },

  addDrumTrack: function() {
    var tail = new Sound("DrumTail", "//s3-us-west-2.amazonaws.com/pagescape/DrumsTail.m4a");
    this.drumTrack = new SynchronizedSound("Drums", "//s3-us-west-2.amazonaws.com/pagescape/Drums.m4a", tail);
    var that = this;
    this.circles[0].setOnBottom(function() { that.drumTrack.trigger(that.elapsedTime, -1, 1.0); } );
  },

  addMotives: function() {
    var motive = new Motive("Thunder2", "//s3-us-west-2.amazonaws.com/pagescape/thunder-strike-2.mp3", "#555555", 1);
    this.motives.push(motive);
    this.stage.addChild(motive.circle.easelShape);
    var motive = new Motive("Bassline", "//s3-us-west-2.amazonaws.com/pagescape/Bassline.m4a", "#339933", 4);
    this.motives.push(motive);
    this.stage.addChild(motive.circle.easelShape);
    var motive = new Motive("Piano", "//s3-us-west-2.amazonaws.com/pagescape/Piano.m4a", "#333399", 2);
    this.motives.push(motive);
    this.stage.addChild(motive.circle.easelShape);
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
